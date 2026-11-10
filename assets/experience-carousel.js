/* Accessible four-card galleries with visible arrows, swipe and desktop drag.
   Full-screen media preserves native video playback and keyboard navigation. */
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
 let suppressLightboxClick=false;

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
   content.addEventListener('click',()=>{if(suppressLightboxClick){suppressLightboxClick=false;return;}show(index+1);});
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

 function open(items,title,startIndex=0){
  if(!items.length)return;
  previousFocus=document.activeElement;
  suppressLightboxClick=false;
  selection=items;
  dialog.setAttribute('aria-label',title);
  show(startIndex);
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
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2){suppressLightboxClick=true;show(index+(dx<0?1:-1));}
 },{passive:true});
 stage.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});

 // Desktop mouse drag in the enlarged gallery (touch remains handled above).
 let modalDrag=null;
 stage.addEventListener('dragstart',event=>event.preventDefault());
 stage.addEventListener('pointerdown',event=>{
  if(event.pointerType==='touch'||event.button!==0||event.target.closest('video'))return;
  suppressLightboxClick=false;
  modalDrag={id:event.pointerId,x:event.clientX,y:event.clientY};
  if(stage.setPointerCapture)stage.setPointerCapture(event.pointerId);
 });
 stage.addEventListener('pointerup',event=>{
  if(!modalDrag||event.pointerId!==modalDrag.id)return;
  const dx=event.clientX-modalDrag.x;
  const dy=event.clientY-modalDrag.y;
  modalDrag=null;
  if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.2&&selection?.length>1){
   suppressLightboxClick=true;
   show(index+(dx<0?1:-1));
  }
 });
 stage.addEventListener('pointercancel',()=>{modalDrag=null;});



 // Visible arrows on every card. Navigation buttons are siblings of the image track,
 // so clicks and pointer swipes never interfere with each other.
 function addVisibleControls(gallery,media,move){
  const controls=document.createElement('div');
  controls.className='visible-gallery-controls';
  const previous=document.createElement('button');
  const next=document.createElement('button');
  const count=document.createElement('span');
  const titles={
   it:['Foto o video precedente','Foto o video successivo'],
   en:['Previous photo or video','Next photo or video'],
   de:['Vorheriges Foto oder Video','Nächstes Foto oder Video'],
   fr:['Photo ou vidéo précédente','Photo ou vidéo suivante']
  };
  const labels=titles[document.documentElement.lang]||titles.it;
  for(const [button,direction] of [[previous,-1],[next,1]]){
   button.type='button';
   button.className='visible-gallery-arrow '+(direction<0?'visible-gallery-prev':'visible-gallery-next');
   button.textContent=direction<0?'‹':'›';
   button.setAttribute('aria-label',labels[direction<0?0:1]);
   button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    const current=Math.max(0,media.findIndex(item=>item.classList.contains('is-active')));
    move(current+direction);
   });
   controls.appendChild(button);
  }
  count.className='visible-gallery-count';
  count.setAttribute('aria-live','polite');
  controls.appendChild(count);
  gallery.appendChild(controls);
  const update=()=>{
   count.textContent=(media.findIndex(item=>item.classList.contains('is-active'))+1)+' / '+media.length;
   previous.hidden=next.hidden=media.length<2;
  };
  update();
  return update;
 }

 region.querySelectorAll('[data-photo-gallery]').forEach(gallery=>{
  const track=gallery.querySelector('.photo-slides');
  const media=Array.from(gallery.querySelectorAll('.photo-slide'));
  const title=gallery.closest('.experience')?.querySelector('h3');
  if(!track||!media.length)return;
  media.filter(item=>item.tagName==='IMG').forEach(image=>{image.draggable=false;});
  track.addEventListener('dragstart',event=>event.preventDefault());
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
    event.preventDefault();
    event.stopPropagation();
    if(media[current]?.tagName==='VIDEO'){
     open(media,title?.textContent||'Galleria',current);
    }
   });
   let refreshVisibleCount=()=>{};
   const showSlide=n=>{
    current=(n+media.length)%media.length;
    media.forEach((item,i)=>{
     const visible=i===current;
     item.classList.toggle('is-active',visible);
     item.setAttribute('aria-hidden',visible?'false':'true');
     if(item.tagName==='VIDEO'&&!visible)item.pause();
    });
    counter.textContent=(current+1)+' / '+media.length;
    refreshVisibleCount();
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
   refreshVisibleCount=addVisibleControls(gallery,media,showSlide);
   // Videos launch enlarged with next/previous arrows; the small card stays arrow-free.
   media.filter(item=>item.tagName==='VIDEO').forEach(video=>{
    video.controls=false;
    video.setAttribute('tabindex','-1');
    video.style.pointerEvents='none';
   });
   track.addEventListener('pointerdown',event=>{
    if(event.target.closest('video'))return;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY};
    if(track.setPointerCapture)track.setPointerCapture(event.pointerId);
   });
   track.addEventListener('pointerup',event=>{
    if(!gesture||event.pointerId!==gesture.id)return;
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
    if(media[current]?.tagName==='VIDEO'){
     open(media,title?.textContent||'Galleria',current);
     return;
    }
    showSlide(current+1);
   });
   track.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
     event.preventDefault();
     showSlide(current+(event.key==='ArrowRight'?1:-1));
    }else if(event.key==='Enter'||event.key===' '){
     event.preventDefault();
     if(media[current]?.tagName==='VIDEO')open(media,title?.textContent||'Galleria',current);
     else showSlide(current+1);
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
  // Blue Safari and Fishing: on-card arrows and mouse/touch drag, with click-to-enlarge.
  let cardIndex=0;
  let refreshVisibleCount=()=>{};
  const playVideo=document.createElement('button');
  playVideo.type='button';
  playVideo.className='gallery-video-play';
  playVideo.textContent='▶';
  playVideo.setAttribute('aria-label',({it:'Riproduci video',en:'Play video',de:'Video abspielen',fr:'Lire la vidéo'})[document.documentElement.lang]||'Play video');
  gallery.appendChild(playVideo);
  media.filter(item=>item.tagName==='VIDEO').forEach(video=>{
   video.controls=false;
   video.tabIndex=-1;
   video.style.pointerEvents='none';
  });
  const showBasicSlide=n=>{
   cardIndex=(n+media.length)%media.length;
   media.forEach((item,i)=>{
    const active=i===cardIndex;
    item.classList.toggle('is-active',active);
    item.setAttribute('aria-hidden',active?'false':'true');
    if(item.tagName==='VIDEO'&&!active)item.pause();
   });
   playVideo.hidden=media[cardIndex]?.tagName!=='VIDEO';
   refreshVisibleCount();
  };
  showBasicSlide(0);
  refreshVisibleCount=addVisibleControls(gallery,media,showBasicSlide);
  const activate=()=>open(media,title?.textContent||'Galleria',cardIndex);
  playVideo.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();activate();});
  let drag=null,suppressClick=false;
  track.addEventListener('pointerdown',event=>{
   if(event.button!==0)return;
   suppressClick=false;
   drag={id:event.pointerId,x:event.clientX,y:event.clientY};
   if(track.setPointerCapture)track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointerup',event=>{
   if(!drag||drag.id!==event.pointerId)return;
   const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
   drag=null;
   if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.2){
    suppressClick=true;
    showBasicSlide(cardIndex+(dx<0?1:-1));
   }
  });
  track.addEventListener('pointercancel',()=>{drag=null;});
  track.addEventListener('click',()=>{
   if(suppressClick){suppressClick=false;return;}
   activate();
  });
  track.addEventListener('keydown',event=>{
   if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();
    showBasicSlide(cardIndex+(event.key==='ArrowRight'?1:-1));
   }else if(event.key==='Enter'||event.key===' '){
    event.preventDefault();
    activate();
   }
  });
 });
 // Switch between the original private safari clip and the dolphin footage.
 const privateMedia=region.querySelector('.private-safari-dual-video');
 if(privateMedia){
  const buttons=[...privateMedia.querySelectorAll('[data-private-video]')];
  const videos=[...privateMedia.querySelectorAll('[data-private-video-player]')];
  const selectVideo=name=>{
   videos.forEach(video=>{
    const active=video.dataset.privateVideoPlayer===name;
    if(!active)video.pause();
    video.hidden=!active;
   });
   buttons.forEach(button=>{
    const active=button.dataset.privateVideo===name;
    button.classList.toggle('is-selected',active);
    button.setAttribute('aria-pressed',String(active));
   });
  };
  buttons.forEach(button=>button.addEventListener('click',()=>selectVideo(button.dataset.privateVideo)));
  selectVideo('private');
 }
 const creek=region.querySelector('.experience-creek .creek-sunset-visual');
 if(creek){
  const activate=()=>open([{kind:'creek',element:creek}],region.querySelector('#experience-title-4')?.textContent||'Mida Creek');
  creek.addEventListener('click',activate);
  creek.addEventListener('keydown',event=>{
   if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
  });
 }
})();
