#!/usr/bin/env node
'use strict';

/**
 * Build real, fully localised static HTML for each supported language.
 * Source of truth: index.html + assets/app.js + assets/translations.js.
 * No network requests, secrets, analytics, framework or external dependencies.
 */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const ROOT=path.resolve(__dirname,'..');
const DIST=path.join(ROOT,'dist');
const ORIGIN='https://www.snorkelingwatamu.com';
const LANGUAGES=['it','en','de','fr'];
const read=(name)=>fs.readFileSync(path.join(ROOT,name),'utf8');
const template=read('index.html');
const app=read('assets/app.js');
const extrasSource=read('assets/translations.js');

const baseMatch=app.match(/const tr=(\{[\s\S]*?\n \});/);
if(!baseMatch)throw new Error('Cannot extract base translation dictionary from assets/app.js');
const base=vm.runInNewContext('('+baseMatch[1]+')',{}, {timeout:2000});
const context={window:{}};
vm.runInNewContext(extrasSource,context,{timeout:2000});
const extra=context.window.SW_TRANSLATIONS||{};

const escapeHtml=(value)=>String(value)
 .replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const allowedKeys=[...new Set([...template.matchAll(/data-i18n(?:-placeholder|-alt|-aria-label)?="([^"]+)"/g)].map(m=>m[1]))];
const alternateLinks=LANGUAGES.map(code=>
 '  <link rel="alternate" hreflang="'+code+'" href="'+ORIGIN+'/'+code+'/">'
).join('\n')+'\n  <link rel="alternate" hreflang="x-default" href="'+ORIGIN+'/">';
const canonical=(code)=>ORIGIN+'/'+code+'/';

function withSeo(document,code,dictionary){
 const title=escapeHtml(dictionary.pageTitle);
 const description=escapeHtml(dictionary.metaDescription);
 const pageUrl=canonical(code);
 const photoUrl=ORIGIN+'/assets/images/watamu-glass-bottom-boat-subira-kenya.jpg';
 const socialLocale={it:'it_IT',en:'en_GB',de:'de_DE',fr:'fr_FR'}[code];
 document=document.replace(/<html lang="[^"]*">/,'<html lang="'+code+'">');
 document=document.replace(/<title>[\s\S]*?<\/title>/,'<title>'+title+'</title>');
 document=document.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+description+'">');
 const structuredData={
  '@context':'https://schema.org',
  '@graph':[
   {'@type':'WebSite','@id':ORIGIN+'/#website',name:'Snorkeling Watamu',url:ORIGIN+'/',inLanguage:LANGUAGES},
   {'@type':'WebPage','@id':pageUrl+'#webpage',url:pageUrl,name:dictionary.pageTitle,description:dictionary.metaDescription,inLanguage:code,isPartOf:{'@id':ORIGIN+'/#website'}}
  ]
 };
 const seo=[
  '  <link rel="canonical" href="'+pageUrl+'">',
  alternateLinks,
  '  <meta property="og:type" content="website">',
  '  <meta property="og:site_name" content="Snorkeling Watamu">',
  '  <meta property="og:locale" content="'+socialLocale+'">',
  '  <meta property="og:url" content="'+pageUrl+'">',
  '  <meta property="og:title" content="'+title+'">',
  '  <meta property="og:description" content="'+description+'">',
  '  <meta property="og:image" content="'+photoUrl+'">',
  '  <meta property="og:image:alt" content="Subira glass-bottom boat in Watamu, Kenya">',
  '  <meta name="twitter:card" content="summary_large_image">',
  '  <meta name="twitter:title" content="'+title+'">',
  '  <meta name="twitter:description" content="'+description+'">',
  '  <meta name="twitter:image" content="'+photoUrl+'">',
  '  <script type="application/ld+json">'+JSON.stringify(structuredData).replace(/</g,'\\u003c')+'</script>'
 ].join('\n');
 return document.replace('</head>',seo+'\n</head>');
}

function localize(templateHtml,code,dictionary){
 let html=withSeo(templateHtml,code,dictionary);
 for(const key of allowedKeys){
  if(typeof dictionary[key]!=='string'||!dictionary[key].trim())throw new Error('Missing translation '+code+':'+key);
 }
 let total=0;
 // All data-i18n elements in the site's template contain text (some have <br>).
 html=html.replace(/<([a-z][\w-]*)(\s[^>]*?\bdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,
  (all,tag,attributes,key,_inner)=>{
    if(typeof dictionary[key]!=='string')throw new Error('Missing element translation '+code+':'+key);
    total++;
    const value=escapeHtml(dictionary[key]).replace(/\n/g,'<br>');
    return '<'+tag+attributes+'>'+value+'</'+tag+'>';
  });
 const count=(templateHtml.match(/\bdata-i18n="/g)||[]).length;
 if(total!==count)throw new Error('Untranslated HTML text nodes '+code+': '+total+'/'+count);
 html=html.replace(/<([a-z][\w-]*)(\s[^>]*\bdata-i18n-(?:placeholder|alt|aria-label)="([^"]+)"[^>]*)>/gi,
 (original,tag,attributes,key)=>{
    const translated=escapeHtml(dictionary[key]);
    const attr=attributes.includes('data-i18n-placeholder=')?'placeholder':
      attributes.includes('data-i18n-alt=')?'alt':'aria-label';
    // Anchor the translated attribute at a space. A word boundary also matches
    // the *suffix* in data-i18n-aria-label, corrupting translation keys.
    const old=new RegExp('(\\s'+attr+'=")[^"]*(")');
    if(!old.test(attributes))throw new Error('Missing attribute '+attr+' on '+tag);
    return '<'+tag+attributes.replace(old,(_all,before,after)=>before+translated+after)+'>';
 });
 for(const buttonLang of LANGUAGES){
   const idRegex=new RegExp('(<button\\b[^>]*\\bid="'+buttonLang+'"[^>]*>)','g');
   html=html.replace(idRegex,tag=>{
    tag=tag.replace(/\sclass="active"/,'');
    if(buttonLang===code)tag=tag.replace('<button','<button class="active"');
    return tag.replace(/aria-pressed="(?:true|false)"/,'aria-pressed="'+(buttonLang===code?'true':'false')+'"');
   });
 }
 html=html.replace(/(\b(?:src|href)=")\.\/assets\//g,'$1/assets/');
 return html;
}
function copyAssets(){
 fs.cpSync(path.join(ROOT,'assets'),path.join(DIST,'assets'),{recursive:true});
 // Retain the latest Blue Safari MP4 uploaded at the repository root.
 fs.copyFileSync(path.join(ROOT,'36f95496-5d16-4335-a76d-f92f0eff487e.mp4'),path.join(DIST,'36f95496-5d16-4335-a76d-f92f0eff487e.mp4'));
 // The newest Mida Creek sunset image was uploaded at the repository root.
 fs.copyFileSync(path.join(ROOT,'IMG_0256.jpeg'),path.join(DIST,'assets','images','IMG_0256.jpeg'));
 fs.copyFileSync(path.join(ROOT,'robots.txt'),path.join(DIST,'robots.txt'));
}
function sitemap(){
 const locations=LANGUAGES.map(lang=>'  <url><loc>'+canonical(lang)+'</loc></url>').join('\n');
 return '<?xml version="1.0" encoding="UTF-8"?>\n'+
   '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+locations+'\n</urlset>\n';
}
fs.rmSync(DIST,{recursive:true,force:true});
fs.mkdirSync(DIST,{recursive:true});
copyAssets();
for(const lang of LANGUAGES){
 const dictionary={...(base[lang]||{}),...(extra[lang]||{})};
 const output=path.join(DIST,lang,'index.html');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,localize(template,lang,dictionary),'utf8');
}
const itDictionary={...(base.it||{}),...(extra.it||{})};
// Root is a backwards-compatible multilingual entry point. Its canonical is /it/.
fs.writeFileSync(path.join(DIST,'index.html'),withSeo(template,'it',itDictionary).replace(/(\b(?:src|href)=")\.\/assets\//g,'$1/assets/'),'utf8');
fs.writeFileSync(path.join(DIST,'sitemap.xml'),sitemap(),'utf8');
console.log('Built multilingual static site: '+LANGUAGES.join(', ')+'; release SEO metadata prepared.');
