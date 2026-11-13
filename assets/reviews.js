/* Reviews visible to all visitors once a real server-side store is connected. */
(()=>{
 'use strict';
 const form=document.getElementById('guestReviewForm');
 const cards=document.querySelector('#reviews .reviews-cards');
 const status=document.getElementById('guestReviewStatus');
 if(!form||!cards||!status)return;
 const lang=['it','en','de','fr'].includes(document.documentElement.lang)?document.documentElement.lang:'it';
 const dict=(window.SW_TRANSLATIONS||{})[lang]||{};
 const submit=form.querySelector('[type="submit"]');
 const ratingInputs=[...form.querySelectorAll('input[name="rating"]')];
 const ratings=form.querySelector('.guest-review-stars');
 const setStatus=(key,error=false)=>{status.textContent=dict[key]||key;status.dataset.error=String(error);};
 const updateStars=()=>{
  const selected=Number(form.elements.rating.value||5);
  ratingInputs.forEach(input=>{
   input.parentElement.classList.toggle('is-selected',Number(input.value)<=selected);
  });
 };
 ratings.addEventListener('change',updateStars);
 updateStars();
 const titles={
  'blue-safari':document.querySelector('[data-exp-link="blue-safari"]')?.closest('.experience')?.querySelector('h3')?.textContent||'Blue Safari',
  'blue-safari-privato':document.querySelector('[data-exp-link="blue-safari-privato"]')?.closest('.experience')?.querySelector('h3')?.textContent||'Blue Safari privato',
  'pesca-altura':document.querySelector('[data-exp-link="pesca-altura"]')?.closest('.experience')?.querySelector('h3')?.textContent||'Pesca d’altura',
  'watersports':'Watersports',
  'tramonto-mida-creek':document.querySelector('[data-exp-link="tramonto-mida-creek"]')?.closest('.experience')?.querySelector('h3')?.textContent||'Mida Creek',
  'dhow-experience':'Dhow Experience'
 };
 const put=(node,cls,value)=>{
  const element=document.createElement(node);
  element.className=cls;
  element.textContent=value;
  return element;
 };
 const renderReviews=reviews=>{
  if(!reviews.length)return; // Do not fake reviews or ratings
  cards.replaceChildren();
  for(const review of reviews){
   if(!review||typeof review.text!=='string')continue;
   const article=document.createElement('article');
   article.className='reviews-card guest-review-published';
   const stars=put('div','review-stars','★'.repeat(Math.max(1,Math.min(5,Number(review.rating)||5)))+'☆'.repeat(Math.max(0,5-(Number(review.rating)||5))));
   stars.setAttribute('aria-label',String(review.rating)+' / 5');
   article.append(stars,put('p','review-guest-text',review.text));
   const bottom=put('div','reviews-card-bottom','');
   bottom.append(put('span','review-guest-name',review.name+' · '+(titles[review.experience]||'Watamu')));
   const date=new Date(review.createdAt);
   if(!Number.isNaN(date.getTime()))bottom.append(put('time','review-guest-date',date.toLocaleDateString(lang,{year:'numeric',month:'short'})));
   article.appendChild(bottom);
   cards.appendChild(article);
  }
 };
 let available=false;
 const load=async()=>{
  try{
   const response=await fetch('/api/reviews',{headers:{Accept:'application/json'},cache:'no-store'});
   if(!response.ok)throw Error('Storage unavailable');
   const payload=await response.json();
   if(!Array.isArray(payload.reviews))throw Error('Invalid payload');
   available=true;
   submit.disabled=false;
   renderReviews(payload.reviews);
   setStatus('reviewsEmpty');
  }catch(error){
   available=false;
   submit.disabled=true;
   setStatus('reviewsNotReady');
  }
 };
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!available||!form.reportValidity())return;
  submit.disabled=true;
  setStatus('reviewsSending');
  const fields=new FormData(form);
  try{
   const response=await fetch('/api/reviews',{
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({
     name:String(fields.get('reviewName')||'').trim(),
     experience:String(fields.get('experience')||''),
     rating:Number(fields.get('rating')||0),
     text:String(fields.get('reviewText')||'').trim(),
     consent:fields.get('consent')==='on',
     website:String(fields.get('website')||'')
    })
   });
   if(!response.ok)throw Error('Review submission failed');
   form.reset();updateStars();
   setStatus('reviewsSuccess');
   const list=await fetch('/api/reviews',{cache:'no-store'});
   if(list.ok){const data=await list.json();if(Array.isArray(data.reviews))renderReviews(data.reviews);}
  }catch(error){setStatus('reviewsError',true);}
  finally{submit.disabled=!available;}
 });
 load();
})();