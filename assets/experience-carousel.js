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
 dialog.innerHTML='<div class="experience-lightbox-shell"><button class="experience-lightbox-close" type="button" aria-label="Chiudi la galleria">×</button><div class="experience-lightbox-stage"></div><div class="experience-lightbox-footer"><span class="experience-lightbox-count" aria-live="polite"></span><span class="experience-lightbox-hint"></span></div></div>';
 document.body.appendChild(dialog);
 const close=dialog.querySelector('.experience-lightbox-close');
 const stage=dialog.querySelector('.experience-lightbox-stage');
 const counter=dialog.querySelector('.experience-lightbox-count');
 const hint=dialog.querySelector('.experience-lightbox-hint');
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
