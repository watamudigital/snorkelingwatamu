'use strict';
/* Vercel serverless API for public guest reviews.
 * Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN as Vercel environment variables.
 * Alternative environment names KV_REST_API_URL and KV_REST_API_TOKEN are supported.
 */
const crypto=require('node:crypto');
const EXPERIENCE_IDS=new Set(['blue-safari','blue-safari-privato','tramonto-mida-creek','pesca-altura','watersports','dhow-experience']);
const KEY='snorkelingwatamu:public-reviews:v1';
const url=()=>String(process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL||'').replace(/\/$/,'');
const token=()=>process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN||'';
const send=(res,status,payload)=>res.status(status).setHeader('Cache-Control','no-store').json(payload);
const store=async(command)=>{
 const response=await fetch(url(),{
  method:'POST',headers:{Authorization:'Bearer '+token(),'Content-Type':'application/json'},
  body:JSON.stringify(command),signal:AbortSignal.timeout(6500)
 });
 if(!response.ok)throw new Error('Storage service error');
 const result=await response.json();
 if(result.error)throw new Error('Storage command error');
 return result.result;
};
module.exports=async function handler(req,res){
 if(!['GET','POST'].includes(req.method)){
  res.setHeader('Allow','GET, POST');return send(res,405,{error:'method_not_allowed'});
 }
 if(!url()||!token())return send(res,503,{error:'storage_not_configured'});
 try{
  if(req.method==='GET'){
   const values=await store(['LRANGE',KEY,0,35]);
   const reviews=(values||[]).map(value=>{
    try{return JSON.parse(value);}catch{return null;}
   }).filter(Boolean).map(item=>({
    name:item.name,rating:item.rating,experience:item.experience,text:item.text,createdAt:item.createdAt
   }));
   return send(res,200,{reviews});
  }
  const origin=req.headers.origin;
  if(origin){
   try{
    if(new URL(origin).host!==req.headers.host)return send(res,403,{error:'origin'});
   }catch{return send(res,403,{error:'origin'});}
  }
  const length=Number(req.headers['content-length']||0);
  if(length>4500)return send(res,413,{error:'too_large'});
  const body=req.body&&typeof req.body==='object'?req.body:{};
  if(String(body.website||'').trim())return send(res,200,{success:true});
  const name=String(body.name||'').replace(/[\r\n\t\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim();
  const experience=String(body.experience||'');
  const text=String(body.text||'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim();
  const rating=Number(body.rating);
  if(name.length<2||name.length>50||text.length<20||text.length>900||!EXPERIENCE_IDS.has(experience)||!Number.isInteger(rating)||rating<1||rating>5||body.consent!==true){
   return send(res,400,{error:'invalid_review'});
  }
  // Restrict links and markup in automatically published reviews.
  if(/https?:\/\/|www\.|<\s*\/?[a-z]|@\S+\.\w{2,}/i.test(name+' '+text))return send(res,400,{error:'links_not_allowed'});
  // Limit automated/repeated postings, without storing any identifiable visitor address.
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  const id=crypto.createHash('sha256').update(ip+'|'+token()).digest('hex').slice(0,28);
  const rateKey=KEY+':rate:'+id;
  const attempts=Number(await store(['INCR',rateKey]));
  if(attempts===1)await store(['EXPIRE',rateKey,86400]);
  if(attempts>3)return send(res,429,{error:'rate_limit'});
  const review={
   name,experience,text,rating,
   createdAt:new Date().toISOString()
  };
  await store(['LPUSH',KEY,JSON.stringify(review)]);
  await store(['LTRIM',KEY,0,99]);
  return send(res,201,{success:true});
 }catch(error){
  return send(res,503,{error:'temporarily_unavailable'});
 }
};