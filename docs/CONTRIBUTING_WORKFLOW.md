# Watamu Digital — contributi e pubblicazioni

## Scopo

Questo sito è un progetto dimostrativo pubblico. I commit correnti, incluse le
modifiche WhatsApp proposte dai collaboratori, devono essere conservati. Il
sito viene pubblicato dal progetto Vercel esistente di Equipe Creative Agency,
senza dare accesso Vercel ai collaboratori.

## Procedura di lavoro

1. Ogni collaboratore lavora su un branch dedicato e apre una pull request su `main`.
2. `Static site checks / verify` deve essere verde.
3. Un manutentore diverso dall'autore approva la PR. I file critici hanno
   CODEOWNERS dedicati.
4. Dopo il merge, Vercel distribuisce automaticamente il commit presente in
   `main`. Non occorre un token Vercel nelle GitHub Actions.
5. Verificare che l'ultimo deployment Vercel sia `READY` e corrisponda
   allo SHA di `main`, e testare i percorsi essenziali del sito.

## Limitazioni

- Il file CODEOWNERS da solo **non** impone revisioni: abilitare la
  protezione di `main` (almeno una approvazione, richiesta CODEOWNERS,
  status check obbligatorio, nessun force push e nessuna cancellazione).
- Non dare ai collaboratori esterni ruoli di Admin né bypass.
- Non aggiungere chiavi, token, dati dei clienti, foto non autorizzate o
  segreti ai repository o al loro storico.
- Non rimuovere `noindex` fino a validazione commerciale e privacy.
- PR provenienti da fork esterni possono richiedere autorizzazione Vercel
  per le anteprime; è un controllo della piattaforma, non un errore GitHub.
- La cancellazione/revisione dei file storici eventualmente sensibili
  richiede una procedura dedicata (la cancellazione dal branch non li
  rimuove dalla cronologia Git).

## Sicurezza

La CI usa solo `GITHUB_TOKEN` read-only per checkout/test.
Non usare `VERCEL_TOKEN` nei repository Watamu. Equipe mantiene
l'ownership di Vercel e dei domini.
