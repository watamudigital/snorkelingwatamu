// ECM safety and language integration. No third-party dependencies.
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const src=fs.readFileSync('assets/ecm-bootstrap.js','utf8');
new vm.Script(src);
const id='c64f3c2a-13ae-4ec1-8362-8bc54a7538e4';
assert(html.includes('siteId: "'+id+'"'));
assert(html.indexOf('window.gtag("consent", "default"')<html.indexOf('src="./assets/ecm-bootstrap.js"'),'Consent defaults must be synchronous');
assert(html.includes('analytics_storage: "denied"'));
async function testPolicy(policy,expectedScripts,lang){
 const injected=[],calls=[],win={__ECM_CONFIG__:{siteId:id,apiBase:'https://ecm.plus'}};
 const doc={documentElement:{lang},querySelector:()=>null,createElement:()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v}}),head:{appendChild(s){injected.push(s)}}};
 const fetch=(url,options)=>{calls.push({url,options});return Promise.resolve({ok:true,json:()=>Promise.resolve({site:{id},policy})})};
 vm.runInNewContext(src,{window:win,document:doc,fetch,encodeURIComponent},{timeout:1000});
 for(let i=0;i<12;i++)await Promise.resolve();
 assert.equal(calls.length,1);assert(calls[0].url.includes('lang='+lang));
 assert.equal(calls[0].options.credentials,'omit');
 assert.equal(injected.length,expectedScripts);
 if(expectedScripts){assert.equal(injected[0].src,'https://ecm.plus/ecm.js');assert.equal(injected[0].attrs['data-ecm-lang'],lang);assert.equal(injected[0].attrs['data-ecm-site'],id);}
}
(async()=>{await testPolicy(null,0,'de');await testPolicy({id:'ready',status:'published',version:1},1,'fr');console.log('OK: ECM draft fail-closed; published policy loads official runtime and per-page locale');})().catch(e=>{console.error(e);process.exitCode=1});
