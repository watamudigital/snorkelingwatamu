# Snorkeling Watamu — report tecnico pre-lancio
**Data:** 10 novembre 2026
**Ambito:** snorkelingwatamu.com — repository watamudigital/snorkelingwatamu
**Stato:** interventi proposti in PR draft; nessuna modifica alla produzione finché la PR non viene approvata e unita a main.

## 1. Stato verificato prima degli interventi
- Progetto statico HTML/CSS/JavaScript su Vercel, build locale multilingue tramite scripts/build-locales.cjs.
- Quattro pagine prerenderizzate: /it/, /en/, /de/, /fr/ con canonical e hreflang; sitemap.xml generata in dist.
- Il repository su main contiene tre blocchi intenzionali: meta robots noindex in index.html, Disallow: / in robots.txt e X-Robots-Tag noindex in vercel.json.
- Vercel: dominio principale www.snorkelingwatamu.com verificato; apex snorkelingwatamu.com reindirizzato con 308; ultimo deployment di main READY, commit 77d8c354.
- GitHub Actions "Static site checks": ultimo esito FAILURE al 9 novembre 2026; test obsoleti con riferimenti a vecchie gallerie e a un modulo rimosso.
- Non è stata accertata l'indicizzazione effettiva in Google Search Console. La semplice pubblicazione non garantisce la presenza in SERP.

## 2. Modifiche incluse nella PR
1. robots.txt: Allow: / e dichiarazione Sitemap: https://www.snorkelingwatamu.com/sitemap.xml.
2. Rimozione della direttiva noindex dall'HTML sorgente e dell'header X-Robots-Tag imposto da Vercel; le anteprime Vercel continuano a ricevere il noindex predefinito della piattaforma.
3. Title e meta description localizzati e orientati alle ricerche per snorkeling, Blue Safari, glass-bottom boat e Mida Creek, senza promesse di servizi non confermati.
4. Badge e footer: rimosse le diciture "sito dimostrativo" / "concept preview"; il contatto WhatsApp resta una richiesta di preventivo, non una prenotazione o un pagamento online.
5. Metadati Open Graph / Twitter e JSON-LD WebSite/WebPage per ogni lingua.
6. Test aggiornati: controlli su sitemap, robots, canonical, hreflang, metadati, risorse locali, localizzazioni, cinque offerte attuali, contatti e modello di consenso ECM.
7. Nessun cambio di numero WhatsApp, gestione pagamenti, logica commerciale o contenuti multimediali.

## 3. Controlli da superare in PR
- GitHub Action Static site checks / verify: SUCCESS.
- Vercel preview: READY, con commit corretto, test desktop/mobile delle quattro lingue e compilazione richiesta WhatsApp.
- Confermare che sitemap.xml sia servita con HTTP 200 e che /it/, /en/, /de/, /fr/ restituiscano 200, canonical ed hreflang.
- Verificare URL senza www -> www (308), HTTPS e assenza di X-Robots-Tag noindex sulla produzione dopo il merge.
- Nota: un'anteprima Vercel con X-Robots-Tag noindex è normale; non va interpretata come un problema prima del lancio.

## 4. Controlli editoriali e commerciali (obbligatori prima del lancio)
- Juma / operatore conferma esplicitamente che le escursioni pubblicizzate sono disponibili su richiesta, e indica la propria identità commerciale, autorizzazioni e requisiti locali applicabili.
- Verificare disponibilità, equipaggiamento, eventuali servizi inclusi, regole KWS, coperture assicurative e immagini utilizzate.
- Pubblicare una privacy notice corretta per il titolare, con contatti e descrizione del passaggio volontario a WhatsApp e di eventuali servizi ECM/analytics. Non inventare dati aziendali mancanti.
- Verificare le condizioni contrattuali e di cancellazione prima di accettare prenotazioni o pagamenti. Il sito attuale prepara solo richieste.
- Se Google Analytics sarà attivato, mantenere ECM come unico punto di caricamento, subordinato alle preferenze privacy.

## 5. Lancio controllato (dopo approvazione)
1. Concludere test e verifiche commerciali; controllare il diff della PR, poi effettuare merge su main.
2. Attendere e verificare il deployment Vercel di produzione READY e la corrispondenza con lo SHA di main.
3. Ispezionare via HTTP robots.txt, sitemap.xml, canonical, meta robots e X-Robots-Tag su tutte e quattro le lingue.
4. Collegare la proprietà dominio a Google Search Console tramite il titolare o chi dispone dei DNS, verificarla, inviare la sitemap.
5. Usare Controllo URL su homepage e pagine linguistiche; chiedere indicizzazione quando idonee. Verificare la copertura nei giorni/settimane successivi.
6. Registrare le date di crawl, pagine indicizzate, impression, clic e query reali in una scheda di report; nessuna garanzia di ranking immediato.

## 6. Risorse e responsabilità
- Repository: https://github.com/watamudigital/snorkelingwatamu
- Search Console: https://search.google.com/search-console
- Documentazione Google: https://developers.google.com/search/docs/specialty/international/localized-versions
- Decisione: mantenere la produzione esistente fino alla verifica delle condizioni commerciali e alla chiusura positiva della PR.
