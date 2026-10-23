"""Aktualisiert assets/data/modelle.js aus dem offiziellen Arena-Leaderboard.

Quelle: Hugging Face Dataset „lmarena-ai/leaderboard-dataset“ (CC BY 4.0) – die
Daten hinter https://arena.ai/leaderboard. arena.ai selbst blockiert automatisierte
Abrufe, daher wird das Dataset gelesen.

Aufruf: python scripts/update_models.py   (benötigt: pip install pyarrow)
Läuft automatisch über .github/workflows/modelle.yml (täglich und auf Knopfdruck).
"""

import io
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import pyarrow.parquet as pq

DATASET = "lmarena-ai/leaderboard-dataset"
PARQUET_URL = "https://huggingface.co/datasets/" + DATASET + "/resolve/main/{board}/latest-00000-of-00001.parquet"
# Als JS-Datei (nicht JSON), damit die Seite auch lokal per file:// funktioniert
OUT = Path(__file__).resolve().parent.parent / "assets" / "data" / "modelle.js"
PREFIX = "window.MODEL_DATA = "
# Je Thema so viele Modellfamilien ausgeben; die letzte dient als Nullpunkt der Normierung
LIST_N = 25

# Themen im Auswahlfeld „Was ist mir wichtig?“. Jedes Thema nutzt ein Arena-Board und
# eine oder mehrere Kategorien daraus; bei mehreren zählt der Mittelwert (nur Modelle,
# die in allen Kategorien bewertet sind). „keywords“ ordnet das Freitext-Thema zu
# (regulärer Ausdruck, Kleinschreibung).
TASKS = [
    {
        "id": "email",
        "title": "E-Mail-Verwaltung",
        "text": "Nachrichten zusammenfassen, beantworten und im passenden Ton formulieren.",
        "board": "text",
        "categories": ["german", "instruction_following"],
        "keywords": r"e-?mail|mail|postfach|korrespondenz|anschreiben|brief",
    },
    {
        "id": "planung",
        "title": "Planung und Forecasting",
        "text": "Budgets, Szenarien und Prognosen durchrechnen und einordnen.",
        "board": "text",
        "categories": ["industry_business_and_management_and_financial_operations", "math"],
        "keywords": r"plan|forecast|prognose|budget|finanz|controlling|kalkul|szenari|umsatz|bilanz",
    },
    {
        "id": "organisation",
        "title": "Organisation",
        "text": "Aufgaben, Termine und Protokolle über längere Gespräche strukturieren.",
        "board": "text",
        "categories": ["multi_turn", "longer_query"],
        "keywords": r"organis|termin|kalender|protokoll|aufgabenliste|projekt|meeting|besprechung",
    },
    {
        "id": "prozesse",
        "title": "Prozesse und Automatisierung",
        "text": "Mehrstufige Arbeitsabläufe mit Werkzeugen eigenständig ausführen.",
        "board": "agent",
        "categories": ["overall"],
        "keywords": r"prozess|automatis|workflow|ablauf|agent|routine",
    },
    {
        "id": "dokumente",
        "title": "Dokumente auswerten",
        "text": "Verträge, Berichte und PDFs lesen, vergleichen und zusammenfassen.",
        "board": "document",
        "categories": ["overall"],
        "keywords": r"dokument|pdf|vertr[aä]g|bericht|akte|auswert",
    },
    {
        "id": "recherche",
        "title": "Recherche im Web",
        "text": "Aktuelle Informationen suchen und mit Quellen zusammenstellen.",
        "board": "search",
        "categories": ["overall"],
        "keywords": r"recherch|suche|internet|web|markt|wettbewerb|news|nachricht",
    },
    {
        "id": "texte",
        "title": "Texte und Kommunikation",
        "text": "Beiträge, Angebote und Präsentationstexte entwerfen und überarbeiten.",
        "board": "text",
        "categories": ["creative_writing", "industry_writing_and_literature_and_language"],
        "keywords": r"text|schreib|präsentation|angebot|blog|beitrag|kommunikation|redaktion",
    },
    {
        "id": "recht",
        "title": "Recht und Verwaltung",
        "text": "Vorschriften, Anträge und Behördenschreiben verständlich aufbereiten.",
        "board": "text",
        "categories": ["industry_legal_and_government"],
        "keywords": r"recht|jurist|gesetz|verwaltung|beh[oö]rde|antrag|vorschrift|compliance|dsgvo",
    },
]

# Zusätzliche Themen, die nur über das Freitext-Feld erreicht werden (Reihenfolge = Priorität)
EXTRA_TASKS = [
    {"id": "x-code", "title": "Programmierung", "board": "text", "categories": ["coding"],
     "keywords": r"programm|code|coding|software|entwickl|skript|script|makro|python|sql|\bapp\b"},
    {"id": "x-it", "title": "IT und Support", "board": "text", "categories": ["industry_software_and_it_services"],
     "keywords": r"\bit\b|it-|server|netzwerk|helpdesk|support|administ"},
    {"id": "x-bild", "title": "Bilder, Scans und Diagramme", "board": "vision", "categories": ["ocr", "diagram"],
     "keywords": r"bild|foto|scan|grafik|diagramm|chart|ocr|beleg|rechnung"},
    {"id": "x-medizin", "title": "Medizin und Gesundheit", "board": "text", "categories": ["industry_medicine_and_healthcare"],
     "keywords": r"medizin|gesundheit|pflege|arzt|ärzt|klinik|patient|health|pharma|praxis"},
    {"id": "x-medien", "title": "Medien und Marketing", "board": "text", "categories": ["industry_entertainment_and_sports_and_media"],
     "keywords": r"marketing|social|media|medien|presse|werbung|kampagne|newsletter|sport"},
    {"id": "x-wissen", "title": "Wissenschaft und Technik", "board": "text", "categories": ["industry_life_and_physical_and_social_science"],
     "keywords": r"forschung|wissenschaft|studie|labor|technik|physik|chemie|biolog|ingenieur"},
    {"id": "x-mathe", "title": "Mathematik und Analyse", "board": "text", "categories": ["math"],
     "keywords": r"mathe|rechn|statistik|analys|zahlen|excel|tabelle|daten"},
    {"id": "x-englisch", "title": "Englisch", "board": "text", "categories": ["english"],
     "keywords": r"englisch|english"},
    {"id": "x-sprachen", "title": "Fremdsprachen und Übersetzung", "board": "text", "categories": ["non_english"],
     "keywords": r"übersetz|uebersetz|sprache|französisch|spanisch|italienisch|polnisch|translat"},
    {"id": "x-experte", "title": "Fachfragen auf Expertenniveau", "board": "text", "categories": ["expert", "hard_prompts"],
     "keywords": r"expert|fachlich|komplex|schwierig|berat|strateg"},
    # Fallback, wenn nichts passt – keine Schlagwörter
    {"id": "x-gesamt", "title": "Allgemeine Aufgaben", "board": "text", "categories": ["overall"], "keywords": ""},
]

BOARD_LABELS = {"text": "Text", "agent": "Agent", "document": "Document", "search": "Search", "vision": "Vision"}
CATEGORY_LABELS = {
    "overall": "Gesamt",
    "german": "Deutsch",
    "english": "Englisch",
    "non_english": "Nicht-Englisch",
    "instruction_following": "Anweisungen befolgen",
    "industry_business_and_management_and_financial_operations": "Business, Management und Finanzen",
    "math": "Mathematik",
    "multi_turn": "Mehrere Gesprächsrunden",
    "longer_query": "Lange Anfragen",
    "creative_writing": "Kreatives Schreiben",
    "industry_writing_and_literature_and_language": "Schreiben und Sprache",
    "industry_legal_and_government": "Recht und Verwaltung",
    "coding": "Programmierung",
    "industry_software_and_it_services": "Software und IT",
    "industry_medicine_and_healthcare": "Medizin und Gesundheit",
    "industry_entertainment_and_sports_and_media": "Medien, Sport und Unterhaltung",
    "industry_life_and_physical_and_social_science": "Natur- und Sozialwissenschaften",
    "expert": "Expertenfragen",
    "hard_prompts": "Schwierige Anfragen",
    "ocr": "Texterkennung",
    "diagram": "Diagramme",
}
ORG_LABELS = {
    "anthropic": "Anthropic", "openai": "OpenAI", "google": "Google", "meta": "Meta", "xai": "xAI",
    "alibaba": "Alibaba", "deepseek": "DeepSeek", "mistral": "Mistral AI", "moonshot": "Moonshot AI",
    "zai": "Z.ai", "baidu": "Baidu", "xiaomi": "Xiaomi", "bytedance": "ByteDance", "tencent": "Tencent",
    "minimax": "MiniMax", "amazon": "Amazon", "microsoft": "Microsoft", "nvidia": "NVIDIA",
    "ibm": "IBM", "cohere": "Cohere", "stepfun": "StepFun", "ant-group": "Ant Group",
}

EFFORT = r"(?:xhigh|high|max|medium|low|minimal|search|thinking)"
SLUG_WORDS = {"gpt": "GPT", "xhigh": "xHigh", "glm": "GLM", "ernie": "ERNIE"}


def pretty_name(name):
    """Einige Boards liefern Kürzel wie „claude-opus-4-6-high“ → „Claude Opus 4.6 (High)“."""
    if " " in name or "-" not in name:
        return name
    m = re.match(r"^(.*?)-(" + EFFORT + r")$", name)
    base, effort = (m.group(1), m.group(2)) if m else (name, None)
    base = re.sub(r"(?<=\d)-(?=\d)", ".", base)
    words = [SLUG_WORDS.get(w, w[:1].upper() + w[1:]) for w in base.split("-")]
    label = " ".join(words)
    if words[0] == "GPT" and len(words) > 1:
        label = "GPT-" + " ".join(words[1:])
    if effort:
        label += " (" + SLUG_WORDS.get(effort, effort.capitalize()) + ")"
    return label


def family_label(name):
    """Modellname ohne Variante: „Claude Opus 4.6 (High)“ → „Claude Opus 4.6“."""
    label = re.sub(r"\s*\(.*?\)", "", pretty_name(name)).strip()
    return re.sub(r"[\s-]+" + EFFORT + r"$", "", label, flags=re.IGNORECASE)


def model_family(name):
    """Schlüssel, unter dem Varianten eines Modells – auch boardübergreifend – zusammengefasst werden."""
    return re.sub(r"[\s-]+", " ", family_label(name).lower()).strip()


def load_board(board):
    url = PARQUET_URL.format(board=board)
    req = urllib.request.Request(url, headers={"User-Agent": "ai-work-lab-modelle/1.0"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return pq.read_table(io.BytesIO(res.read())).to_pylist()


def score_of(row):
    return row["rating"] if "rating" in row else row["score"]


def build_task(task, rows):
    by_cat = {c: {r["model_name"]: r for r in rows if r["category"] == c} for c in task["categories"]}
    names = set.intersection(*(set(m) for m in by_cat.values()))
    if not names:
        raise ValueError("Keine Modelle für Thema " + task["id"])

    ranked = []
    for name in names:
        entries = [by_cat[c][name] for c in task["categories"]]
        org = entries[0]["organization"]
        ranked.append({
            "key": model_family(name),
            "label": family_label(name),
            "name": pretty_name(name),
            "organization": ORG_LABELS.get(org, org.capitalize() or "–"),
            "score": sum(score_of(e) for e in entries) / len(entries),
        })
    ranked.sort(key=lambda m: -m["score"])

    # Je Modellfamilie nur die stärkste Variante (High, Max …)
    models, seen = [], set()
    for m in ranked:
        if m["key"] in seen:
            continue
        seen.add(m["key"])
        models.append(m)
        if len(models) == LIST_N:
            break

    # Normierung 0–100: Spitzenmodell = 100, letztes Modell der Liste = 0.
    # Macht Themen mit unterschiedlichen Skalen (Arena-Score, Agent-Score) vergleichbar.
    top, floor = models[0]["score"], models[-1]["score"]
    agent = task["board"] == "agent"
    for m in models:
        m["norm"] = round((m["score"] - floor) / ((top - floor) or 1) * 100, 1)
        # Agent-Arena: IPS-Score (τ̂), zur Lesbarkeit × 100; übrige Boards: Arena-Score (Bradley-Terry)
        m["score"] = round(m["score"] * 100, 1) if agent else round(m["score"])

    dates = {by_cat[c][n]["leaderboard_publish_date"] for c in by_cat for n in by_cat[c]}
    return {
        "id": task["id"],
        "title": task["title"],
        "text": task.get("text", ""),
        "keywords": task["keywords"],
        "source": BOARD_LABELS[task["board"]] + "-Arena: " + ", ".join(CATEGORY_LABELS.get(c, c) for c in task["categories"]),
        "unit": "Agent-Score" if agent else "Arena-Score",
        "published": max(dates),
        "models": [m for m in models if m["norm"] > 0],
    }


def main():
    boards = {}
    for task in TASKS + EXTRA_TASKS:
        if task["board"] not in boards:
            boards[task["board"]] = load_board(task["board"])

    data = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "https://arena.ai/leaderboard",
        "dataset": "https://huggingface.co/datasets/" + DATASET,
        "license": "CC BY 4.0",
        "tasks": [build_task(t, boards[t["board"]]) for t in TASKS],
        "extra": [build_task(t, boards[t["board"]]) for t in EXTRA_TASKS],
    }

    # Nur schreiben, wenn sich die Ranglisten geändert haben – vermeidet leere Commits
    if OUT.exists():
        old = json.loads(OUT.read_text(encoding="utf-8")[len(PREFIX):].rstrip().rstrip(";"))
        if old.get("tasks") == data["tasks"] and old.get("extra") == data["extra"]:
            print("Keine Änderung.")
            return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(PREFIX + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print("Geschrieben:", OUT)


if __name__ == "__main__":
    sys.exit(main())
