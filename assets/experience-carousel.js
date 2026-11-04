/* Experience carousel and three independent image galleries. No external dependencies. */
(()=>{
 'use strict';
 const track=document.getElementById('experienceCarousel');
 if(!track)return;
 const cards=Array.from(track.querySelectorAll('[data-experience-card]'));
 const nav=Array.from(document.querySelectorAll('[data-experience-dir]'));
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const cardLeft=card=>track.scrollLeft+card.getBoundingClientRect().left-track.getBoundingClientRect().left;
 const currentCard=()=>cards.reduce((best,card,i)=>{
  const distance=Math.abs(cardLeft(card)-track.scrollLeft);
  return distance<best.distance?{index:i,distance}:best;
 },{index:0,distance:Infinity}).index;
 const updateNavigation=()=>{
  const last=Math.max(0,track.scrollWidth-track.clientWidth);
  for(const button of nav){
   button.disabled=Number(button.dataset.experienceDir)<0?track.scrollLeft<2:track.scrollLeft>=last-2;
  }
 };
 nav.forEach(button=>button.addEventListener('click',()=>{
  const dir=Number(button.dataset.experienceDir);
  const next=Math.min(cards.length-1,Math.max(0,currentCard()+dir));
  track.scrollTo({left:cardLeft(cards[next]),behavior:reduceMotion.matches?'auto':'smooth'});
 }));
 track.addEventListener('scroll',updateNavigation,{passive:true});
 window.addEventListener('resize',updateNavigation);
 updateNavigation();
 track.querySelectorAll('[data-photo-gallery]').forEach(gallery=>{
  const slides=Array.from(gallery.querySelectorAll('.photo-slide'));
  const dots=Array.from(gallery.querySelectorAll('[data-photo-index]'));
  let active=0;
  const show=index=>{
   active=(index+slides.length)%slides.length;
   slides.forEach((img,i)=>{
    img.classList.toggle('is-active',i===active);
    if(i===active)img.removeAttribute('aria-hidden');
    else img.setAttribute('aria-hidden','true');
   });
   dots.forEach((dot,i)=>{
    dot.classList.toggle('is-active',i===active);
    dot.setAttribute('aria-pressed',String(i===active));
   });
  };
  gallery.querySelectorAll('[data-photo-dir]').forEach(button=>{
   button.addEventListener('click',event=>{
    event.stopPropagation();
    show(active+Number(button.dataset.photoDir));
   });
  });
  dots.forEach(dot=>dot.addEventListener('click',event=>{
   event.stopPropagation();
   show(Number(dot.dataset.photoIndex));
  }));
  show(0);
 });
})();
