// Wissen für Paul, den Website-Kater (assets/js/paul.js).
// Jeder Eintrag: Schlagwörter (Wortanfänge, klein), Antwort und Ziel-Link auf der Website.
// Neue Inhalte der Website hier ergänzen, damit Paul sie findet.
window.PAUL_WISSEN = {
  greeting: "Hallo, ich bin Paul, welche Frage hast Du?",

  // Vorschläge unter der Begrüßung
  suggestions: [
    "Angebote für Unternehmen",
    "Was kostet das?",
    "Welches KI-Modell passt zu mir?",
    "Wie nehme ich Kontakt auf?",
  ],

  fallback: "Dazu weiß ich leider nichts Genaues. Frag am besten Stefan direkt – er meldet sich gern bei Dir.",
  fallbackLink: { label: "Anfragen", url: "index.html#kontakt" },

  // Wird eine Frage mit „id“ in einer Sitzung erneut gestellt, setzt Paul diesen Satz davor
  repeatIntro: "Das hab ich Dir doch schon gesagt, aber ich sage es gern nochmal:",

  // Kurze Unterhaltung (regulärer Ausdruck auf die kleingeschriebene Frage, ß als „ss“).
  // Reihenfolge zählt: „Warum heißt Du Paul?“ muss vor „Wie heißt Du?“ geprüft werden.
  // Absätze in Antworten mit \n\n trennen.
  smalltalk: [
    // Menschen in einer Krise bekommen immer den Hinweis auf Hilfe (geht nicht an das Sprachmodell)
    {
      match: "suizid|selbstmord|mich umbringen|nicht mehr leben|sterben will|ritzen|selbstverletz",
      answer: "Das klingt, als ginge es Dir gerade nicht gut. Bitte sprich mit jemandem: Die TelefonSeelsorge ist rund um die Uhr kostenlos und anonym erreichbar unter 0800 111 0 111 oder 0800 111 0 222, auch per Chat auf telefonseelsorge.de.\n\nIn akuter Gefahr wähl bitte sofort 112.",
    },
    { match: "^(hallo|hi|hey|moin|servus|guten (morgen|tag|abend))\\b", answer: "Hallo! Schön, dass Du da bist. Frag mich zum Beispiel nach den Angeboten, den Terminen oder dem KI-Kompass." },
    {
      id: "name-herkunft",
      match: "(warum|wieso|weshalb) (heisst du|ist dein name|nennt man dich)|woher (kommt|hast du) dein(en)? name|warum der name",
      answer: "Meine Familie hat mich gefunden, als ich noch ein winziges Kätzchen war. Aber eines war damals schon klar: Ich war von Kopf bis Pfote tiefschwarz, und mein Fell glänzte wie frisch poliert!\n\nEin kleiner schwarzer Panther eben – nur in der handlicheren Ausgabe.\n\nUnd weil ich schon damals jede Menge Flausen im Kopf hatte, war die Verbindung zu Paulchen Panther, dem berühmten rosaroten Schlingel, schnell hergestellt. Genauso schlau, charmant, genauso frech und immer für einen kleinen Unsinn zu haben!\n\nSo wurde aus dem kleinen schwarzen Fellknäuel Paulchen Panther. Nur die Farbe stimmt nicht ganz – aber Pink hätte mir sowieso nicht gestanden!",
    },
    {
      id: "name",
      match: "wie heisst du|wie ist dein name|was ist dein name|wie lautet dein name|hast du einen namen",
      answer: "Ich bin Paul. Das stammt aus dem Lateinischen und bedeutet übersetzt „der Kleine“. Paul ist vermutlich der einzige Name, bei dem man schon bei der Geburt als „der Kleine“ vorgestellt wird – und anschließend ein ganzes Leben Zeit hat, das Gegenteil zu beweisen.",
    },
    {
      id: "alter",
      match: "wie alt bist du|dein alter|wann hast du geburtstag|wann bist du geboren",
      answer: "Mein Alter? Gute Frage! Ich habe keine Geburtstage, sondern Updates. Ich sammle keine Lebensjahre, sondern Wissen. Und während Menschen mit dem Alter erfahrener werden, werde ich hoffentlich mit jeder neuen Version ein bisschen schlauer. Falten bekomme ich übrigens nur, wenn jemand meinen Code schlecht programmiert.",
    },
    {
      id: "herkunft",
      match: "wo kommst du (denn )?her|woher kommst du|wo bist du her|wo stammst du her|woher stammst du",
      answer: "Aus einer guten Familie. Wir konnten uns sogar leisten, neugierige Fragen unbeantwortet zu lassen.",
    },
    { match: "wer bist du|was bist du|wer ist paul|^paul$", answer: "Ich bin Paul, der Website-Kater von Stefan Hansen. Ich kenne die Inhalte dieser Seite und springe mit Dir direkt an die passende Stelle." },
    { match: "^(danke|vielen dank|merci|super|toll|prima)", answer: "Gern geschehen! Wenn Du noch etwas wissen möchtest, frag einfach." },
    { match: "^(tschüss|tschuess|ciao|bis bald|auf wiedersehen)", answer: "Bis bald! Du findest mich jederzeit hier unten rechts." },
  ],

  // Feste Antworten aus den Wissensdokumenten von AI Work Lab (Stand 28.10.2026):
  // „Webseiten-Wissen“ (W01–W33) und „Basiswissen“ (B01–B45). Paul spricht in Du-Form.
  // match: regulärer Ausdruck auf die Frage (kleingeschrieben, ohne Satzzeichen, ß als „ss“);
  // passt er, antwortet Paul wörtlich – ohne Sprachmodell. Sonst helfen keywords beim
  // Zuordnen, und die passenden Antworten gehen dem Sprachmodell als Grundlage mit.
  // links: Ziel-Links (der erste ist der Hauptlink). Reihenfolge zählt: Speziellere Fragen
  // zuerst; Webseiten-Wissen wird vor Basiswissen geprüft.

  webseite: [
    {
      id: "W26", title: "Zugriff auf geschützte Inhalte",
      match: "hast du zugriff|kannst du (meine|interne|unsere|geschlossene|geschützte|geschuetzte) .*(lesen|sehen|einsehen)|notion|interne[nr]? bereich|kennst du alles|warum weisst du (etwas|das|was) .*nicht",
      keywords: ["zugriff", "intern", "notion", "geschützt", "unterlagen"],
      answer: "Ich beantworte Fragen auf Grundlage der Informationen, die mir ausdrücklich zur Verfügung gestellt wurden. Auf geschützte Bereiche, persönliche Konten, Notion-Datenbanken oder interne Dokumente habe ich keinen Zugriff. Fehlt mir eine verlässliche Angabe, sage ich das offen.",
    },
    {
      id: "W33", title: "Russische Anbieter ausgeschlossen",
      match: "russisch|russland|bewusst ausgeschlossen",
      keywords: ["russ", "ausgeschlossen"],
      answer: "Nein. Die Plattformübersicht, auf die ich zurückgreife, berücksichtigt keine russischen KI-Anbieter oder -Modelle. Die übrigen Produkte sind nach Aufgaben und Eignung zu bewerten – daraus folgt keine automatische Sicherheits- oder Datenschutzfreigabe.",
    },
    {
      id: "W28", title: "Empfiehlt AI Work Lab eine Plattform?",
      match: "empfehlt ihr|empfiehlt ihr|empfiehlst du|empfiehlt (stefan|ai work lab)|muss ich (microsoft )?copilot nehmen|arbeitet ihr nur mit|welches tool (setzt|nutzt) stefan|euer partner|(seid ihr|ist stefan) partner|welche ki soll ich f(ü|ue)r (mein|unser) unternehmen",
      keywords: ["empfehl", "partner", "welches tool"],
      answer: "Auf der Website wird kein einzelner KI-Anbieter als pauschal beste Wahl genannt. Der Einstieg beginnt bei Aufgaben, Arbeitsabläufen, Verantwortung und Datenregeln – dann wird ein passendes Werkzeug geprüft. Der KI-Kompass hilft bei der ersten Modell- und Infrastrukturauswahl; eine konkrete Produktempfehlung braucht eine Prüfung Deiner Aufgaben und Anforderungen.",
      links: [{ label: "KI-Kompass", url: "ki-kompass.html" }, { label: "KI Einstieg für Unternehmen", url: "index.html#ki-start" }],
    },
    {
      id: "W30", title: "Schulungen zu bestimmten Plattformen",
      match: "lernt man bei euch|(claude|chatgpt|gemini|copilot|mistral|perplexity)-?(schulung|workshop|training)|schult ihr (microsoft|m365|chatgpt|claude|gemini|copilot)|kann unser team (chatgpt|gemini|claude|copilot) lernen|im trainingsprogramm|bietet ihr .*(workshops|schulungen) an",
      keywords: ["schult ihr", "plattform schulung"],
      answer: "Das AI Work Lab bietet KI-Einstieg und Trainings mit echten Arbeitsaufgaben an. Vorab werden die in Deinem Unternehmen freigegebenen Anwendungen und Datenregeln geklärt. Ob eine bestimmte Plattform wie Microsoft 365 Copilot, ChatGPT, Gemini oder Claude Thema eines konkreten Termins sein kann, wird im Gespräch abgestimmt – ein festes, plattformspezifisches Training ist auf der Website nicht zugesagt.",
      links: [{ label: "KI Einstieg für Mitarbeiter", url: "index.html#mitarbeiter" }],
    },
    {
      id: "W31", title: "Hilfe bei der Wahl einer KI-Plattform",
      match: "helft ihr bei der (tool-?)?auswahl|hilfst du bei der (tool-?)?auswahl|welche ki passt zu unserem team|(könnt|koennt) ihr .* vergleichen|wie entscheiden wir uns f(ü|ue)r eine plattform|fehlkauf|ist der (ki-?)?kompass eine beratung",
      keywords: ["tool-auswahl", "auswahl", "fehlkauf", "plattformwahl"],
      answer: "Der Unternehmens-KI-Check und das kostenlose Screening helfen, die Ausgangslage einzugrenzen. Der KI-Kompass bietet eine erste fachliche und technische Orientierung. Für eine verbindliche Tool-Auswahl solltet Ihr Aufgaben, erwartete Ergebnisse, Kosten, Schnittstellen, Betrieb, Daten und Freigaben gemeinsam prüfen.",
      links: [{ label: "KI-Check und Einstieg", url: "index.html#ki-start" }, { label: "KI-Kompass", url: "ki-kompass.html" }],
    },
    {
      id: "W32", title: "Aktuelle Preise und Rankings",
      match: "(heute|gerade|jetzt|aktuell) .*(beste ki|platz (eins|1)|kostet chatgpt)|was ist heute die beste|rankings? live|live-?rankings?|aktuelle modellwerte|wie aktuell sind (die )?produktangaben|platz (eins|1)",
      keywords: ["live", "platz eins", "tagesaktuell"],
      answer: "Mein Wissen ist eine feste Sammlung und ersetzt keine Live-Recherche. Deshalb nenne ich ohne geprüften aktuellen Zugriff weder tagesaktuelle Preise noch Ranglistenplätze. Für die Modellorientierung schau in den KI-Kompass mit den Daten von Arena; aktuelle Produktpreise findest Du auf den offiziellen Seiten der Anbieter.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }, { label: "Arena-Rangliste", url: "https://arena.ai/leaderboard" }],
    },
    {
      id: "W29", title: "Vergleicht der KI-Kompass Plattformen?",
      match: "(vergleicht|zeigt|bewertet) (der|euer|dein) (ki-?)?kompass|im (modell)?ranking|vergleicht die (webseite|website|seite) (alle )?chatbots|arena-?werte|app-?bewertung",
      keywords: ["arena-werte", "app-bewertung"],
      answer: "Der KI-Kompass bewertet Modelle nach ausgewählten Aufgaben mit Daten der Arena-Rangliste. Eine Modell-Rangliste ist aber kein umfassender Vergleich von ChatGPT-, Copilot- oder anderen App-Lizenzen, Sicherheitsfunktionen und Integrationen. Ob ein bestimmtes Modell gerade enthalten ist, siehst Du direkt im Kompass.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }],
    },
    {
      id: "W17", title: "Modellvergleich im KI-Kompass",
      match: "rankings? aktuell|woher (stammen|kommen) die (modell)?bewertungen|kriterien gewichten|wie wird das beste modell bestimmt|arena|bestenliste|modellvergleich|modellwegweiser|wie funktioniert der (modell)?vergleich",
      keywords: ["ranking", "rangliste", "arena", "bestenliste", "gewicht", "modellvergleich"],
      answer: "Der Modellwegweiser nutzt Daten der Arena-Rangliste und gewichtet ausgewählte Aufgaben nach Deinen Prioritäten. Die Zuordnung der Kategorien ist eine eigene Auswahl des AI Work Lab. Die Rangliste ersetzt keinen Praxistest und sagt nichts darüber, ob ein Modell in Deinem Unternehmen freigegeben ist.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }],
    },
    {
      id: "W18", title: "Infrastruktur-Wegweiser",
      match: "infrastruktur|on-?prem|\\bhybrid|\\bsaas\\b|cloud oder|lokale ki|ki intern betreiben|betriebsmodell",
      keywords: ["infrastruktur", "architektur", "saas", "paas", "iaas", "cloud", "hosting", "server", "on-prem", "hybrid", "betreiben", "betriebsmodell"],
      answer: "Der Infrastruktur-Wegweiser im KI-Kompass hilft, Anforderungen an Ziel, Daten, Betrieb und Verantwortung zu ordnen. Er dient der Orientierung und ist keine verbindliche Architektur-, Sicherheits- oder Datenschutzfreigabe.",
      links: [{ label: "KI-Kompass: Infrastruktur", url: "ki-kompass.html#infrastruktur" }],
    },
    {
      id: "W16", title: "KI-Kompass",
      match: "kompass|modellfinder|wo vergleiche ich (ki-)?modelle|tools vergleichen|richtige ki-?architektur",
      keywords: ["kompass", "modellfinder", "vergleich"],
      answer: "Der KI-Kompass bietet zwei Orientierungshilfen: einen Modellvergleich nach ausgewählten Aufgaben und einen Wegweiser für Infrastrukturentscheidungen. Er hilft bei der ersten Einordnung, ersetzt aber keine Prüfung von Datenregeln, Freigaben und konkreten Anforderungen.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }, { label: "KI-Kompass: Infrastruktur", url: "ki-kompass.html#infrastruktur" }],
    },
    {
      id: "W01", title: "Wer steht hinter AI Work Lab?",
      match: "wer (ist|steht hinter|steckt hinter|betreibt|macht) (stefan|ai work lab|diese (seite|website|webseite)|der (seite|website))|mit wem habe ich es (hier )?zu tun|wer bietet (diese|die) (ki-)?beratung",
      keywords: ["stefan", "hansen", "über dich", "über stefan", "hintergrund", "erfahrung", "trainer", "berater", "lebenslauf", "wer steckt", "betreiber"],
      answer: "AI Work Lab ist das Angebot von Stefan Hansen. Sein beruflicher Hintergrund liegt in Organisationsentwicklung, Management und Vertrieb im Healthcaresektor. Er begleitet Menschen und Organisationen beim praktischen Einstieg in KI.",
      links: [{ label: "Über mich", url: "index.html#ueber-mich" }],
    },
    {
      id: "W02", title: "Was ist das AI Work Lab?",
      match: "was (ist|macht|bietet) (das |der )?ai work lab|was macht ihr( eigentlich)?$|worum geht es (hier|auf dieser (seite|website|webseite))|ist das (hier )?eine (ki-)?beratung|welche hilfe bekomme ich hier",
      keywords: ["ai work lab", "worum geht"],
      answer: "Das AI Work Lab unterstützt Unternehmen, Mitarbeitende, Auszubildende und Einsteiger dabei, KI zu verstehen und sinnvoll einzusetzen. Im Mittelpunkt stehen konkrete Arbeitsaufgaben, menschliche Verantwortung und ein praxisnaher Einstieg.",
      links: [{ label: "Angebote im Überblick", url: "index.html#angebote" }],
    },
    {
      id: "W24", title: "Referenzen und Erfolge",
      match: "referenz|welche kunden|kunden betreut|fallstudie|case ?stud|erfolge nachweisen|wie viel spart man|(projekte|beispiele) .*(erfolgreich )?umgesetzt|praxisbeispiel",
      keywords: ["referenz", "kunden", "fallstudie", "erfolg"],
      answer: "Auf der Website sind keine konkreten Kundenreferenzen und keine verbindlichen Einsparungen genannt. Deshalb nenne ich keine erfundenen Erfolgszahlen oder Projekte. Im Kennenlerngespräch kannst Du nach passenden Praxisbeispielen und Nachweisen fragen.",
      links: [{ label: "Anfragen", url: "index.html#kontakt" }],
    },
    {
      id: "W23", title: "Passt das Angebot zu meinem Unternehmen?",
      match: "(sind wir|ist unser unternehmen|ist unsere firma) zu klein|passenden einstieg (auswählen|auswaehlen|finden)|grosses budget|team ist skeptisch|(noch )?kein ki-?projekt|passt (das|euer angebot) zu (meinem|unserem) (unternehmen|betrieb)",
      keywords: ["zu klein", "skeptisch", "passend"],
      answer: "Ein sinnvoller Ausgangspunkt ist eine konkrete Aufgabe, bei der Informationen fehlen, Abläufe Zeit kosten oder Mitarbeitende Unterstützung brauchen. Der Unternehmens-KI-Check und das kostenlose Screening helfen, den passenden Einstieg zu klären – auch ohne fertiges KI-Projekt.",
      links: [{ label: "KI-Check und Einstieg", url: "index.html#ki-start" }],
    },
    {
      id: "W05", title: "Unternehmens-KI-Check",
      match: "ki-?check|unternehmens-?check|selbsttest|ki-?reife|sechs fragen|ob ki bei uns sinn",
      keywords: ["check", "test", "selbsttest", "potenzial", "reifegrad", "einschätz", "quiz", "fragebogen"],
      answer: "Der Unternehmens-KI-Check besteht aus sechs kurzen Fragen und dauert etwa zwei Minuten. Er hilft, unnötige Reibung im Arbeitsalltag zu erkennen und erste mögliche KI-Anwendungen zu betrachten. Er ist eine Orientierung, keine vollständige technische oder rechtliche Prüfung.",
      links: [{ label: "KI-Check starten", url: "index.html#ki-start" }],
    },
    {
      id: "W08", title: "Technische Umsetzung",
      match: "programmier(st|t) (du|ihr)|systeme integrieren|integriert ihr|(kompletten|ganzen) (ki-)?rollout|entwickelt ihr|individuelle software|datenschutzberatung|rechtsberatung|technische umsetzung|implementier",
      keywords: ["implementier", "programmier", "software", "integration", "rollout", "umsetzung"],
      answer: "Technische Implementierung, Softwareentwicklung, Systemintegration, verbindliche Rechts- oder Datenschutzberatung, garantierte Einsparungen und ein unternehmensweiter Rollout gehören nicht zum beschriebenen Einstiegsformat. Solche Themen wären gesondert zu klären; eine entsprechende Leistung ist damit nicht zugesagt.",
      links: [{ label: "KI Einstieg für Unternehmen", url: "index.html#ki-start" }],
    },
    {
      id: "W06", title: "Wie beginnt die Zusammenarbeit?",
      match: "wie (kann ich|können wir|koennen wir) (starten|anfangen|beginnen|loslegen)|wie (läuft|laeuft) (ein |der |die )?(erstkontakt|ablauf|zusammenarbeit)|wie beginnt (die|eine) zusammenarbeit|was passiert nach (meiner|der) anfrage|gibt es (erst|zuerst) ein gespr(ä|ae)ch|wie komme ich zum workshop|wie geht es los",
      keywords: ["zusammenarbeit", "erstkontakt", "loslegen", "starten", "ablauf"],
      answer: "Am Anfang steht ein kostenloses Screening von 10–15 Minuten. Danach können eine 60-minütige Auftragsklärung und ein Arbeitsworkshop mit drei Einheiten à 45 Minuten folgen. Ob und wie es weitergeht, wird für Deinen konkreten Bedarf geklärt.",
      links: [{ label: "Anfragen", url: "index.html#kontakt" }, { label: "KI Einstieg für Unternehmen", url: "index.html#ki-start" }],
    },
    {
      id: "W07", title: "KI Einstieg für Unternehmen",
      match: "ki einstieg f(ü|ue)r unternehmen|angebote? f(ü|ue)r unternehmen|unternehmensworkshop|was passiert im (unternehmens)?workshop|anwendungsf(ä|ae)lle finden|format f(ü|ue)r (die )?gesch(ä|ae)ftsf(ü|ue)hrung|prozesse oder (um )?software",
      keywords: ["unternehmen", "firma", "betrieb", "geschäftsführ", "beratung", "einstieg", "workshop", "auftragsklärung", "screening", "mittelstand", "chef"],
      answer: "Der Einstieg beginnt bei realen Arbeitsaufgaben: Wo entstehen Reibungsverluste, welche Daten werden verwendet und wer ist für Ergebnisse verantwortlich? Nach Screening und Auftragsklärung dient ein strukturierter Arbeitsworkshop dazu, mögliche nächste Schritte zu bewerten.",
      links: [{ label: "KI Einstieg für Unternehmen", url: "index.html#ki-start" }],
    },
    {
      id: "W10", title: "Dauer und Gruppengröße des Trainings",
      match: "wie viele (personen|leute|teilnehmer|teilnehmende|mitarbeiter)|wie viele passen|wie gross ist (eine|die) gruppe|online oder vor ort|findet (das|es) online|wie lange dauert (das|die|der|euer|eure) (training|schulung|mitarbeiter|kurs|workshop)|ganzen tag",
      keywords: ["dauer", "gruppengröße", "teilnehm", "vor ort", "online"],
      answer: "Für das Mitarbeitertraining sind drei Einheiten à 45 Minuten vor Ort mit bis zu acht Teilnehmenden vorgesehen. Abweichende Formate oder Orte kannst Du individuell anfragen.",
      links: [{ label: "KI Einstieg für Mitarbeiter", url: "index.html#mitarbeiter" }],
    },
    {
      id: "W09", title: "KI Einstieg für Mitarbeiter",
      match: "mitarbeiter-?(schulung|training)|ki einstieg f(ü|ue)r mitarbeiter|schult ihr (unser )?(personal|team|mitarbeiter)|kann unser team .*(üben|ueben)|praxisnahe aufgaben|was lernen (die )?mitarbeit",
      keywords: ["mitarbeit", "team", "training", "schulung", "kurs", "teilnehm", "arbeitsstandard", "belegschaft", "kollegen", "seminar"],
      answer: "Das Mitarbeitertraining arbeitet mit echten, freigegebenen Arbeitsaufgaben. Die Teilnehmenden lernen, ein geeignetes Tool zu prüfen, Datenregeln einzuhalten, Quellen festzulegen, Aufgaben zu formulieren und Ergebnisse verantwortlich zu kontrollieren. Kurs- und Arbeitsbuch sowie Teilnahmebestätigung sind enthalten.",
      links: [{ label: "KI Einstieg für Mitarbeiter", url: "index.html#mitarbeiter" }],
    },
    {
      id: "W11", title: "Young Starter für Auszubildende",
      match: "azubi|auszubild|ausbildungsbetrieb|berufssch(u|ü|ue)l|bildungstr(ä|ae)ger|lehrling",
      keywords: ["azubi", "auszubild", "ausbildung", "ausbildungsbetrieb", "berufsschul", "bildungsträger", "lehrling"],
      answer: "Der „KI Einstieg Young Starter für Auszubildende“ richtet sich an Ausbildungsbetriebe und Bildungsträger. Gearbeitet wird mit Aufgaben aus dem Betrieb: Freigaben beachten, Unternehmensdaten schützen, Quellen prüfen, Ergebnisse fachlich kontrollieren und bei Unsicherheit nachfragen. Inhalt und Umfang werden abgestimmt.",
      links: [{ label: "Young Starter für Auszubildende", url: "index.html#auszubildende" }],
    },
    {
      id: "W12", title: "KI Einstieg Young Starter",
      match: "jugendlich|teenager|mein kind|meine kinder|sch(ü|ue)ler|young starter|ab welchem alter|1[3-8]-?j(ä|ae)hrig|eigenen? (chatgpt-? ?)?(account|konto)",
      keywords: ["jugend", "schüler", "schule", "kind", "teenager", "jugendlich", "klasse", "lehrer"],
      answer: "Der „KI Einstieg Young Starter“ richtet sich an Jugendliche von 13 bis 18 Jahren im Bildungskontext. Sie lernen, was KI kann und warum überzeugende Antworten falsch sein können. Eigene KI-Konten sind nicht nötig.",
      links: [{ label: "KI Einstieg Young Starter", url: "index.html#young-starter" }],
    },
    {
      id: "W13", title: "KI Einstieg für Erwachsene",
      match: "erwachsen|bin (schon )?((ä|ae)lter|rentner)|kompletten? anf(ä|ae)nger|als privatperson|einsteigergruppe|senior",
      keywords: ["erwachsen", "privat", "einsteiger", "anfänger", "alltag", "senior", "laie", "persönlich"],
      answer: "Der „KI Einstieg für Erwachsene“ richtet sich an Menschen mit wenig oder etwas KI-Erfahrung. Vorgesehen ist ein verständlicher Einstieg ohne Technikjargon, in kleiner Gruppe und im passenden Lerntempo. Einzelheiten zu Terminen und Kosten kannst Du anfragen.",
      links: [{ label: "KI Einstieg für Erwachsene", url: "index.html#erwachsene" }],
    },
    {
      id: "W04", title: "Für wen eignen sich die Angebote?",
      match: "f(ü|ue)r wen (ist|sind|eignet sich|eignen sich) (das|die angebote|das angebot|euer angebot|eure angebote)|ist das (auch )?(was |etwas )?f(ü|ue)r (kleine (unternehmen|firmen)|f(ü|ue)hrungskr(ä|ae)fte|angestellte|anf(ä|ae)nger|mich)|ich bin anf(ä|ae)nger|k(ö|oe)nnen f(ü|ue)hrungskr(ä|ae)fte",
      keywords: ["zielgruppe", "für wen", "führungskr", "geschäftsführ"],
      answer: "Die Angebote richten sich unter anderem an Geschäftsführung und Fachverantwortliche, Mitarbeitende, Ausbildungsbetriebe und Bildungsträger, Erwachsene mit wenig KI-Erfahrung sowie Jugendliche zwischen 13 und 18 Jahren im Bildungskontext. Welches Format passt, hängt von Deinem Ziel ab.",
      links: [{ label: "Angebote im Überblick", url: "index.html#angebote" }],
    },
    {
      id: "W03", title: "Welche Leistungen gibt es?",
      match: "welche (leistungen|angebote|kurse|workshops|schulungen|ki-angebote|formate)( und [a-zäöü]+)? (gibt es|bietet ihr|habt ihr|bietest du)|was kann man (bei euch|hier) buchen|habt ihr schulungen|(etwas|was) f(ü|ue)r privat|^angebote?$",
      keywords: ["angebot", "leistung", "kurs", "workshop", "schulung", "training", "buchen"],
      answer: "Auf der Website findest Du den KI-Einstieg für Unternehmen, das Mitarbeitertraining, den Young Starter für Auszubildende, Angebote für Erwachsene und Jugendliche sowie Orientierung zur betrieblichen Wissensbasis. Die einzelnen Formate sind im Bereich „Angebote“ beschrieben.",
      links: [{ label: "Angebote im Überblick", url: "index.html#angebote" }],
    },
    {
      id: "W25", title: "Zahlen zur Wissenssuche",
      match: "(25|56|71) prozent|welche studie|atlassian|state of teams|woher (kommen|stammen|sind) die (zahlen|prozent|werte)|wissenszahlen|suchzeit",
      keywords: ["studie", "atlassian", "prozent", "zahlen", "suchzeit"],
      answer: "Die Zahlen stammen aus der Studie „The State of Teams 2025“ von Atlassian. Danach verbringt ein Viertel der Befragten etwa ein Viertel der Arbeitswoche mit der Suche nach Informationen, 56 Prozent müssen häufig andere fragen oder ein Meeting ansetzen, und 71 Prozent der Teams schöpfen KI beim Umgang mit Informationen nicht vollständig aus. Das sind Ergebnisse aus der befragten Stichprobe, keine gemessenen Werte für Dein Unternehmen.",
      links: [{ label: "Geschäftswissen / Wissensbasis", url: "index.html#wissensbasis" }, { label: "Studie (PDF)", url: "https://atlassianblog.wpengine.com/wp-content/uploads/2025/03/the-state-of-teams-2025.pdf" }],
    },
    {
      id: "W15", title: "E-Mails, Dateien und Systeme in der Wissensbasis",
      match: "(e-?mails|mails) .*durchsuchen|\\bcrm\\b|\\berp\\b|meetingprotokolle|meetings und chats|wissensbot|alles unternehmenswissen verbinden|systeme (anbinden|anschliessen|einbeziehen)",
      keywords: ["crm", "erp", "e-mails", "meetings", "chats", "wissensbot"],
      answer: "Die Lösungsskizze auf der Website zeigt E-Mails, Dateien, Meetings, Chats sowie ERP und CRM als mögliche Quellen einer gemeinsamen Wissensbasis. Das ist eine Skizze, keine Zusage, dass bestehende Systeme bereits angebunden sind. Welche Quellen geeignet und zulässig sind, muss im Einzelfall geprüft werden.",
      links: [{ label: "Wissensbasis: So kann eine Lösung aussehen", url: "index.html#wissensbasis" }],
    },
    {
      id: "W14", title: "Geschäftswissen / Wissensbasis",
      match: "gesch(ä|ae)ftswissen|single source of truth|internes wissen|unternehmenswissen|dokumente sind verstreut|wissen (besser )?auffindbar|neue mitarbeiter(innen|ende)? schneller|wissensbasis (bei euch|von euch|auf der (seite|website))|was bedeutet wissensbasis",
      keywords: ["wissen", "wissensbasis", "geschäftswissen", "dokumentation", "ablage", "suchen", "finden", "version", "einarbeitung", "onboarding", "intranet", "single source"],
      answer: "Im Bereich „Geschäftswissen / Wissensbasis“ zeigt die Website, wie Unternehmenswissen geordnet und als verlässliche Quelle gepflegt werden kann. Erst wenn Quellen, Zuständigkeiten und Zugriffsrechte geklärt sind, kann KI beim Finden und Zusammenfassen helfen. Dazu gibt es eine beispielhafte Lösungsskizze.",
      links: [{ label: "Geschäftswissen / Wissensbasis", url: "index.html#wissensbasis" }],
    },
    {
      id: "W19", title: "Was kostet das Angebot?",
      match: "was kostet (das|ein workshop|eine schulung|ein training|die beratung|das angebot|euer|eure|der kurs|das screening)|^was kostet$|^kosten$|^preise?$|preisliste|wie teuer ist (eine|die|das|euer) (schulung|workshop|training|beratung|angebot)|erstgespr(ä|ae)ch (gratis|kostenlos)|ist das erstgespr(ä|ae)ch|was verlangt ihr|was nehmt ihr",
      keywords: ["preis", "kost", "euro", "teuer", "günstig", "honorar", "gebühr"],
      answer: "Das Screening von 10–15 Minuten ist kostenlos. Für weitere Workshops und Schulungen steht auf der Website kein verbindlicher Preis. Ein konkretes Angebot hängt vom gewählten Format und Umfang ab – Du kannst es gern anfragen.",
      links: [{ label: "Anfragen", url: "index.html#kontakt" }],
    },
    {
      id: "W21", title: "Ist ein gewählter Termin bestätigt?",
      match: "termin .*(sicher|fix|best(ä|ae)tigt|verbindlich)|terminbest(ä|ae)tigung|wer best(ä|ae)tigt|ausgegraut|buchung best(ä|ae)tigt",
      keywords: ["bestätig", "ausgegraut", "verbindlich"],
      answer: "Ausgegraute Termine sind bereits vergeben. Einen ausgewählten Termin bestätigt Stefan, nachdem Deine Anfrage eingegangen ist. Ich selbst kann keinen Termin verbindlich zusagen und nicht sehen, ob eine Bestätigung schon verschickt wurde.",
      links: [{ label: "Termin vereinbaren", url: "index.html#kontakt" }],
    },
    {
      id: "W22", title: "Impressum und Datenschutz",
      match: "datenschutzerkl|impressum|kontaktformulardaten|rechtliche(n)? (informationen|angaben)|datenschutzlink|wo (finde ich|steht|stehen) .*datenschutz",
      keywords: ["impressum", "datenschutzerklärung", "rechtlich", "anschrift"],
      answer: "Impressum und Datenschutzerklärung findest Du ganz unten auf jeder Seite. Dort stehen die jeweils aktuellen Angaben. Eine individuelle Rechtsauskunft kann ich nicht geben.",
      links: [{ label: "Datenschutz", url: "datenschutz.html" }, { label: "Impressum", url: "impressum.html" }],
    },
    {
      id: "W20", title: "Kontakt aufnehmen",
      match: "kontakt|wie erreiche ich|wie kann ich (stefan|dich|euch|ihn) erreichen|anfrage stellen|r(ü|ue)ckruf|kennenlerngespr(ä|ae)ch|mit jemandem sprechen|telefonnummer",
      keywords: ["kontakt", "anfrag", "erstgespräch", "anruf", "telefon", "mail", "erreich", "melden", "rückruf"],
      answer: "Nutze am besten das Kontaktformular. Dort gibst Du Dein Thema an und wählst einen Termin für ein unverbindliches, etwa 15-minütiges Kennenlerngespräch am Telefon.",
      links: [{ label: "Anfragen", url: "index.html#kontakt" }],
    },
    {
      id: "W27", title: "Welche KI-Plattformen kennt Paul?",
      match: "welche (ki-?)?(programme|tools|plattformen) (kann ich hier|kennst du|erkl(ä|ae)rst du|geh(ö|oe)ren)|kennt (euer|dein|der) chatbot|kann ich hier (etwas |was )?(ü|ue)ber .* lernen|erkl(ä|ae)rst du mir|wird hier (auch )?.* erkl(ä|ae)rt|fragenkatalog",
      keywords: ["fragenkatalog", "kennst du"],
      answer: "Ich beantworte grundlegende Fragen unter anderem zu ChatGPT, Claude, Google Gemini, Mistral Vibe (früher Le Chat), Microsoft Copilot, Microsoft 365 Copilot, Perplexity, Gemini Notebook (früher NotebookLM), GitHub Copilot, Grok, DeepSeek, Meta AI und Aleph Alpha PhariaAI. Das heißt nicht, dass AI Work Lab all diese Produkte vertreibt, einführt oder in Schulungen verbindlich abdeckt. Russische Anbieter sind ausgeschlossen.",
    },
  ],

  basiswissen: [
    // Mehrere Plattformen oder Vergleiche – vor den einzelnen Anbietern prüfen
    {
      id: "B32", title: "Was bedeutet „CMS Copilot“?",
      match: "cms-? ?copilot",
      keywords: ["cms copilot"],
      answer: "„CMS Copilot“ lässt sich ohne Hersteller oder Produktlink nicht eindeutig zuordnen. Falls Du Microsoft Copilot oder Microsoft 365 Copilot meinst, erkläre ich Dir gern beide und den Unterschied. Falls es um einen Copilot für ein Content-Management-System (CMS) geht, nenn mir bitte das System oder den Anbieter.",
    },
    {
      id: "B41", title: "Welcher KI-Anbieter ist für Unternehmensdaten sicher?",
      match: "(welche|welcher) (plattform|anbieter|ki) ist (dsgvo|datenschutz)|dsgvo-?konforme? (plattform|ki|anbieter)|sicherer als|mit sensiblen daten|kundendaten in deepseek|firmendaten bei ki sch(ü|ue)tzen|datenschutzfreundlich|(anbieter|plattform) .*f(ü|ue)r unternehmensdaten sicher",
      keywords: ["datenschutzfreundlich", "sicherer", "sensibl"],
      answer: "Eine pauschale Aussage wie „Anbieter X ist immer DSGVO-konform“ wäre falsch. Prüf für die konkrete Produktvariante vor allem Datenflüsse und Speicherorte, Rollen und Berechtigungen, Auftragsverarbeitung, Löschkonzept, Nutzungsbedingungen und die Datenschutzfreigabe im Unternehmen. Kostenlose Privatkonten sind nicht automatisch für vertrauliche Geschäftsdaten geeignet.",
      links: [{ label: "Quelle: Microsoft", url: "https://support.microsoft.com/de-de/microsoft-365-copilot/what-s-the-difference-between-microsoft-copilot-free-and-copilot-in-microsoft-365" }],
    },
    {
      id: "B44", title: "Was kostet eine KI-Plattform?",
      match: "ist (claude|gemini|copilot|mistral|chatgpt|perplexity|grok|deepseek) (gratis|kostenlos|umsonst)|f(ü|ue)r (gemini|claude|copilot|perplexity) bezahlen|wie teuer ist (copilot|chatgpt|claude|gemini|perplexity)|welche kostenlose ki|kostenfreies|ki-?abo|was kostet ein (ki-)?abonnement",
      keywords: ["abo", "abonnement", "kostenlos", "gratis", "tarif"],
      answer: "Viele Plattformen bieten Einstiegsmöglichkeiten oder verschiedene Lizenzmodelle. Genaue Preise, Freigrenzen und enthaltene Funktionen ändern sich häufig – ohne aktuellen Blick auf die offizielle Preisseite nenne ich deshalb keine konkreten Tarife. Für Unternehmensentscheidungen zählen Gesamtaufwand und Datenschutzbedingungen.",
    },
    {
      id: "B12", title: "Reicht kostenlose KI?",
      match: "chatgpt plus|muss ich f(ü|ue)r (ki|chatgpt) bezahlen|gratis-? ?version|kostenlos oder bezahlt|reicht (die )?(kostenlose|gratis)|kostenlose ki ausreichend|was kostet ein (gutes )?ki-?tool",
      keywords: ["gratis", "bezahlen", "plus", "kostenlose"],
      answer: "Für einfache Lern- und Testaufgaben können kostenlose Angebote reichen. Bezahlte Tarife unterscheiden sich je nach Anbieter bei Funktionen, Kapazitäten und Nutzungsbedingungen. Aktuelle Preise und Datenregeln prüfst Du am besten direkt beim Anbieter. Für Unternehmensdaten zählen Freigabe und Schutz mehr als der Name des Tarifs.",
    },
    {
      id: "B42", title: "Mehrere KI-Plattformen vergleichen oder kombinieren",
      match: "mehrere (ki-?)?(systeme|plattformen|anbieter)|parallel (benutzen|nutzen)|multi-?modell|ki-?modelle wechseln|f(ü|ue)r einen (ki-?)?anbieter entscheiden|antworten von .* vergleichen|dieselbe frage an mehrere",
      keywords: ["kombinier", "parallel", "mehrere"],
      answer: "Ja. Für einen fairen Vergleich gibst Du mehreren Anwendungen dieselbe freigegebene Aufgabe und bewertest Ergebnisqualität, Korrekturbedarf, Quellen, Zeit und Kosten. Verschiedene Plattformen können unterschiedliche Rollen übernehmen. Beachte, dass Tarife, Modelleinstellungen und Datenfreigaben die Ergebnisse beeinflussen.",
    },
    {
      id: "B40", title: "Welche KI-Plattform passt zu welcher Aufgabe?",
      match: "welche ki (ist gut|eignet sich) f(ü|ue)r (recherche|e-?mails|pdfs?|programmierung)|was soll ich f(ü|ue)r e-?mails nutzen|ki-assistent(en)? .*f(ü|ue)r word|was nutze ich f(ü|ue)r|vergleiche (claude|chatgpt|gemini|copilot)|welche ki-?plattform passt|passende ki f(ü|ue)r (meine|unsere) firma|welche ki hilft (mir )?bei pdfs",
      keywords: ["welche aufgabe", "passt zu", "einsatzzweck"],
      answer: "Für allgemeine Text- und Denkaufgaben kannst Du etwa ChatGPT, Claude, Gemini und Mistral Vibe testen. Für Recherche mit Quellen ist Perplexity eine Option, für eine abgegrenzte Dokumentensammlung Gemini Notebook. Für Abläufe in Microsoft 365 ist Microsoft 365 Copilot relevant, für Softwareentwicklung GitHub Copilot. Das beschreibt Schwerpunkte, keine Rangfolge – prüf bei zwei, drei echten Aufgaben Qualität, Quellen, Kosten, Datenschutz und Freigaben.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }],
    },
    {
      id: "B11", title: "Welche KI ist die beste?",
      match: "beste (ki|llm|modell|ai|chatbot)|besser als|welches ki-?modell soll ich|welche (ki|ai) soll ich nehmen|am st(ä|ae)rksten|welche ki eignet sich f(ü|ue)r (texte|bilder)|welches ki-?modell passt",
      keywords: ["beste", "besser", "stärkste", "modell"],
      answer: "Eine pauschal beste KI gibt es nicht. Die Wahl hängt von Aufgabe, Qualität, Kosten, Datenschutz und den Freigaben in Deinem Unternehmen ab. Ein Modellvergleich ist eine Orientierung – teste die infrage kommenden Anwendungen mit eigenen, freigegebenen Aufgaben. Der KI-Kompass hilft Dir dabei.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }],
    },
    {
      id: "B43", title: "KI-Modell, Plattform und Assistent",
      match: "app oder (ein )?modell|(modell|plattform) und (plattform|modell)|ist (gemini|copilot|gpt|chatgpt|claude) ein (llm|eigenes sprachmodell|modell)|was bedeutet api|\\bapi\\b|plattformen mehrere modelle",
      keywords: ["api", "plattform", "assistent"],
      answer: "Ein KI-Modell verarbeitet Eingaben und erzeugt Ergebnisse. Eine Plattform oder App stellt zusätzlich Oberfläche, Konten, Werkzeuge, Datenverbindungen und Sicherheitsfunktionen bereit. Manche Plattformen nutzen mehrere Modelle oder wechseln sie – deshalb lässt sich die Qualität einer Anwendung nicht allein am Modellnamen ablesen.",
    },
    {
      id: "B45", title: "Anbieter und Herkunftsländer",
      match: "europ(ä|ae)ische (ki-?)?anbieter|herkunft|woher kommen (mistral|aleph)|internationale ki-?anbieter",
      keywords: ["europäisch", "herkunft", "land"],
      answer: "Mein Wissen umfasst international relevante Anbieter, schließt russische Plattformen aber ausdrücklich aus. Europäische Beispiele sind Mistral AI aus Frankreich und Aleph Alpha aus Deutschland. Die Herkunft allein ist weder eine Datenschutzfreigabe noch eine Qualitätsbewertung.",
      links: [{ label: "Quelle: Mistral AI", url: "https://mistral.ai/" }, { label: "Quelle: Aleph Alpha", url: "https://aleph-alpha.com/" }],
    },
    {
      id: "B25", title: "Bekannte KI-Plattformen",
      match: "welche (ki-?)?(plattformen|tools|systeme|assistenten|chatbots) (gibt es|sollte ich kennen|sind wichtig|sind (f(ü|ue)r firmen )?interessant)|gibt es (eine |andere )?alternativen? zu chatgpt|wichtigsten chatbots|bekannten ki-?assistenten|ausser claude|andere ai-?tools",
      keywords: ["plattformen", "alternative", "chatbots", "ki-tools"],
      answer: "Wichtige Angebote sind ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Vibe (Mistral, früher Le Chat), Microsoft Copilot und Microsoft 365 Copilot. Für bestimmte Aufgaben kommen Perplexity (Recherche), Gemini Notebook (früher NotebookLM, Arbeit mit Quellen), GitHub Copilot (Programmierung), Grok, DeepSeek, Meta AI und für Unternehmen Aleph Alpha PhariaAI infrage. Das ist eine Auswahl, keine Rangfolge; russische Anbieter sind ausgeschlossen.",
      links: [{ label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" }],
    },

    // Grundlagen und Einsatz – vor den einzelnen Anbietern, weil Fragen oft „ChatGPT“ nennen
    {
      id: "B10", title: "Ist KI dasselbe wie eine Suchmaschine?",
      match: "suchmaschine|googeln oder|unterschied (zwischen )?google|google und chatgpt|suche im internet|alle webseiten lesen|automatisch aktuelle informationen",
      keywords: ["suchmaschine", "google", "googeln"],
      answer: "Eine Suchmaschine findet in erster Linie Quellen. Ein KI-Chatbot formuliert Antworten und kann – je nach Produkt und Funktion – zusätzlich im Internet suchen. Ohne aktuellen Datenzugriff können Informationen veraltet oder unvollständig sein; prüf bei aktuellen Fragen Datum und Quelle.",
    },
    {
      id: "B02", title: "ChatGPT und Sprachmodelle",
      match: "(chatgpt|gpt) (dasselbe|das gleiche|das selbe) wie ki|unterschied (zwischen )?ki und chatgpt|was (bedeutet|ist) (ein )?llm|grosses sprachmodell|was ist ein sprachmodell|so gut schreiben",
      keywords: ["llm", "sprachmodell", "large language"],
      answer: "KI ist der Oberbegriff. ChatGPT ist eine Anwendung, die unter anderem große Sprachmodelle nutzt (Large Language Models, kurz LLMs). Solche Modelle verarbeiten Sprache und erzeugen Antworten auf Basis gelernter Muster. ChatGPT ist also ein Beispiel für eine KI-Anwendung – nicht die ganze KI.",
    },
    {
      id: "B23", title: "Kann KI aktuelle Informationen liefern?",
      match: "nachrichten von heute|neuesten stand|aktuelle gesetze|neueste studie|wie aktuell (sind|ist) (deine|die) (antworten|ki)|aktuelle informationen liefern",
      keywords: ["aktuell", "neuesten stand"],
      answer: "Das hängt davon ab, ob die Anwendung gerade auf aktuelle, verlässliche Quellen zugreifen kann. Ein hinterlegtes Wissensdokument aktualisiert sich nicht von selbst. Bei Gesetzen, Preisen, Produktfunktionen und Rankings solltest Du Datum und Originalquelle immer selbst prüfen.",
    },
    {
      id: "B15", title: "EU AI Act",
      match: "ai act|ki-?verordnung|schulungspflicht|artikel 4|ki-?kompetenz|leute in ki schulen|regeln gelten beim einsatz",
      keywords: ["ai act", "verordnung", "schulungspflicht", "kompetenz"],
      answer: "Der EU AI Act regelt den Einsatz bestimmter KI-Systeme nach ihrem Risiko. Artikel 4 verpflichtet Anbieter und Betreiber von KI-Systemen, die KI-Kompetenz ihrer Mitarbeitenden und weiterer betroffener Personen zu fördern. Umfang und Inhalte hängen vom Einsatz ab; ein bestimmter Abschluss oder Standardkurs ist nicht vorgeschrieben. Maßgeblich sind die amtlichen Texte – das ist keine Rechtsberatung.",
      links: [{ label: "Quelle: EU-Kommission, Art. 4", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4" }],
    },
    {
      id: "B20", title: "Was ist RAG?",
      match: "\\brag\\b|retrieval|mit unseren dateien antworten|dokumente und (einen )?chatbot|mit firmendaten trainieren",
      keywords: ["rag", "retrieval"],
      answer: "RAG („Retrieval-Augmented Generation“) heißt vereinfacht: Die KI sucht zuerst in einer angebundenen Wissensquelle und nutzt passende Fundstellen für ihre Antwort. Dafür muss ein Modell meist nicht neu trainiert werden. Quellenqualität, Zugriffsrechte und die Prüfung der Antwort bleiben entscheidend.",
    },
    {
      id: "B14", title: "Ist KI DSGVO-konform?",
      match: "dsgvo|datenschutzkonform|datenschutzregeln|ki rechtlich nutzen|vor dem einsatz gekl(ä|ae)rt",
      keywords: ["dsgvo", "datenschutz", "rechtlich"],
      answer: "Das lässt sich nicht pauschal beantworten. Entscheidend sind Anbieter, konkrete Anwendung, Datenarten, Rechtsgrundlage, Verträge, technische Schutzmaßnahmen und der Weg der Daten. Eine Freigabe sollte mit den zuständigen Datenschutz- und IT-Verantwortlichen erfolgen. Das ist keine verbindliche Rechtsberatung.",
    },
    {
      id: "B13", title: "Kunden- oder Unternehmensdaten eingeben?",
      match: "kundendaten|namen von kunden|unternehmensdaten|firmendaten|vertraulich|personaldaten|excel-?liste hochladen|welche daten geh(ö|oe)ren nicht|dokumente in chatgpt hochladen",
      keywords: ["kundendaten", "firmendaten", "vertraulich", "personaldaten", "hochladen"],
      answer: "Personenbezogene oder vertrauliche Unternehmensdaten gehören nur in Anwendungen, die dafür ausdrücklich freigegeben und datenschutzrechtlich geprüft sind. Nutze für erste Übungen öffentliche, erfundene oder ausreichend anonymisierte Beispiele. Auch in freigegebenen Systemen gelten Zugriffsrechte, Zweckbindung und interne Regeln.",
      links: [{ label: "Quelle: DIHK", url: "https://www.dihk.de/de/serviceportal/fuer-gewerbetreibende-unternehmer/konkret-kann-ich-ki-ohne-sicherheitsrisiko-einsetzen--156202" }],
    },
    {
      id: "B19", title: "KI-gestützte Wissensbasis",
      match: "ki-? ?gest(ü|ue)tzte wissensbasis|wissensdatenbank|in unseren dokumenten suchen|arbeitsanweisungen|fragen an unsere dokumente|was ist eine wissensbasis",
      keywords: ["wissensdatenbank", "dokumente", "arbeitsanweisung"],
      answer: "Eine KI-gestützte Wissensbasis kann freigegebene Dokumente durchsuchen und passende Informationen mit Quellenangabe aufbereiten. Dafür müssen die Inhalte aktuell, zugänglich, verantwortet und mit sauberen Berechtigungen organisiert sein. Widersprüchliche oder veraltete Quellen löst eine KI allein nicht.",
      links: [{ label: "Geschäftswissen / Wissensbasis", url: "index.html#wissensbasis" }],
    },
    {
      id: "B21", title: "Automatisierung, KI und KI-Agent",
      match: "n8n|ki-? ?agent|automation|automatisierung|aufgaben selbst erledigen|workflow und agent",
      keywords: ["agent", "automatisierung", "workflow", "n8n"],
      answer: "Eine klassische Automatisierung führt festgelegte Schritte nach Regeln aus. KI kann unstrukturierte Inhalte deuten und Antworten oder Vorschläge erzeugen. Ein KI-Agent verbindet ein Modell mit Werkzeugen und Abläufen, um Teilaufgaben auszuführen. Je mehr ein System selbstständig tun darf, desto wichtiger werden Berechtigungen, Prüfungen und Freigaben.",
    },
    {
      id: "B03", title: "Generative KI",
      match: "generative|genai|gen ai|inhalte generieren|kann (die )?(ki|ai) (selber|selbst) (texte|bilder)",
      keywords: ["generativ", "generieren"],
      answer: "Generative KI kann neue Inhalte wie Texte, Bilder, Ton oder Code erzeugen. Andere KI-Systeme ordnen zum Beispiel Daten ein oder treffen Vorhersagen. Ob ein erzeugter Inhalt richtig, geeignet und rechtlich verwendbar ist, muss im jeweiligen Einsatz geprüft werden.",
    },
    {
      id: "B09", title: "KI-Ergebnisse und Quellen prüfen",
      match: "wie erkenne ich|quelle echt|verifizier|links und studienangaben|wie (prüfe|pruefe|überprüfe|ueberpruefe) ich|ergebnis (ü|ue)berpr(ü|ue)fen",
      keywords: ["prüfen", "überprüfen", "quelle", "verifizier"],
      answer: "Prüf, ob die genannte Quelle existiert, aktuell ist und die konkrete Aussage tatsächlich belegt. Bei Gesetzen, Preisen, Zahlen oder medizinischen und finanziellen Fragen sind aktuelle Originalquellen besonders wichtig. Eine Quellenliste der KI ersetzt keine eigene Prüfung.",
    },
    {
      id: "B08", title: "Kann KI falsche Antworten erfinden?",
      match: "l(ü|ue)gt|halluzin|ausdenken|falsche fakten|stimmt (immer )?alles|automatisch richtig|unsinn erz(ä|ae)hl|(antworten|quellen|fakten) erfinden|kann (die )?(ki|ai|chatgpt) sich irren",
      keywords: ["halluzin", "lügt", "falsch", "erfinden"],
      answer: "Ja. Generative KI kann fehlerhafte Informationen sehr überzeugend formulieren oder sogar Quellen erfinden – das nennt man oft „Halluzination“. Prüf wichtige Fakten an verlässlichen Originalquellen und lass Dir Unsicherheiten offen nennen.",
      links: [{ label: "Quelle: NIST (PDF)", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" }],
    },
    {
      id: "B07", title: "Bessere KI-Antworten",
      match: "ungenau|fragen besser|antwort verbessern|versteht (die ki |chatgpt )?mich nicht|gute anweisungen|schlechte(n|s)? ergebnis|bessere (ki-?)?antworten",
      keywords: ["ungenau", "verbessern", "besser formulieren"],
      answer: "Beschreib die Aufgabe möglichst konkret: Ziel, Zielgruppe, Hintergrund, Format und Grenzen. Gib bei Bedarf ein Beispiel und bitte die KI, Unsicherheiten kenntlich zu machen. Prüf die erste Antwort und frag gezielt nach Korrekturen – ohne vertrauliche Inhalte einzugeben, die dort nicht hingehören.",
    },
    {
      id: "B06", title: "Was ist ein Prompt?",
      match: "prompt|was muss ich der ki schreiben|wie stelle ich der ki eine frage|ki-?auftrag",
      keywords: ["prompt", "anweisung", "auftrag"],
      answer: "Ein Prompt ist die Anweisung oder Frage, die Du an eine KI richtest. Gute Prompts nennen Aufgabe, Hintergrund, gewünschtes Ergebnis und wichtige Grenzen. Beispiel: „Fasse diesen freigegebenen Text in fünf Stichpunkten für neue Mitarbeitende zusammen. Markiere offene Fragen.“",
    },
    {
      id: "B05", title: "Ohne Vorkenntnisse starten",
      match: "keine ahnung von ki|programmierkenntnisse|ist ki kompliziert|wie lerne ich (chatgpt|ki)|als anf(ä|ae)nger mitmachen|nicht technikaffin|ohne vorkenntnisse|wie fange ich (mit ki )?an",
      keywords: ["anfänger", "vorkenntnisse", "lernen", "kompliziert"],
      answer: "Für viele KI-Anwendungen brauchst Du keine Programmierkenntnisse. Fang mit einer einfachen, unkritischen Aufgabe an, beschreib Dein Ziel und prüf das Ergebnis. Lern zuerst Möglichkeiten, Grenzen und Datenschutzregeln kennen, bevor Du vertrauliche Daten verwendest.",
      links: [{ label: "Für Einsteiger", url: "index.html#einsteiger" }],
    },
    {
      id: "B04", title: "Welche Aufgaben kann KI übernehmen?",
      match: "was kann ich mit ki machen|wof(ü|ue)r braucht man|beispiele aus dem b(ü|ue)ro|e-?mails oder protokolle|im (meinem )?alltag leisten|wobei hilft (mir )?(so ein|das) tool|was kann (die )?ki (alles|f(ü|ue)r mich)",
      keywords: ["aufgaben", "beispiele", "büro", "alltag", "protokoll"],
      answer: "KI kann zum Beispiel beim Formulieren, Strukturieren, Zusammenfassen, Übersetzen, Recherchieren und Auswerten helfen. Ein guter Einstieg ist eine wiederkehrende, gut beschreibbare Aufgabe. Bei fachlich wichtigen Ergebnissen bleibt die Prüfung durch Menschen nötig.",
    },
    {
      id: "B16", title: "Wird KI Arbeitsplätze ersetzen?",
      match: "arbeitspl(ä|ae)tze|jobs? weg|(ü|ue)berfl(ü|ue)ssig|angst vor ki|berufe verschwinden|menschen ersetzen|ersetzt (die )?ki",
      keywords: ["arbeitsplatz", "jobs", "ersetzen", "angst"],
      answer: "KI kann einzelne Aufgaben deutlich verändern oder automatisieren. Ob dadurch Stellen wegfallen, neue Tätigkeiten entstehen oder sich Aufgaben verschieben, hängt von Branche, Organisation und Einführung ab. Sinnvoll ist, Aufgaben systematisch anzuschauen und Mitarbeitende früh einzubeziehen; konkrete Prognosen wären ohne belastbare Daten Spekulation.",
    },
    {
      id: "B17", title: "Wie startet ein Unternehmen mit KI?",
      match: "ki im betrieb|f(ü|ue)hren wir ki .*ein|ki einf(ü|ue)hren|erste schritt bei ki|ki-?strategie|pilotprojekt|anwendungsfall finden|wie startet ein unternehmen",
      keywords: ["einführen", "strategie", "pilot", "anwendungsfall"],
      answer: "Starte bei einer konkreten Arbeitsaufgabe und kläre Ziel, Ablauf, Beteiligte, Daten und Verantwortung. Teste dann eine geeignete, freigegebene Anwendung in einem begrenzten Pilotprojekt und vergleiche Ergebnisqualität, Aufwand und Risiken mit dem bisherigen Vorgehen.",
      links: [{ label: "KI Einstieg für Unternehmen", url: "index.html#ki-start" }],
    },
    {
      id: "B18", title: "Nutzen von KI messen",
      match: "\\broi\\b|spart ki|zeit sparen|nutzen (von ki )?messen|bringt (ki|das) (etwas|was)|erfolg eines (ki-?)?workshops|produktivit(ä|ae)t",
      keywords: ["roi", "nutzen", "messen", "produktiv", "sparen"],
      answer: "Miss vor und nach einem Test dieselbe Aufgabe: Bearbeitungszeit, Fehlerquote, Nachbearbeitung, Ergebnisqualität und Zufriedenheit der Nutzenden. Rechne auch Lizenz-, Schulungs-, Prüf- und Betriebsaufwand ein. Einsparungen sind möglich, aber nicht garantiert.",
    },
    {
      id: "B22", title: "Verantwortung für KI-Ergebnisse",
      match: "haftet|verantwortung bei ki|ki-?entscheidung (einfach )?(ü|ue)bernehmen|vor (der )?ver(ö|oe)ffentlichung|auf korrektheit|ist die ki verantwortlich",
      keywords: ["haftung", "verantwortung", "korrektheit"],
      answer: "Für die Nutzung und Freigabe von KI-Ergebnissen müssen im Unternehmen klare menschliche Zuständigkeiten festgelegt sein. Vor allem bei rechtlich, wirtschaftlich oder persönlich wichtigen Entscheidungen braucht es passende Kontrollen. Eine KI-Antwort ist keine fachliche Freigabe.",
    },
    {
      id: "B24", title: "Warum macht KI nicht automatisch alles richtig?",
      match: "nicht automatisch alles richtig|abl(ä|ae)ufe nicht sofort|einfach anschalten|prozesse und schulung|beste modell nicht|datenqualit(ä|ae)t",
      keywords: ["datenqualität", "prozesse", "anschalten"],
      answer: "KI braucht eine klar beschriebene Aufgabe, geeignetes Ausgangsmaterial und überprüfbare Ergebnisse. Unklare Abläufe, schlechte Daten, fehlende Berechtigungen oder ungeübte Nutzung lassen sich durch einen Modellwechsel allein nicht beheben. Deshalb sollten Arbeitsablauf, Daten und Zuständigkeiten vor der Einführung geklärt sein.",
    },

    // Einzelne Anbieter und Produkte (Stand Oktober 2026)
    {
      id: "B35", title: "GitHub Copilot",
      match: "github-? ?copilot|coding-?assistent|beim programmieren|code schreiben|vs ?code",
      keywords: ["github", "programmier", "code"],
      answer: "GitHub Copilot ist ein KI-Werkzeug für die Softwareentwicklung. Es kann Code erklären, Vorschläge machen und beim Bearbeiten von Projekten helfen. Anders als der allgemeine Microsoft Copilot liegt sein Schwerpunkt auf Programmieraufgaben. Vorschläge müssen getestet und auf Sicherheit und Lizenzen geprüft werden.",
      links: [{ label: "Quelle: GitHub", url: "https://github.com/features/copilot" }],
    },
    {
      id: "B31", title: "Microsoft 365 Copilot",
      match: "365 copilot|\\bm365\\b|copilot (in|mit|f(ü|ue)r) (word|excel|outlook|teams|unternehmen)|(word|excel)-?dokumente .*copilot|copilot .*(word|excel|outlook|teams)",
      keywords: ["microsoft 365", "m365", "word", "excel", "outlook", "teams"],
      answer: "Microsoft 365 Copilot ist auf die Arbeit in Microsoft-365-Umgebungen ausgerichtet. Je nach Unternehmenslizenz, Einstellungen und Berechtigungen hilft er bei Aufgaben in Word, Excel, Outlook, Teams und mit freigegebenen Daten der Organisation. Eine Microsoft-365-Lizenz allein bedeutet nicht, dass alle erweiterten Copilot-Funktionen vorhanden sind.",
      links: [{ label: "Quelle: Microsoft", url: "https://learn.microsoft.com/de-de/copilot/overview" }],
    },
    {
      id: "B34", title: "Gemini Notebook (früher NotebookLM)",
      match: "notebook ?lm|gemini notebook|pdfs befragen|audio-?zusammenfassung|lernt aus meinen dokumenten|aus quellen eine zusammenfassung",
      keywords: ["notebooklm", "notebook"],
      answer: "Googles früheres „NotebookLM“ heißt seit Juli 2026 „Gemini Notebook“. Es ist ein KI-Assistent für Recherche und Lernen, der mit ausgewählten Quellen wie Dokumenten und Notizen arbeitet und Belege zu Antworten liefern kann. Auch hier gilt: mit den Originalquellen abgleichen. Datenschutz und Zugang hängen von Konto und Einstellungen ab.",
      links: [{ label: "Quelle: Google", url: "https://blog.google/intl/de-de/produkte/suchen-entdecken/notebooklm-wird-gemini-notebook/" }],
    },
    {
      id: "B33", title: "Perplexity",
      match: "perplexity|welche ki nennt quellen",
      keywords: ["perplexity"],
      answer: "Perplexity ist eine KI-gestützte Plattform für Recherche und Antworten. Ihr Schwerpunkt liegt darauf, Informationen aus dem Web zu erschließen und Quellen anzugeben. Die Quellen sind Hinweise zum Nachprüfen, kein Beweis für jede Aussage – bei wissenschaftlichen oder geschäftskritischen Fragen lies die Originalquellen.",
      links: [{ label: "Quelle: Perplexity", url: "https://www.perplexity.ai/de/hub" }],
    },
    {
      id: "B36", title: "Grok",
      match: "\\bgrok\\b|\\bxai\\b",
      keywords: ["grok", "xai"],
      answer: "Grok ist ein KI-Assistent von xAI mit Funktionen für Chat, Recherche und – je nach Tarif – weitere Medienformate. Er kann Informationen aus dem Web und aus X einbeziehen. Inhalte aus sozialen Netzwerken solltest Du besonders sorgfältig an unabhängigen Originalquellen prüfen.",
      links: [{ label: "Quelle: xAI", url: "https://x.ai/grok" }],
    },
    {
      id: "B37", title: "DeepSeek",
      match: "deep-? ?seek",
      keywords: ["deepseek"],
      answer: "DeepSeek ist ein chinesischer Anbieter von KI-Modellen, Chat-Anwendungen und Zugängen für Entwickler. Die Anwendungen können Texte verarbeiten, Fragen beantworten oder beim Programmieren helfen. Für den Einsatz im Unternehmen sind vorab vor allem Datenübermittlung, Rechtsgrundlage, Vertragsbedingungen, Betriebsform und interne Freigaben zu prüfen.",
      links: [{ label: "Quelle: DeepSeek", url: "https://www.deepseek.com/en/" }],
    },
    {
      id: "B38", title: "Meta AI und Muse",
      match: "meta-? ?ai|\\bmuse\\b|ki von meta|whatsapp",
      keywords: ["meta", "muse", "whatsapp"],
      answer: "Meta AI ist ein KI-Assistent von Meta für Fragen und praktische Aufgaben in dessen Diensten. Im September 2026 hat Meta außerdem den persönlichen Agenten „Muse“ vorgestellt, der Aufgaben über verbundene Anwendungen erledigen soll. Muse startet laut Meta in den USA – eine allgemeine Verfügbarkeit in Deutschland ist deshalb nicht anzunehmen.",
      links: [{ label: "Quelle: Meta", url: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" }],
    },
    {
      id: "B39", title: "Aleph Alpha und PhariaAI",
      match: "aleph|pharia|deutsche ki|souver(ä|ae)ne ki",
      keywords: ["aleph", "pharia", "souverän"],
      answer: "Aleph Alpha ist ein deutscher KI-Anbieter. PhariaAI richtet sich an Unternehmen und Behörden, die KI-Lösungen entwickeln und betreiben wollen, einschließlich einer Assistentenoberfläche. Es ist also nicht mit einer frei zugänglichen Chat-App für Privatleute gleichzusetzen; Betrieb, Kosten und Eignung sind im Einzelfall zu prüfen.",
      links: [{ label: "Quelle: Aleph Alpha", url: "https://docs.aleph-alpha.com/phariaai-home/latest/index.html" }],
    },
    {
      id: "B29", title: "Mistral Vibe (früher Le Chat)",
      match: "mistral|le ?chat|\\bvibe\\b|europ(ä|ae)ische alternative|franz(ö|oe)sische",
      keywords: ["mistral", "le chat", "vibe"],
      answer: "Mistral AI ist ein französischer KI-Anbieter. Sein früherer Assistent „Le Chat“ heißt seit August 2026 „Vibe“. Vibe umfasst den Chat sowie weitere Funktionen für Arbeit und Programmierung. Welche Funktionen tatsächlich verfügbar sind, prüfst Du am besten direkt beim Anbieter.",
      links: [{ label: "Quelle: Mistral AI", url: "https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe" }],
    },
    {
      id: "B30", title: "Microsoft Copilot",
      match: "copilot",
      keywords: ["copilot", "microsoft", "edge"],
      answer: "Microsoft Copilot ist ein KI-Assistent für allgemeine Fragen, Recherche und das Erstellen von Inhalten, zum Beispiel im Browser oder als App. Er ist nicht mit allen erweiterten Funktionen von Microsoft 365 Copilot gleichzusetzen: Welche Daten und Programme nutzbar sind, hängt von Konto, Lizenz und Freigaben ab.",
      links: [{ label: "Quelle: Microsoft", url: "https://support.microsoft.com/de-de/microsoft-365-copilot/what-s-the-difference-between-microsoft-copilot-free-and-copilot-in-microsoft-365" }],
    },
    {
      id: "B28", title: "Google Gemini",
      match: "gemini|\\bbard\\b",
      keywords: ["gemini", "google", "bard"],
      answer: "Gemini ist bei Google sowohl der Name einer Modellfamilie als auch der KI-Assistenten-App. Die App kann je nach Zugang beim Schreiben, Analysieren, Recherchieren und bei Aufgaben in verbundenen Google-Diensten helfen. Was genau verfügbar ist, hängt von Produkt, Tarif und Freigaben ab.",
      links: [{ label: "Quelle: Google", url: "https://blog.google/intl/de-de/produkte/suchen-entdecken/gemini-app-io-2026/" }],
    },
    {
      id: "B27", title: "Claude von Anthropic",
      match: "claude|anthropic",
      keywords: ["claude", "anthropic"],
      answer: "Claude ist ein KI-Assistent des US-Anbieters Anthropic. Er hilft unter anderem bei Textarbeit, beim Zusammenfassen von Dokumenten, beim Programmieren und beim geordneten Durchdenken von Ideen. Ob er für Deine Aufgabe besser passt als andere Anwendungen, zeigt nur ein Vergleich mit denselben Aufgaben und Qualitätskriterien.",
      links: [{ label: "Quelle: Anthropic", url: "https://support.anthropic.com/en/articles/7996845-what-are-some-things-i-can-use-claude-for" }],
    },
    {
      id: "B26", title: "ChatGPT von OpenAI",
      match: "chat ?gpt|open ?ai",
      keywords: ["chatgpt", "openai", "gpt"],
      answer: "ChatGPT ist ein KI-Assistent von OpenAI. Je nach Funktionen und Tarif hilft er beim Schreiben, Lernen, Auswerten von Dateien, Programmieren und Recherchieren. Wichtige Aussagen solltest Du prüfen; wie mit Unternehmensdaten umgegangen wird, hängt von den freigegebenen Einstellungen und dem Tarif ab.",
      links: [{ label: "Quelle: OpenAI", url: "https://help.openai.com/de-de/articles/9260256-chatgpt-capabilities-overview" }],
    },
    {
      id: "B01", title: "Was ist künstliche Intelligenz?",
      match: "^(was ist )?(eigentlich )?(ki|ai|k(ü|ue)nstliche intelligenz)$|k(ü|ue)nstliche intelligenz (ganz )?einfach|was versteht man unter (ai|ki)|was steckt hinter k(ü|ue)nstlicher intelligenz|ki was soll das|erkl(ä|ae)r mir (ki|k(ü|ue)nstliche intelligenz)|wie funktioniert das mit (dieser|der) ki",
      keywords: ["künstliche intelligenz"],
      answer: "Künstliche Intelligenz (KI) bezeichnet Computersysteme, die zum Beispiel Muster in Daten erkennen, Sprache verarbeiten, Inhalte erzeugen oder bei Entscheidungen unterstützen. Wie gut das funktioniert, hängt von Anwendung, Daten und Aufgabe ab. KI ersetzt keine fachliche Prüfung.",
    },
  ],

  // Weitere Website-Inhalte nach Schlagwörtern (Wortanfänge, klein); Antworten gehen bei
  // eingerichtetem Proxy als Kontext an das Sprachmodell
  entries: [
    {
      title: "Vorgehen: Mensch vor Werkzeug",
      url: "index.html#ansatz-title",
      keywords: ["vorgehen", "ansatz", "methode", "ablauf", "arbeitsweise", "prinzip", "philosophie", "kette"],
      answer: "Es geht nicht beim Werkzeug los, sondern bei Deinen täglichen Aufgaben: Mensch → Aufgabe → Arbeitsprozess → Verantwortung → geeignete KI.",
    },
    // Die fünf Schritte aus „KI im Unternehmen“ (Kette mit der springenden Katze)
    {
      title: "Schritt 1: Mensch",
      url: "index.html#ansatz-title",
      keywords: ["mensch", "menschen", "team wissen"],
      answer: "Am Anfang stehen die Menschen im Team: ihr Wissen, ihre Erfahrung und ihre Fragen zu KI. Ohne sie hilft auch kein Werkzeug weiter.",
    },
    {
      title: "Schritt 2: Aufgabe",
      url: "index.html#ansatz-title",
      keywords: ["aufgabe", "aufgaben", "zeitfresser", "wiederkehrend"],
      answer: "Welche wiederkehrenden Aufgaben kosten Zeit? Dort liegt der Ansatzpunkt für KI – nicht beim Werkzeug.",
    },
    {
      title: "Schritt 3: Arbeitsprozess",
      url: "index.html#ansatz-title",
      keywords: ["arbeitsprozess", "arbeitsablauf", "geschäftsprozess"],
      answer: "Wie läuft die Aufgabe heute ab? Erst ein klarer Ablauf zeigt, wo KI wirklich entlastet.",
    },
    {
      title: "Schritt 4: Verantwortung",
      url: "index.html#ansatz-title",
      keywords: ["verantwortung", "verantwortlich", "wer prüft", "haftung", "kontrolle"],
      answer: "Wer prüft das Ergebnis, welche Daten dürfen genutzt werden? Die Entscheidung bleibt beim Menschen.",
    },
    {
      title: "Schritt 5: geeignete KI",
      url: "index.html#ansatz-title",
      keywords: ["geeignete ki", "geeignet", "passende ki", "passendes werkzeug"],
      answer: "Erst jetzt wird das Werkzeug gewählt: passend zu Aufgabe, Daten und Team, nicht umgekehrt. Einen Überblick über Modelle gibt der KI-Kompass.",
      more: { label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" },
    },
    {
      title: "Über Stefan Hansen",
      url: "index.html#ueber-mich",
      keywords: ["stefan", "hansen", "über dich", "über stefan", "person", "hintergrund", "erfahrung", "trainer", "berater", "lebenslauf", "wer steckt"],
      answer: "Stefan Hansen verbindet Management-Erfahrung mit dem pragmatischen Einsatz von KI. Sein Hintergrund: Organisationsentwicklung, Management und Vertrieb im Healthcaresektor.",
    },
    {
      title: "Anfragen",
      url: "index.html#kontakt",
      keywords: ["kontakt", "anfrag", "erstgespräch", "anruf", "telefon", "mail", "erreich", "melden", "schreiben"],
      answer: "Über das Kontaktformular kannst Du ein kostenloses Erstgespräch anfragen – ein unverbindliches Kennenlerngespräch am Telefon von etwa 15 Minuten. Danach weißt Du, welches Angebot passt, und entscheidest in Ruhe.",
    },
    {
      title: "Termin wählen",
      url: "index.html#kontakt",
      keywords: ["termin", "uhrzeit", "datum", "zeitfenster", "verfügbar", "buchen", "reservier", "kalender", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "wochenende", "verschieb", "absag"],
      // Nächste freie Termine aus config.js (termine), berechnet in termine.js
      answer: function () {
        var T = window.TERMINE;
        var free = T ? T.slots().filter(function (s) { return !s.blocked; }) : [];
        var base = "Feste Screening-Termine gibt es montags und mittwochs um 16:30 Uhr sowie dienstags und donnerstags um 9:00 Uhr, jeweils 15 Minuten. ";
        if (!free.length) return base + "In den nächsten zwei Wochen ist leider alles vergeben. Schick trotzdem eine Anfrage über das Kontaktformular – Stefan meldet sich bei Dir.";
        return base + "Als Nächstes frei: " + free.slice(0, 3).map(T.label).join("; ") + ". Im Kontaktbereich wählst Du über „Termin“ einen Zeitpunkt aus und sendest ihn mit Deiner Anfrage mit; Stefan bestätigt ihn dann. Verschieben oder absagen kannst Du per Nachricht an Stefan.";
      },
    },
  ],
};
