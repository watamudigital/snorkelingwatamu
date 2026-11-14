#!/usr/bin/env node
'use strict';
/* Generate one accessible, search-ready detail page per experience and language. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const DIST=path.join(ROOT,'dist');
const ORIGIN='https://www.snorkelingwatamu.com';
const LANGS=['it','en','de','fr'];
const home=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const app=fs.readFileSync(path.join(ROOT,'assets/app.js'),'utf8');
const extras=fs.readFileSync(path.join(ROOT,'assets/translations.js'),'utf8');
const baseMatch=app.match(/const tr=(\{[\s\S]*?\n \});/);
if(!baseMatch)throw Error('Translations not found');
const base=vm.runInNewContext('('+baseMatch[1]+')');
const ctx={window:{}};
vm.runInNewContext(extras,ctx);
const translations=ctx.window.SW_TRANSLATIONS;
const safe=v=>String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const LOCAL={
it:{home:'Tutte le esperienze',subtitle:'Watamu · Kenya · Oceano Indiano',back:'Torna alle esperienze',intro:'Vivi questa esperienza con Juma',gallery:'Foto e video autentici',plan:'Organizza la tua escursione',custom:'Richiedi un preventivo personalizzato',contact:'Contatta direttamente',juma:'Parla con Juma',luisa:'Parla con Luisa',availability:'Itinerario, durata, disponibilità e prezzo vengono concordati direttamente. Le attività dipendono dalle condizioni del mare e dalla sicurezza.',choice:'Altre esperienze',quote:'Preventivo su richiesta',note:'Nessuna prenotazione o pagamento automatico sul sito.',whatsapp:'Scrivi su WhatsApp',video:'Video dell’esperienza',lang:'Lingua',details:'Un’esperienza su misura'},
en:{home:'All experiences',subtitle:'Watamu · Kenya · Indian Ocean',back:'Back to experiences',intro:'Discover this experience with Juma',gallery:'Authentic photos and videos',plan:'Plan your day at sea',custom:'Request a personalised quote',contact:'Contact directly',juma:'Talk to Juma',luisa:'Talk to Luisa',availability:'Route, duration, availability and price are arranged directly. Activities depend on sea conditions and safety.',choice:'More experiences',quote:'Quote on request',note:'No automatic booking or payment is taken on this website.',whatsapp:'Message on WhatsApp',video:'Experience video',lang:'Language',details:'An experience made for you'},
de:{home:'Alle Erlebnisse',subtitle:'Watamu · Kenia · Indischer Ozean',back:'Zurück zu den Erlebnissen',intro:'Erlebe dieses Abenteuer mit Juma',gallery:'Authentische Fotos und Videos',plan:'Plane deinen Ausflug',custom:'Individuelles Angebot anfordern',contact:'Direkt kontaktieren',juma:'Mit Juma sprechen',luisa:'Mit Luisa sprechen',availability:'Route, Dauer, Verfügbarkeit und Preis werden direkt vereinbart. Die Aktivitäten hängen von den Meeresbedingungen und der Sicherheit ab.',choice:'Weitere Erlebnisse',quote:'Preis auf Anfrage',note:'Keine automatische Buchung oder Zahlung auf dieser Website.',whatsapp:'WhatsApp-Nachricht senden',video:'Video vom Erlebnis',lang:'Sprache',details:'Ein Erlebnis nach deinen Wünschen'},
fr:{home:'Toutes les expériences',subtitle:'Watamu · Kenya · Océan Indien',back:'Retour aux expériences',intro:'Vivez cette expérience avec Juma',gallery:'Photos et vidéos authentiques',plan:'Organisez votre sortie',custom:'Demander un devis personnalisé',contact:'Contacter directement',juma:'Parler avec Juma',luisa:'Parler avec Luisa',availability:'Le parcours, la durée, la disponibilité et le prix sont convenus directement. Les activités dépendent des conditions de mer et de la sécurité.',choice:'Autres expériences',quote:'Devis sur demande',note:'Aucune réservation ni paiement automatique sur le site.',whatsapp:'Envoyer un message WhatsApp',video:'Vidéo de l’expérience',lang:'Langue',details:'Une expérience sur mesure'}
};
// Keep the Safari detail pages in the same media order as the home galleries.
function safariSlides(titleId){
 const marker='aria-labelledby="'+titleId+'">';
 const start=home.indexOf(marker);
 if(start<0)throw Error('Safari gallery not found: '+titleId);
 const article=home.slice(start,home.indexOf('</article>',start));
 return [...article.matchAll(/<(img|video) class="photo-slide\b[^>]*>/g)].map(([tag,type])=>{
  const attr=name=>tag.match(new RegExp(' '+name+'="([^"]*)"'))?.[1];
  return {
   type,
   src:attr('src').replace(/^\.\//,'/'),
   poster:attr('poster'),
   labelKey:attr(type==='img'?'data-i18n-alt':'data-i18n-aria-label'),
   label:attr(type==='img'?'alt':'aria-label')
  };
 });
}
const definitions=[
 {slug:'blue-safari',title:'card2Title',tag:'card2Tag',desc:'card2Text',cover:'/assets/images/watamu-glass-bottom-boat-subira-kenya.jpg',media:safariSlides('experience-title-1')},
 {slug:'blue-safari-privato',title:'privateSafariTitle',tag:'privateSafariBadge',desc:'privateSafariDesc',cover:'/assets/images/blue-safari-private-poster.jpg',media:safariSlides('private-safari-title')},
{slug:'pesca-altura',title:'card1Title',tag:'fishingWhiteBadge',desc:'card1Text',cover:'/assets/images/IMG_0053.jpeg',
 photos:['IMG_0053.jpeg','Juma mit Fischen auf sonniger See.png'],
 videos:['/assets/videos/fishing-portrait.mp4']},
{slug:'watersports',title:'card3Title',tag:'card3Tag',desc:'card3Text',cover:'/assets/images/IMG_0034.jpeg',
 photos:['IMG_0034.jpeg','Avventura sul banana boat in mare.png','IMG_0252.jpeg','IMG_0251.jpeg'],
 videos:['/assets/videos/VIDEO-2026-11-05-18-00-01.mp4','/assets/videos/watersports-latest.mp4']},
{slug:'tramonto-mida-creek',title:'creekTitle',tag:'creekTag',desc:'creekDesc',cover:'/assets/images/IMG_0141.jpeg',
 photos:['Tramonto dorato in barca.png','IMG_0141.jpeg','IMG_0256.jpeg'],
 videos:['/assets/videos/mida-creek-sunset-latest.mp4']},
{slug:'dhow-experience',title:'dhowTitle',tag:'dhowTag',desc:'dhowDesc',cover:'/assets/images/IMG_0310.jpeg',
 photos:['IMG_0310.jpeg','IMG_0312.jpeg'],
 videos:['/assets/videos/50834581-3625-4c17-a343-98ae20cb38ef.mov']}
];
function cardTitle(entry,dict){return dict[entry.title]||entry.slug}
function page(entry,lang){
 const dict={...(base[lang]||{}),...(translations[lang]||{})};
 const w=LOCAL[lang];
 const title=cardTitle(entry,dict),desc=dict[entry.desc]||'';
 const url=ORIGIN+'/'+lang+'/'+entry.slug+'/';
 const href=slug=>'/'+lang+'/'+slug+'/';
 const alternates=LANGS.map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+ORIGIN+'/'+code+'/'+entry.slug+'/">').join('\n');
 const others=definitions.filter(other=>other.slug!==entry.slug).map(other=>{
  return '<a class="more-card" href="'+href(other.slug)+'"><img src="'+safe(other.cover)+'" loading="lazy" alt=""><span>'+safe(cardTitle(other,dict))+' <span aria-hidden="true">↗</span></span></a>';
 }).join('');
 const media=entry.media??[
  ...entry.photos.map((filename,i)=>({type:'img',src:'/assets/images/'+encodeURIComponent(filename),label:title+' · '+(i+1)})),
  ...entry.videos.map((src,i)=>({type:'video',src,label:w.video+' '+(i+1)}))
 ];
 const tiles=media.map(({type,src,poster,labelKey,label})=>{
  const text=safe(dict[labelKey]||label);
  const image=poster?' poster="'+safe(poster)+'"':'';
  const element=type==='img'
   ? '<img loading="lazy" decoding="async" src="'+safe(src)+'" alt="'+text+'">'
   : '<video controls playsinline preload="metadata" src="'+safe(src)+'"'+image+' aria-label="'+text+'"></video>';
  return '<figure class="media-tile">'+element+'</figure>';
 }).join('');
 const languages=LANGS.map(code=>'<a href="/'+code+'/'+entry.slug+'/" lang="'+code+'" '+(code===lang?'aria-current="page"':'')+'>'+code.toUpperCase()+'</a>').join('');
 const jumaMsg=encodeURIComponent(title+' – '+w.custom);
 const contact=(number,name,flags)=>'<div class="contact-person"><span class="contact-name">'+safe(name)+'</span><span class="flags">'+flags+'</span><a class="phone" href="tel:+'+number+'">+'+(number==='254741457022'?'254 741 457 022':'41 77 512 92 41')+'</a><a class="whatsapp" href="https://wa.me/'+number+'?text='+jumaMsg+'" target="_blank" rel="noopener noreferrer">'+safe(w.whatsapp)+' ↗</a></div>';
 const schema={'@context':'https://schema.org','@type':'WebPage',name:title+' | Snorkeling Watamu',url:url,description:desc,inLanguage:lang};
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#062633">'+
 '<title>'+safe(title)+' | Snorkeling Watamu</title><meta name="description" content="'+safe(desc)+'">'+
 '<link rel="canonical" href="'+url+'">'+alternates+'<link rel="alternate" hreflang="x-default" href="'+ORIGIN+'/it/'+entry.slug+'/">'+
 '<meta property="og:type" content="article"><meta property="og:title" content="'+safe(title)+' | Snorkeling Watamu">'+
 '<meta property="og:description" content="'+safe(desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="'+ORIGIN+entry.cover+'">'+
 '<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>'+
 '<link rel="stylesheet" href="/assets/styles.css">'+
 '<style>'+
 'body{background:#f7faf7;color:#123c43} .subpage-nav{background:#062633;color:white;padding:14px 0} .subpage-nav-inner{display:flex;justify-content:space-between;gap:18px;align-items:center;flex-wrap:wrap} .subpage-brand{font-weight:900;color:white;text-decoration:none;font-size:21px}.subpage-brand em{color:#c9f37b;font-style:normal}.subpage-lang{display:flex;gap:6px}.subpage-lang a{color:white;text-decoration:none;font-size:12px;border:1px solid #72928e;border-radius:30px;padding:7px 11px}.subpage-lang a[aria-current]{background:#c9f37b;color:#123c43;border-color:#c9f37b} .subpage-wrap{max-width:1120px;margin:0 auto;padding:0 24px} .subpage-back{display:inline-block;margin:32px 0;color:#117e72;text-decoration:none;font-weight:750}.subpage-hero{display:grid;grid-template-columns:1fr 1fr;gap:38px;align-items:center;margin:0 0 45px}.subpage-hero img{display:block;width:100%;max-height:470px;height:420px;object-fit:cover;border-radius:24px}.subpage-kicker{color:#168477;font-size:12px;letter-spacing:.15em;text-transform:uppercase;font-weight:850}.subpage-hero h1{font-size:clamp(42px,5vw,74px);line-height:1.05;letter-spacing:-.055em;margin:18px 0}.subpage-lead{font-size:17px;line-height:1.75;color:#516f70}.subpage-btn{display:inline-block;padding:14px 24px;border-radius:35px;background:#c9f37b;color:#103d3c;text-decoration:none;font-weight:850;margin-top:16px}.subpage-section{margin:50px 0}.subpage-section h2{font-size:clamp(28px,4vw,42px);margin:0 0 23px;line-height:1.1}.subpage-media{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.media-tile{padding:0;margin:0;background:#e5f0e9;border-radius:16px;overflow:hidden;min-height:180px;aspect-ratio:4/3}.media-tile img,.media-tile video{display:block;width:100%;height:100%;object-fit:cover}.subpage-info{display:grid;grid-template-columns:1fr 1.2fr;gap:24px}.subpage-note,.subpage-contacts{border-radius:20px;background:white;padding:26px;border:1px solid #dcebe4}.subpage-note p{line-height:1.7;color:#516f70}.subpage-contacts .contact-person{display:flex;flex-direction:column;gap:8px;padding:4px 0 20px}.subpage-contacts .contact-person+.contact-person{border-top:1px solid #dcebe4;padding-top:20px}.contact-name{font-weight:850}.flags{font-size:23px}.phone{font-size:clamp(23px,3vw,32px);font-weight:850;color:#0d5055;text-decoration:none}.whatsapp{align-self:flex-start;display:inline-block;background:#126e5d;color:#fff;border-radius:30px;padding:10px 18px;text-decoration:none;font-weight:750;font-size:13px}.more-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.more-card{background:white;display:flex;flex-direction:column;border:1px solid #dcebe4;border-radius:14px;overflow:hidden;color:#123c43;text-decoration:none;font-weight:800}.more-card img{width:100%;height:120px;object-fit:cover}.more-card span{padding:11px}.subpage-footer{background:#062633;color:white;text-align:center;padding:26px 0;margin-top:55px}.subpage-footer a{color:#c9f37b}@media(max-width:800px){.subpage-hero,.subpage-info{grid-template-columns:1fr}.subpage-media,.more-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.subpage-hero img{height:320px}}@media(max-width:480px){.subpage-wrap{padding:0 17px}.subpage-media,.more-grid{grid-template-columns:1fr}.media-tile{aspect-ratio:16/10}.subpage-hero img{height:250px}.subpage-hero{gap:20px}.subpage-back{margin:22px 0}.subpage-hero h1{font-size:44px}}'+
 '</style></head><body>'+
 '<header class="subpage-nav"><div class="subpage-wrap subpage-nav-inner"><a class="subpage-brand" href="/'+lang+'/">snorkeling<em>watamu</em></a><nav class="subpage-lang" aria-label="'+safe(w.lang)+'">'+languages+'</nav></div></header>'+
 '<main class="subpage-wrap"><a class="subpage-back" href="/'+lang+'/#experiences">← '+safe(w.back)+'</a>'+
 '<section class="subpage-hero"><div><div class="subpage-kicker">'+safe(w.subtitle)+'</div><h1>'+safe(title)+'</h1><p class="subpage-lead">'+safe(desc)+'</p><a class="subpage-btn" href="/'+lang+'/#custom-trip">'+safe(w.custom)+' ↗</a></div><img src="'+safe(entry.cover)+'" alt="'+safe(title)+'"></section>'+
 '<section class="subpage-section"><h2>'+safe(w.gallery)+'</h2><div class="subpage-media">'+tiles+'</div></section>'+
 '<section class="subpage-section subpage-info"><div class="subpage-note"><div class="subpage-kicker">'+safe(w.details)+'</div><h2>'+safe(w.plan)+'</h2><p>'+safe(w.availability)+'</p><p>'+safe(w.note)+'</p><a class="subpage-btn" href="/'+lang+'/#custom-trip">'+safe(w.custom)+' ↗</a></div><div class="subpage-contacts" id="contacts"><h2>'+safe(w.contact)+'</h2>'+contact('254741457022',w.juma,'🇬🇧 🇮🇹 🇰🇪')+contact('41775129241',w.luisa,'🇫🇷 🇮🇹 🇬🇧 🇪🇸 🇩🇪')+'</div></section>'+
 '<section class="subpage-section"><h2>'+safe(w.choice)+'</h2><div class="more-grid">'+others+'</div></section>'+
 '</main><footer class="subpage-footer"><a href="/'+lang+'/">'+safe(w.home)+'</a> · Watamu, Kenya</footer></body></html>';
}
for(const lang of LANGS){
 for(const entry of definitions){
  const location=path.join(DIST,lang,entry.slug);
  fs.mkdirSync(location,{recursive:true});
  fs.writeFileSync(path.join(location,'index.html'),page(entry,lang),'utf8');
 }
}
console.log('Built '+(LANGS.length*definitions.length)+' translated experience pages.');
