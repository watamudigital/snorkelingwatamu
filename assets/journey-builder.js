/* Authentic-photo itinerary explorer and WhatsApp package enquiry. */
(()=>{
 'use strict';
 const area=document.getElementById('itineraries');
 const form=document.getElementById('customTripForm');
 if(!area||!form)return;
 const lang=['it','en','de','fr'].includes(document.documentElement.lang)?document.documentElement.lang:'it';
 const copy={
  it:{
   safari:['Blue Safari','La bellezza del Marine Park, lo snorkeling e il mare di Watamu.',[['Partenza','Incontro e imbarco con Juma.'],['Parco marino','Navigazione e snorkeling tra i coralli.'],['Relax e pranzo','Soste e pranzo secondo la proposta concordata.'],['Rientro','Rientro in base alle condizioni del mare.']]],
   private:['Blue Safari privato','La barca di Juma e un percorso concordato per il tuo gruppo.',[['Imbarco','Sali a bordo della barca privata.'],['Snorkeling','Scopri il mare e la barriera corallina.'],['Soste personalizzate','Musica, relax e tappe secondo i tuoi desideri.'],['Rientro','Orari e servizi da concordare.']]],
   sunset:['Tramonto a Mida Creek','La luce dorata sulle mangrovie, direttamente dalla barca.',[['Partenza','Incontro e imbarco a Mida Creek.'],['Navigazione','Scopri il paesaggio delle mangrovie.'],['Tramonto','Tempo per godersi il panorama.'],['Rientro','Ritorno in base alla marea.']]],
   fishing:["Pesca d'altura",'La costa e il mare aperto con Juma.',[['Preparazione','Accordo su durata e attrezzatura.'],['Navigazione','Partenza verso il mare aperto.'],['Pesca','Attività secondo le condizioni.'],['Rientro','Nessuna cattura può essere garantita.']]],
   watersports:['Watersports','Divertimento sull’acqua secondo le attività disponibili.',[['Scelta','Scegli le attività disponibili.'],['Preparazione','Indicazioni e attrezzatura necessarie.'],['In acqua','Vivi la tua esperienza acquatica.'],['Rientro','Conclusione e relax.']]],
   people:'partecipanti',date:'data da concordare',extras:'Interessi',message:'Ciao Juma! Vorrei un preventivo personalizzato.',day:'Data',trip:'Esperienza',group:'Partecipanti'
  },
  en:{
   safari:['Blue Safari','Discover the Marine Park, snorkeling and the Watamu coast.',[['Departure','Meet Juma and board the boat.'],['Marine park','Cruise and snorkel among the corals.'],['Relax and lunch','Stops and lunch as agreed in the quote.'],['Return','Return according to sea conditions.']]],
   private:['Private Blue Safari','Juma’s boat and a route tailored to your group.',[['Boarding','Board Juma’s private boat.'],['Snorkeling','Discover the marine park and coral reef.'],['Custom stops','Music, relaxation and your preferred stops.'],['Return','Timing and services to be agreed.']]],
   sunset:['Mida Creek Sunset','Golden light over the mangroves, seen from the boat.',[['Departure','Meet and board at Mida Creek.'],['Cruise','Discover the mangrove scenery.'],['Sunset','Enjoy the evening views.'],['Return','Return depending on tides.']]],
   fishing:['Deep-Sea Fishing','Head offshore with Juma.',[['Preparation','Agree on duration and equipment.'],['Cruise','Head out to sea.'],['Fishing','Activity depends on conditions.'],['Return','A catch is never guaranteed.']]],
   watersports:['Watersports','On-water fun subject to availability.',[['Choose','Select available activities.'],['Prepare','Briefing and equipment.'],['On the water','Enjoy your chosen activity.'],['Return','Finish and relax.']]],
   people:'guests',date:'date to be agreed',extras:'Interests',message:'Hi Juma! I would like a personalised quote.',day:'Date',trip:'Experience',group:'Guests'
  },
  de:{
   safari:['Blue Safari','Entdecke den Marine Park, Schnorcheln und Watamus Küste.',[['Start','Treffen und Einstieg mit Juma.'],['Meerespark','Bootsfahrt und Schnorcheln am Riff.'],['Erholung und Mittagessen','Stopps und Essen nach Absprache.'],['Rückfahrt','Abhängig vom Meer.']]],
   private:['Private Blue Safari','Jumas Boot und eine Tour für deine Gruppe.',[['Einstieg','An Bord von Jumas privatem Boot.'],['Schnorcheln','Meerespark und Korallen entdecken.'],['Individuelle Stopps','Musik, Pausen und Wunschstopps.'],['Rückfahrt','Zeiten und Leistungen nach Absprache.']]],
   sunset:['Sonnenuntergang am Mida Creek','Goldenes Licht über den Mangroven.',[['Start','Treffen und Einstieg am Mida Creek.'],['Bootsfahrt','Mangrovenlandschaft erkunden.'],['Sonnenuntergang','Den Ausblick genießen.'],['Rückfahrt','Abhängig von den Gezeiten.']]],
   fishing:['Hochseefischen','Mit Juma hinaus aufs offene Meer.',[['Vorbereitung','Dauer und Ausrüstung abstimmen.'],['Bootsfahrt','Hinaus aufs Meer fahren.'],['Angeln','Je nach Bedingungen.'],['Rückfahrt','Kein Fang kann garantiert werden.']]],
   watersports:['Wassersport','Spaß auf dem Wasser nach Verfügbarkeit.',[['Auswahl','Verfügbare Aktivitäten auswählen.'],['Vorbereitung','Einweisung und Ausrüstung.'],['Auf dem Wasser','Die Aktivität genießen.'],['Abschluss','Rückkehr und Erholung.']]],
   people:'Personen',date:'Datum nach Absprache',extras:'Wünsche',message:'Hallo Juma! Ich möchte ein persönliches Angebot.',day:'Datum',trip:'Erlebnis',group:'Teilnehmende'
  },
  fr:{
   safari:['Blue Safari','Explorez le parc marin, le snorkeling et la côte de Watamu.',[['Départ','Rencontre et embarquement avec Juma.'],['Parc marin','Balade en bateau et snorkeling.'],['Détente et déjeuner','Arrêts et repas selon le devis.'],['Retour','Selon les conditions de mer.']]],
   private:['Blue Safari privé','Le bateau de Juma et un parcours adapté au groupe.',[['Embarquement','Montez à bord du bateau privé.'],['Snorkeling','Découvrez les coraux et le parc marin.'],['Arrêts personnalisés','Musique, détente et étapes au choix.'],['Retour','Horaires et services à confirmer.']]],
   sunset:['Coucher de soleil à Mida Creek','Lumière dorée et mangroves depuis le bateau.',[['Départ','Rendez-vous et embarquement.'],['Navigation','Paysages des mangroves.'],['Coucher de soleil','Admirez la lumière du soir.'],['Retour','Selon la marée.']]],
   fishing:['Pêche au large','La côte et le grand large avec Juma.',[['Préparation','Durée et équipement à convenir.'],['Navigation','Départ vers le large.'],['Pêche','Selon les conditions.'],['Retour','Aucune prise garantie.']]],
   watersports:['Sports nautiques','Plaisirs sur l’eau selon les disponibilités.',[['Choix','Choisissez les activités disponibles.'],['Préparation','Consignes et équipement.'],['Sur l’eau','Profitez de votre activité.'],['Retour','Fin et détente.']]],
   people:'participants',date:'date à convenir',extras:'Souhaits',message:'Bonjour Juma ! Je souhaite un devis personnalisé.',day:'Date',trip:'Expérience',group:'Participants'
  }
 };
 const images={
  safari:'/assets/images/IMG_0065.jpeg',
  private:'/assets/images/blue-safari-private-poster.jpg',
  sunset:'/assets/images/IMG_0141.jpeg',
  fishing:'/assets/images/IMG_0053.jpeg',
  watersports:'/assets/images/IMG_0251.jpeg'
 };
 const valueToOption={
  safari:'Blue Safari',
  private:'Blue Safari privato',
  sunset:'Tramonto a Mida Creek',
  fishing:"Pesca d'altura",
  watersports:'Watersports'
 };
 const strings=copy[lang];
 const title=document.getElementById('journey-title');
 const summary=document.getElementById('journey-summary');
 const steps=document.getElementById('journey-steps');
 const photo=document.getElementById('journey-photo');
 const select=document.getElementById('customTripExperience');
 const guests=document.getElementById('customTripGuests');
 const date=document.getElementById('customTripDate');
 const result=document.getElementById('customTripSummary');
 const choices=[...area.querySelectorAll('[data-journey]')];
 function updateSummary(){
  const selected=select.options[select.selectedIndex]?.textContent.trim()||select.value;
  const checked=[...form.querySelectorAll('[data-custom-extra]:checked')].map(input=>input.parentElement.querySelector('span')?.textContent.trim()||input.value);
  result.textContent=[selected,(guests.value||'1')+' '+strings.people,date.value||strings.date,...checked].join(' · ');
 }
 function choose(key){
  const data=strings[key];
  if(!data)return;
  title.textContent=data[0];
  summary.textContent=data[1];
  photo.src=images[key];
  photo.alt=data[0];
  steps.replaceChildren();
  data[2].forEach(([heading,description])=>{
   const li=document.createElement('li');
   const strong=document.createElement('strong');
   const text=document.createElement('p');
   strong.textContent=heading;
   text.textContent=description;
   li.append(strong,text);
   steps.appendChild(li);
  });
  choices.forEach(button=>{
   const yes=button.dataset.journey===key;
   button.classList.toggle('is-selected',yes);
   button.setAttribute('aria-pressed',String(yes));
  });
  select.value=valueToOption[key];
  updateSummary();
 }
 choices.forEach(button=>button.addEventListener('click',()=>choose(button.dataset.journey)));
 form.addEventListener('input',updateSummary);
 form.addEventListener('change',updateSummary);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const selected=select.options[select.selectedIndex]?.textContent.trim()||select.value;
  const extras=[...form.querySelectorAll('[data-custom-extra]:checked')].map(input=>input.parentElement.querySelector('span')?.textContent.trim()||input.value);
  const message=[strings.message,strings.trip+': '+selected,strings.group+': '+guests.value,strings.day+': '+(date.value||strings.date),strings.extras+': '+(extras.join(', ')||'-')].join('\n');
  const waJuma=document.querySelector('#booking .booking-whatsapp[href*="254741457022"]');
  const waLuisa=document.querySelector('#booking .booking-whatsapp[href*="41775129241"]');
  if(waJuma)waJuma.href='https://wa.me/254741457022?text='+encodeURIComponent(message);
  if(waLuisa)waLuisa.href='https://wa.me/41775129241?text='+encodeURIComponent(message);
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'center'});
 });
 choose('safari');
})();
