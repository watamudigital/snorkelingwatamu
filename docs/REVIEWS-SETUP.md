# Attivazione recensioni automatiche — Snorkeling Watamu

Il modulo delle recensioni è già stato aggiunto alla homepage (italiano, inglese, tedesco, francese). I visitatori potranno lasciare un voto da 1 a 5 stelle, il proprio nome, l'escursione e un commento. Con il consenso del cliente, la recensione verrà pubblicata subito e salvata online. La pubblicazione automatica richiede ancora l'attivazione dell'archivio online.

## Attivazione (amministratore del sito)
1. Crea un database Redis su **Upstash** (https://console.upstash.com/), oppure crea un database Redis tramite il marketplace Storage di **Vercel**.
2. Copia i dati REST del database, **senza inserirli nel codice o inviarli per chat**.
3. Apri Vercel → progetto Snorkeling Watamu → **Settings → Environment Variables**.
4. Crea le variabili seguenti in **Production**:
   - `UPSTASH_REDIS_REST_URL` — URL REST del database.
   - `UPSTASH_REDIS_REST_TOKEN` — token REST segreto del database.
   In alternativa sono supportate `KV_REST_API_URL` e `KV_REST_API_TOKEN` quando fornite dal provider.
5. Ridistribuisci l'ultimo commit su Vercel (Redeploy), perché le variabili diventino disponibili.
6. Apri `https://www.snorkelingwatamu.com/api/reviews`: deve rispondere con `{"reviews":[]}` prima della prima recensione.
7. Prova a inviare una recensione dalla homepage. Dopo l'invio, deve comparire immediatamente nell'elenco pubblico.

## Sicurezza e privacy
- Il sito chiede il consenso esplicito per mostrare nome e recensione.
- Le recensioni sono pubblicate automaticamente senza moderazione preventiva: sono previste limitazioni per origine, contenuto e frequenza degli invii, ma lo spam non può essere escluso.
- L'API blocca URL e markup, limita lunghezza e numero di invii (3 per indirizzo al giorno).
- Nessun indirizzo IP viene salvato permanentemente nel database delle recensioni; i limiti antiabuso usano chiavi hash con scadenza.
- L'archivio conserva fino a 100 recensioni e ne mostra fino a 36.
- Se l'archivio non è configurato, il pulsante resta disabilitato: non vengono mostrate false conferme di pubblicazione.
- Per rimuovere una recensione indesiderata occorre un intervento amministrativo sul database Redis. Considerare una futura interfaccia di moderazione.

### Dati Redis
Elenco: `snorkelingwatamu:public-reviews:v1`; ogni elemento è un JSON con nome, esperienza, stelle, testo e data. Puoi eliminare voci tramite la console Redis/Upstash.
