# Snorkeling Watamu · demo v0.2

Landing page **dimostrativa** mobile-first, bilingue italiano/inglese, per un futuro sito dedicato allo snorkeling a Watamu (Kenya).

## Stato

- Solo demo: **non accetta prenotazioni né pagamenti**.
- Nessun operatore è stato ancora confermato; tutte le escursioni e le durate sono idee da validare.
- Le foto Unsplash sono illustrative: **non sono dichiarate fotografie di Watamu**.
- Niente analytics, cookie pubblicitari, storage o backend. Le informazioni del form restano nel browser e possono essere copiate o condivise tramite WhatsApp su iniziativa del visitatore.
- Per sicurezza `index.html`, `robots.txt` e `vercel.json` prevedono `noindex` finché non avviene il lancio commerciale.

## Contenuto

- `index.html` — markup semantico / contenuti
- `assets/styles.css` — stile responsive
- `assets/app.js` — localizzazione, selezione esperienze e form WhatsApp
- `robots.txt` / `vercel.json` — configurazione SEO prototipo e header
- `scripts/check_site.py` — controlli statici CI
- `.github/workflows/checks.yml` — verifica ad ogni push e PR

## Prova in locale

```sh
python3 -m http.server 8000
# http://localhost:8000
```

## Deployment GitHub → Vercel

- Repository: `Equipe-Creative-Agency/snorkelingwatamu` (privata, branch `main`).
- Progetto Vercel collegato: **snorkelingwatamu**, team **Equipe Creative Agency**.
- **Demo online:** https://snorkelingwatamu.vercel.app/
- Framework: `Other` / static HTML; Root Directory: `/`; nessuna installazione o build custom.
- Push su `main` → deployment del sito demo; PR / altri branch → preview.
- La demo rimane `noindex` finché l'operatore, le condizioni e il dominio non sono confermati.
- Non associare il dominio `snorkelingwatamu.com` prima di avere registrazione, operatore e termini verificati.

## Checklist prima del lancio

1. Identificare l'operatore reale e controllare autorizzazioni, assicurazione, eventuali licenze e partner locali.
2. Confermare i pacchetti, tempi di percorrenza, servizi inclusi, materiale, trasporto, tasse del parco, prezzi e politiche di cancellazione.
3. Sostituire le foto illustrative con immagini proprie e liberatorie appropriate.
4. Verificare il numero WhatsApp, poi valorizzare `WA_NUMBER` in `assets/app.js` con il numero internazionale, sole cifre.
5. Pubblicare privacy policy, contatti, condizioni di vendita e dati identificativi dell'operatore.
6. Verificare tariffe e regole ufficiali KWS: https://kws.go.ke/park/watamu-marine-national-park-reserve/
7. Configurare il dominio definitivo e, **solo dopo la verifica**, rimuovere i blocchi `noindex` in tutti e tre i punti.

Il sito è un concept indipendente creato per validare l'idea. Non rappresenta una società di tour già autorizzata.