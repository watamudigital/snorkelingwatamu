/* Click-to-enlarge galleries for the four experiences; no arrows or dots on cards.
   Full-screen media supports touch swipes, image clicks, and keyboard arrows. */
(()=>{
 'use strict';
 const region=document.getElementById('experienceCarousel');
 if(!region)return;
 const words={
  it:{close:'Chiudi la galleria',hint:'Scorri con il dito o tocca la foto per continuare'},
  en:{close:'Close gallery',hint:'Swipe or tap the photo to see the next one'},
  de:{close:'Galerie schließen',hint:'Wischen oder auf das Foto tippen, um weiterzugehen'},
  fr:{close:'Fermer la galerie',hint:'Balayez ou touchez la photo pour continuer'}
 };
 const language=()=>words[document.documentElement.lang]||words.it;
 const dialog=document.createElement('dialog');
 dialog.className='experience-lightbox';
 dialog.innerHTML='<div class="experience-lightbox-shell"><button class="experience-lightbox-close" type="button" aria-label="Chiudi la galleria">×</button><div class="experience-lightbox-stage"></div><button type="button" class="experience-lightbox-nav experience-lightbox-prev" aria-label="Foto precedente">‹</button><button type="button" class="experience-lightbox-nav experience-lightbox-next" aria-label="Foto successiva">›</button><div class="experience-lightbox-footer"><span class="experience-lightbox-count" aria-live="polite"></span><span class="experience-lightbox-hint"></span></div></div>';
 document.body.appendChild(dialog);
 const close=dialog.querySelector('.experience-lightbox-close');
 const stage=dialog.querySelector('.experience-lightbox-stage');
 const counter=dialog.querySelector('.experience-lightbox-count');
 const hint=dialog.querySelector('.experience-lightbox-hint');
 const lightboxPrev=dialog.querySelector('.experience-lightbox-prev');
 const lightboxNext=dialog.querySelector('.experience-lightbox-next');
 let selection=null;
 let index=0;
 let previousFocus=null;

 function show(next){
  if(!selection||!selection.length)return;
  index=(next+selection.length)%selection.length;
  const current=stage.querySelector('video');
  if(current)current.pause();
  stage.replaceChildren();
  const source=selection[index];
  let content;
  if(source.kind==='creek'){
   content=source.element.cloneNode(true);
   content.removeAttribute('tabindex');
   content.setAttribute('role','img');
   content.removeAttribute('data-i18n-aria-label');
   content.removeAttribute('aria-label');
   content.classList.add('experience-lightbox-creek');
   const tag=content.querySelector('.pill');
   if(tag)tag.remove();
  }else if(source.tagName==='VIDEO'){
   content=document.createElement('video');
   content.src=source.getAttribute('src');
   content.poster=source.getAttribute('poster')||'';
   content.controls=true;
   content.playsInline=true;
   content.preload='metadata';
   content.setAttribute('aria-label',source.getAttribute('aria-label')||'Video');
  }else{
   content=document.createElement('img');
   content.src=source.getAttribute('src');
   content.alt=source.getAttribute('alt')||'';
   content.draggable=false;
   content.decoding='async';
   content.addEventListener('click',()=>show(index+1));
   content.title=language().hint;
  }
  stage.appendChild(content);
  counter.textContent=(index+1)+' / '+selection.length;
  hint.textContent=selection.length>1?language().hint:'';
  lightboxPrev.hidden=lightboxNext.hidden=selection.length<2;
  lightboxPrev.setAttribute('aria-label',({it:'Foto o video precedente',en:'Previous photo or video',de:'Vorheriges Foto oder Video',fr:'Photo ou vidéo précédente'})[document.documentElement.lang]||'Previous');
  lightboxNext.setAttribute('aria-label',({it:'Foto o video successivo',en:'Next photo or video',de:'Nächstes Foto oder Video',fr:'Photo ou vidéo suivante'})[document.documentElement.lang]||'Next');
  close.setAttribute('aria-label',language().close);
 }

 function open(items,title){
  if(!items.length)return;
  previousFocus=document.activeElement;
  selection=items;
  dialog.setAttribute('aria-label',title);
  show(0);
  if(typeof dialog.showModal==='function')dialog.showModal();
  else dialog.setAttribute('open','');
  close.focus();
 }
 function dismiss(){
  if(typeof dialog.close==='function'&&dialog.open)dialog.close();
  else{
   dialog.removeAttribute('open');
   cleanup();
  }
 }
 function cleanup(){
  const playing=stage.querySelector('video');
  if(playing)playing.pause();
  stage.replaceChildren();
  selection=null;
  if(previousFocus&&typeof previousFocus.focus==='function')previousFocus.focus();
  previousFocus=null;
 }
 close.addEventListener('click',dismiss);
 lightboxPrev.addEventListener('click',()=>show(index-1));
 lightboxNext.addEventListener('click',()=>show(index+1));
 dialog.addEventListener('close',cleanup);
 dialog.addEventListener('click',event=>{if(event.target===dialog)dismiss();});
 document.addEventListener('keydown',event=>{
  if(!dialog.open||!selection||selection.length<2)return;
  if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
 });
 let touchStart=null;
 stage.addEventListener('touchstart',event=>{
  touchStart=null;
  if(event.touches.length!==1)return;
  if(event.target.closest('video')){
   const rect=event.target.getBoundingClientRect();
   if(event.touches[0].clientY>rect.bottom-75)return;
  }
  touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};
 },{passive:true});
 stage.addEventListener('touchend',event=>{
  if(!touchStart||event.changedTouches.length!==1||!selection||selection.length<2){touchStart=null;return;}
  const dx=event.changedTouches[0].clientX-touchStart.x;
  const dy=event.changedTouches[0].clientY-touchStart.y;
  touchStart=null;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)show(index+(dx<0?1:-1));
 },{passive:true});
 stage.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});

 region.querySelectorAll('[data-photo-gallery]').forEach(gallery=>{
  const track=gallery.querySelector('.photo-slides');
  const media=Array.from(gallery.querySelectorAll('.photo-slide'));
  const title=gallery.closest('.experience')?.querySelector('h3');
  if(!track||!media.length)return;
  // Preserve first cover photo, but render other photos and videos only in the modal.
  media.forEach((item,i)=>{
   item.classList.toggle('is-active',i===0);
   if(i===0)item.removeAttribute('aria-hidden');
   else item.setAttribute('aria-hidden','true');
   if(item.tagName==='VIDEO')item.pause();
  });
  // Watersports and Mida Creek: no arrows; tap/click or swipe horizontally.
  // Preserve all existing photos and videos as individual slides.
  if(gallery.closest('[aria-labelledby="experience-title-3"]') || gallery.closest('.experience-creek')){
   let current=0;
   let gesture=null;
   let suppressClick=false;
   track.classList.add('watersports-tap-gallery');
   const counter=document.createElement('span');
   counter.className='watersports-slide-count';
   counter.setAttribute('aria-live','polite');
   gallery.appendChild(counter);
   // A dedicated play button avoids browsers swallowing clicks on videos inside a swipeable gallery.
   const playVideo=document.createElement('button');
   playVideo.type='button';
   playVideo.className='gallery-video-play';
   playVideo.textContent='▶';
   playVideo.setAttribute('aria-label',({it:'Riproduci video',en:'Play video',de:'Video abspielen',fr:'Lire la vidéo'})[document.documentElement.lang]||'Play video');
   gallery.appendChild(playVideo);
   playVideo.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    const video=media[current];
    if(video&&video.tagName==='VIDEO'){
     video.setAttribute('controls','');
     const attempt=video.play();
     if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{video.controls=true;});
    }
   });
   const showSlide=n=>{
    current=(n+media.length)%media.length;
    media.forEach((item,i)=>{
     const visible=i===current;
     item.classList.toggle('is-active',visible);
     item.setAttribute('aria-hidden',visible?'false':'true');
     if(item.tagName==='VIDEO'&&!visible)item.pause();
    });
    counter.textContent=(current+1)+' / '+media.length;
    const activeVideo=media[current]?.tagName==='VIDEO';
    playVideo.hidden=!activeVideo;
    if(activeVideo){
     const currentVideo=media[current];
     playVideo.hidden=!currentVideo.paused;
     currentVideo.onplay=()=>{playVideo.hidden=true;};
     currentVideo.onpause=()=>{if(media[current]===currentVideo)playVideo.hidden=false;};
     currentVideo.onended=()=>{if(media[current]===currentVideo)playVideo.hidden=false;};
    }
   };
   showSlide(0);
   track.addEventListener('pointerdown',event=>{
    if(event.target.closest('video'))return;
    gesture={x:event.clientX,y:event.clientY};
   });
   track.addEventListener('pointerup',event=>{
    if(!gesture)return;
    const dx=event.clientX-gesture.x;
    const dy=event.clientY-gesture.y;
    gesture=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){
     suppressClick=true;
     showSlide(current+(dx<0?1:-1));
    }
   });
   track.addEventListener('pointercancel',()=>{gesture=null;});
   track.addEventListener('click',event=>{
    if(suppressClick){suppressClick=false;return;}
    if(event.target.closest('video'))return;
    showSlide(current+1);
   });
   track.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
     event.preventDefault();
     showSlide(current+(event.key==='ArrowRight'?1:-1));
    }else if(event.key==='Enter'||event.key===' '){
     event.preventDefault();
     showSlide(current+1);
    }
   });
   return;
  }
  // Allow Watersports and Mida Creek images to be browsed on the card itself.
  // The card image remains clickable for the full-screen gallery.
  if(gallery.closest('.experience-creek') || gallery.closest('[aria-labelledby="experience-title-3"]')){
   let cardIndex=0;
   const controls=document.createElement('div');
   controls.className='oncard-gallery-controls';
   const previous=document.createElement('button');
   const next=document.createElement('button');
   previous.type=next.type='button';
   previous.className='oncard-gallery-arrow';
   next.className='oncard-gallery-arrow';
   previous.textContent='‹';
   next.textContent='›';
   const updateLabels=()=>{
    const lang=document.documentElement.lang;
    previous.setAttribute('aria-label',({it:'Foto o video precedente',en:'Previous photo or video',de:'Vorheriges Foto oder Video',fr:'Photo ou vidéo précédente'})[lang]||'Precedente');
    next.setAttribute('aria-label',({it:'Foto o video successivo',en:'Next photo or video',de:'Nächstes Foto oder Video',fr:'Photo ou vidéo suivante'})[lang]||'Successivo');
   };
   updateLabels();
   const count=document.createElement('span');
   count.className='oncard-gallery-count';
   count.setAttribute('aria-live','polite');
   const showCard=(n)=>{
    cardIndex=(n+media.length)%media.length;
    media.forEach((item,i)=>{
     const active=i===cardIndex;
     item.classList.toggle('is-active',active);
     item.setAttribute('aria-hidden',active?'false':'true');
     if(item.tagName==='VIDEO'&&!active)item.pause();
    });
    count.textContent=(cardIndex+1)+' / '+media.length;
   };
   for(const [button,dir] of [[previous,-1],[next,1]]){
    button.addEventListener('click',event=>{event.stopPropagation();showCard(cardIndex+dir);});
    controls.appendChild(button);
   }
   controls.appendChild(count);
   gallery.appendChild(controls);
   showCard(0);
  }
  // Clicking the gallery image opens the full-size image; the modal has click arrows.
  const activate=()=>open(media,title?.textContent||'Galleria');
  track.addEventListener('click',activate);
  track.addEventListener('keydown',event=>{
   if(event.key==='Enter'||event.key===' '){
    event.preventDefault();
    activate();
   }
  });
 });
 const creek=region.querySelector('.experience-creek .creek-sunset-visual');
 if(creek){
  const activate=()=>open([{kind:'creek',element:creek}],region.querySelector('#experience-title-4')?.textContent||'Mida Creek');
  creek.addEventListener('click',activate);
  creek.addEventListener('keydown',event=>{
   if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
  });
 }
})();
