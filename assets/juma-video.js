/* Enable the Juma story video only when its MP4 is available on the website.
   Until the file is uploaded, keep the current Subira image visible. */
(()=>{
 'use strict';
 const video=document.querySelector('[data-juma-video]');
 if(!video)return;
 const wrapper=video.closest('.juma-story-visual');
 const fallback=wrapper?.querySelector('.juma-story-fallback');
 const url=video.dataset.videoSrc;
 if(!wrapper||!fallback||!url)return;

 const showFallback=()=>{
  video.pause();
  video.hidden=true;
  fallback.hidden=false;
  wrapper.classList.remove('is-video-ready');
 };
 video.addEventListener('error',showFallback);

 fetch(url,{method:'HEAD'})
  .then(response=>{
   if(!response.ok)return;
   const type=response.headers.get('content-type')||'';
   if(type && !/video\//i.test(type) && !/octet-stream/i.test(type))return;
   video.src=url;
   video.hidden=false;
   fallback.hidden=true;
   wrapper.classList.add('is-video-ready');
   video.load();
   const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   if(reduced)video.autoplay=false;
   else video.play().catch(()=>{ /* Controls remain available if autoplay is blocked. */ });
  })
  .catch(()=>{ /* No network or missing video: keep the original image. */ });
})();
