/* The hero starts muted for reliable autoplay. A deliberate tap enables sound. */
(()=>{
 'use strict';
 const video=document.querySelector('#home .hero-background-video');
 const button=document.getElementById('heroAudioToggle');
 if(!video||!button)return;
 const on=button.querySelector('[data-i18n="heroAudioOn"]');
 const off=button.querySelector('[data-i18n="heroAudioOff"]');
 if(!on||!off)return;

 const sync=()=>{
  const silent=video.muted||video.volume===0;
  on.hidden=!silent;
  off.hidden=silent;
  button.setAttribute('aria-pressed',String(!silent));
  button.setAttribute('aria-label',(silent?on:off).textContent.trim());
 };
 video.muted=true;
 sync();
 button.addEventListener('click',()=>{
  if(video.muted||video.volume===0){
   video.volume=1;
   video.muted=false;
   // A tap or click meets browser requirements for audible video playback.
   const playback=video.play();
   if(playback && typeof playback.catch==='function'){
    playback.catch(()=>{
     video.muted=true;
     sync();
    });
   }
  }else{
   video.muted=true;
  }
  sync();
 });
 video.addEventListener('volumechange',sync);
 video.addEventListener('error',()=>{
  video.muted=true;
  button.hidden=true;
 });
})();
