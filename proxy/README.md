# Paul-Proxy (Sprachmodell für den Website-Kater)

GitHub Pages ist rein statisch, der API-Schlüssel darf nie in den Browser-Code. Dieser kleine Cloudflare Worker nimmt Pauls Fragen entgegen, fragt OpenAI (Modell in `MODEL` in `worker.js`) und gibt nur die Antwort zurück.

Ohne Proxy antwortet Paul wie bisher aus `assets/js/paul-wissen.js`. Feste Antworten (Begrüßung, „Warum heißt Du Paul?“ …) bleiben auch mit Proxy lokal. Ist der Proxy nicht erreichbar, antwortet Paul ebenfalls lokal.

## Einrichten (einmalig)

1. Cloudflare-Konto anlegen (kostenloser Tarif reicht) und Node.js installieren.
2. Auf platform.openai.com ein API-Konto anlegen (getrennt vom ChatGPT-Abo), Guthaben aufladen, unter *Limits* ein monatliches Budget setzen und einen API-Schlüssel anlegen.
3. Im Ordner `proxy/`:
   ```
   npm install
   npx wrangler login
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler deploy
   ```
4. Die angezeigte Adresse (z. B. `https://paul-proxy.<name>.workers.dev`) in `assets/js/config.js` unter `paul.endpoint` eintragen.
5. Bei eigener Domain: diese in `wrangler.toml` unter `ALLOWED_ORIGINS` ergänzen und neu deployen.

## Vor dem Freischalten

- **Datenschutzerklärung ergänzen:** Fragen an Paul werden an Cloudflare (Worker) und OpenAI (Sprachmodell und Websuche, USA) übertragen. Der Worker speichert nichts, OpenAI wird angewiesen, die Unterhaltung nicht zu speichern (`store: false`).
- Kosten: Das Rate Limiting (10 Fragen pro Minute und IP) und das Budget in der OpenAI-Plattform verhindern Ausreißer.

## Anpassen

- Pauls Charakter, Regeln und Wissen über die Website: `SYSTEM` in `worker.js`. Bei neuen Angeboten dort und in `paul-wissen.js` ergänzen.
- Paul beantwortet Fragen zur Website aus seinem Wissen. Andere Sachfragen beantwortet er nur, wenn eine Websuche in geprüften Quellen (`SOURCES` in `worker.js`: tagesschau.de, ZDF, dpa, Deutschlandfunk, DW) sie belegt – neutral, mit Quelle im Satz und als Link. Meinungsfragen, Aufgaben und alles Unbelegte: feste Antwort `OFF_TOPIC_ANSWER`.
- Modell wechseln: `MODEL` in `worker.js` (z. B. `gpt-6-luna` für niedrigere Kosten), danach `npx wrangler deploy`.
- Protokoll im Betrieb: `npx wrangler tail`.
