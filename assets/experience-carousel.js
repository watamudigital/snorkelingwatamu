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
   gallery.classList.toggle('is-video-active',slides[active].tagName==='VIDEO');
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

  // Swipe horizontally to change photos/videos on touchscreens while
  // keeping vertical page scrolling and native video controls available.
  const track=gallery.querySelector('.photo-slides');
  if(track && slides.length>1){
   let touchStart=null;
   track.addEventListener('touchstart',event=>{
    touchStart=null;
    if(event.touches.length!==1)return;
    const target=event.target;
    if(target.closest && target.closest('button'))return;
    // Don't hijack video controls near the bottom of a playing video.
    if(slides[active].tagName==='VIDEO'){
     const rect=slides[active].getBoundingClientRect();
     if(event.touches[0].clientY>rect.bottom-65)return;
    }
    const touch=event.touches[0];
    touchStart={x:touch.clientX,y:touch.clientY};
   },{passive:true});
   track.addEventListener('touchend',event=>{
    if(!touchStart || event.changedTouches.length!==1){
     touchStart=null;
     return;
    }
    const end=event.changedTouches[0];
    const dx=end.clientX-touchStart.x;
    const dy=end.clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>=45 && Math.abs(dx)>Math.abs(dy)*1.3){
     show(active+(dx<0?1:-1));
    }
   },{passive:true});
   track.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  }
  show(0);
 });
})();
