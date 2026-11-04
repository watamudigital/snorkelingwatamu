# Snorkeling Watamu · demo v0.2

Landing page **dimostrativa** mobile-first, in quattro lingue: italiano, inglese, tedesco e francese, per un futuro sito dedicato allo snorkeling a Watamu (Kenya).

## Stato

- Solo demo: **non accetta prenotazioni né pagamenti**.
- Juma è il contatto diretto per le proposte di escursione; itinerari, durata, servizi inclusi e disponibilità restano da concordare con lui. Il sito non costituisce conferma di un servizio acquistato.
- Le foto Unsplash sono illustrative: **non sono dichiarate fotografie di Watamu**.
- Niente analytics, cookie pubblicitari, storage o backend. Le informazioni del form restano nel browser e possono essere copiate o condivise tramite WhatsApp su iniziativa del visitatore.
- Per sicurezza `index.html`, `robots.txt` e `vercel.json` prevedono `noindex` finché non avviene il lancio commerciale.

## Contenuto

- `index.html` — markup semantico / contenuti, inclusa la sezione dedicata a Juma e alla Subira
- `assets/styles.css` — stile responsive
- `assets/app.js` — localizzazione, selezione esperienze e form WhatsApp
- `assets/experience-carousel.js` — gallerie fotografiche indipendenti: tre foto per ogni esperienza, con frecce e indicatori.
- **Video «Il tuo mare, con Juma»**: il sito utilizza `assets/videos/juma-ocean-upright.mp4`, generato automaticamente dall'originale MOV tramite `.github/workflows/convert-juma-video.yml`. La conversione controlla l'orientamento reale dei fotogrammi, azzera la rotazione incorporata e verifica con `ffprobe` che il video finale sia verticale e privo di rotazione residua. Il lettore HTML5 riproduce il video senza audio, in loop, con comandi accessibili e rispetto della preferenza per movimento ridotto. La foto della Subira è il fallback in caso di errore di caricamento.
- Ordine delle offerte: **Blue Safari** (glass boat con snorkeling incluso, mare permettendo), **Pesca d'altura** (attività autonoma) e **Watersports** (sport acquatici su richiesta). Your Blue Safari è stata sostituita da Watersports; la vecchia offerta standalone Coral Garden Explorer resta ritirata.
- Foto Watersports: **prima** `assets/images/IMG_0034.jpeg` (banana boat), **seconda** `assets/Vier Fahrer auf dem gelben Rocket.png` (Rocket giallo), entrambe fornite per il sito; **terza** illustrativa Unsplash (kayak). Le altre attività acquatiche menzionate sono solo proposte da confermare con Juma, secondo disponibilità e condizioni del mare.
- Le tre schede si vedono insieme su desktop (griglia tre colonne), passano a due colonne su tablet e a una su smartphone: nessuna scheda viene nascosta orizzontalmente. La selezione Pesca d'altura nel modulo WhatsApp non richiede il livello di nuoto. Attrezzatura, durata, tariffe, disponibilità e norme sulla pesca sono da verificare con Juma.
- Nella galleria Pesca d'altura la **prima immagine è ora una foto autentica di Juma** caricata in `assets/images/Juma mit Fischen auf sonniger See.png`; la seconda e la terza sono ancora illustrative (Unsplash: [Ben Koorengevel](https://unsplash.com/photos/fishing-rod-over-the-blue-ocean-water-gB9IR96PEbU), [krzhck](https://unsplash.com/photos/a-close-up-of-a-fishing-rod-with-a-boat-in-the-background-AnYtbq5tTgo)). Sostituire anche le illustrative con foto autentiche autorizzate quando disponibili.
- `robots.txt` / `vercel.json` — configurazione SEO prototipo e header
- `scripts/check_site.py` — controlli statici CI
- `.github/workflows/checks.yml` — verifica ad ogni push e PR

## Prova in locale

```sh
python3 -m http.server 8000
# http://localhost:8000
```

## Deployment GitHub → Vercel

- Repository: `watamudigital/snorkelingwatamu` (privata, branch `main`).
- Progetto Vercel collegato: **snorkelingwatamu**, team **Equipe Creative Agency**.
- **Demo online:** https://snorkelingwatamu.vercel.app/
- Framework: `Other` / static HTML; Root Directory: `/`; nessuna installazione o build custom.
- Push su `main` → deployment del sito demo; PR / altri branch → preview.
- La demo rimane `noindex` finché l'operatore, le condizioni e il dominio non sono confermati.
- I domini `snorkelingwatamu.com` e `www.snorkelingwatamu.com` sono associati al progetto Vercel. Il sito resta una demo protetta da `noindex` fino alla validazione commerciale.

## Checklist prima del lancio

1. Verificare con Juma autorizzazioni, assicurazione, eventuali licenze e collaborazioni necessarie per le escursioni.
2. Confermare i pacchetti, tempi di percorrenza, servizi inclusi, materiale, trasporto, tasse del parco, prezzi e politiche di cancellazione.
3. Sostituire le foto illustrative con immagini proprie e liberatorie appropriate.
4. Verificare il numero WhatsApp, poi valorizzare `WA_NUMBER` in `assets/app.js` con il numero internazionale, sole cifre.
5. Pubblicare privacy policy, contatti, condizioni di vendita e dati identificativi dell'operatore.
6. Verificare tariffe e regole ufficiali KWS: https://kws.go.ke/park/watamu-marine-national-park-reserve/
7. Verificare DNS e HTTPS dei domini collegati e, **solo dopo la verifica commerciale**, rimuovere i blocchi `noindex` in tutti e tre i punti.

Il sito è un concept indipendente con Juma come contatto diretto delle esperienze; non rappresenta una conferma di abilitazioni, licenze o prenotazioni già effettuate.
## Lingue (IT / EN / DE / FR)

- `assets/app.js` gestisce il selettore lingua, i testi del form e le richieste WhatsApp.
- `assets/translations.js` contiene le traduzioni tedesche e francesi e i nuovi testi condivisi dalle quattro lingue.
- Si può condividere la pagina con `?lang=de` o `?lang=fr`; senza parametro viene usata la lingua del browser quando disponibile.
- Nessun cookie o local storage viene utilizzato per salvare la lingua. Il form non invia dati a un backend.
- Le traduzioni sono lato client. Prima dell'indicizzazione serviranno URL dedicati per lingua, contenuto statico, tag hreflang e verifica legale/commerciale. Il sito rimane `noindex`.
- Eseguire `node scripts/check-i18n.cjs` per il controllo di completezza delle traduzioni.

## SEO multilingua — predisposizione senza indicizzazione

- Pagine HTML pre-renderizzate (non solo traduzioni client-side): `/it/`, `/en/`, `/de/`, `/fr/`.
- Canonical self-referential e `hreflang` reciproci su ogni pagina; `x-default` punta alla home `/` (fallback).
- Meta title, description, lingua HTML e contenuti traducibili nel sorgente HTML iniziale.
- `sitemap.xml` generata con gli URL delle quattro lingue, da inviare a Google Search Console solo al lancio.
- Su Vercel: `node scripts/build-locales.cjs` produce `dist/` (assets inclusi); progetto con framework `Other`, output `dist`.
- La home `/` rimane compatibile con i precedenti link `?lang=...` e usa canonical `/it/`.
- Manteniamo per ora i blocchi `noindex`, l'header `X-Robots-Tag` e `robots.txt` con `Disallow: /`. Non rimuoverli prima del lancio verificato.
- `node scripts/check-seo.cjs` controlla i contenuti generati, gli URL, canonical/hreflang e le immagini Subira.

### Analytics con ECM
- Non aggiungere direttamente Google Analytics o GTM. Dopo il provisioning di ECM e del Measurement ID `G-...`, configurare il tag GA4 nella categoria Analitici di una policy ECM in bozza e pubblicarla dopo test del consenso.
- ECM è il solo orchestratore di caricamento/consenso, evitando due installazioni GA4 e verificando il modello Basic di Consent Mode con blocco prima del consenso, ove richiesto.
- Tracciamenti utili dopo il lancio: selezione esperienza, richiesta WhatsApp e lingua selezionata; solo con consenso e test in GA4 DebugView.

## ECM consent bootstrap

ECM site: `c64f3c2a-13ae-4ec1-8362-8bc54a7538e4` (tenant Equipe). Every language loads synchronous Google Consent Mode v2 defaults with `analytics_storage=denied` and other non-essential signals denied. `assets/ecm-bootstrap.js` queries the official ECM public configuration and loads `https://ecm.plus/ecm.js` only once **after a policy has been published**. If policy is draft, absent, or unreachable, no consent banner or analytics script is injected. Publishing the ECM policy activates the runtime on the next page load; no new website deployment is needed.

No GA4 or GTM installation on the site. GA4 should be configured as an **Analytics** policy script within ECM, with consent acceptance/rejection/revocation tested before production use. Validation: `node scripts/check-ecm.cjs`.

## Juma WhatsApp contact

- Public click-to-call contact: `+254741457022`.
- Direct chat link: `https://wa.me/254741457022` (no + in wa.me route) in the booking section and mobile CTA.
- Second Swiss WhatsApp contact: `+41 77 512 92 41` (`https://wa.me/41775129241`) is offered alongside Juma in the booking section and footer, with labels in IT/EN/DE/FR. The prefilled enquiry form continues to target Juma.
- The enquiry form generates a message in the selected language addressed to Juma, opening WhatsApp with the recipient preselected. The visitor must press **Send** in WhatsApp; no message is sent by the site automatically.
- IT, EN, DE, FR copy is in `assets/translations.js`, and `scripts/check-seo.cjs` verifies the four static output pages. This is still a non-indexed concept: the site itself does not confirm bookings or take payments.
