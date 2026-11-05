/* Independent image galleries for the three responsive experience cards. */
(()=>{
 'use strict';
 const region=document.getElementById('experienceCarousel');
 if(!region)return;
 region.querySelectorAll('[data-photo-gallery]').forEach(gallery=>{
  const slides=Array.from(gallery.querySelectorAll('.photo-slide'));
  const dots=Array.from(gallery.querySelectorAll('[data-photo-index]'));
  if(!slides.length)return;
  let active=0;
  const show=index=>{
   active=(index+slides.length)%slides.length;
   slides.forEach((media,i)=>{
    const selected=i===active;
    media.classList.toggle('is-active',selected);
    if(selected)media.removeAttribute('aria-hidden');
    else {
     media.setAttribute('aria-hidden','true');
     // A gallery video must not keep playing after leaving its slide.
     if(media.tagName==='VIDEO')media.pause();
    }
   });
   dots.forEach((dot,i)=>{
    const selected=i===active;
    dot.classList.toggle('is-active',selected);
    dot.setAttribute('aria-pressed',String(selected));
   });
  };
  gallery.querySelectorAll('[data-photo-dir]').forEach(button=>{
   button.addEventListener('click',()=>{
    show(active+Number(button.dataset.photoDir));
   });
  });
  dots.forEach(dot=>{
   dot.addEventListener('click',()=>show(Number(dot.dataset.photoIndex)));
  });
  show(0);
 });
})();
