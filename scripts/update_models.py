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
TOP_N = 5

# Aufgabenstellungen der Seite. Jede Aufgabe nutzt ein Arena-Board und eine oder
# mehrere Kategorien daraus; bei mehreren zählt der Mittelwert (nur Modelle, die in
# allen Kategorien bewertet sind). Bezeichnungen der Kategorien: siehe CATEGORY_LABELS.
TASKS = [
    {
        "id": "email",
        "title": "E-Mail-Verwaltung",
        "text": "Nachrichten zusammenfassen, beantworten und im passenden Ton auf Deutsch formulieren.",
        "board": "text",
        "categories": ["german", "instruction_following"],
    },
    {
        "id": "planung",
        "title": "Planung und Forecasting",
        "text": "Budgets, Szenarien und Prognosen durchrechnen und betriebswirtschaftlich einordnen.",
        "board": "text",
        "categories": ["industry_business_and_management_and_financial_operations", "math"],
    },
    {
        "id": "organisation",
        "title": "Organisation",
        "text": "Aufgaben, Termine und Protokolle über längere Gespräche hinweg strukturieren.",
        "board": "text",
        "categories": ["multi_turn", "longer_query"],
    },
    {
        "id": "prozesse",
        "title": "Prozesse und Automatisierung",
        "text": "Mehrstufige Arbeitsabläufe mit Werkzeugen eigenständig ausführen.",
        "board": "agent",
        "categories": ["overall"],
    },
    {
        "id": "dokumente",
        "title": "Dokumente auswerten",
        "text": "Verträge, Berichte und PDFs lesen, vergleichen und die Kernaussagen herausziehen.",
        "board": "document",
        "categories": ["overall"],
    },
    {
        "id": "recherche",
        "title": "Recherche im Web",
        "text": "Aktuelle Informationen suchen und mit Quellenangaben zusammenstellen.",
        "board": "search",
        "categories": ["overall"],
    },
    {
        "id": "texte",
        "title": "Texte und Kommunikation",
        "text": "Beiträge, Angebote und Präsentationstexte entwerfen und überarbeiten.",
        "board": "text",
        "categories": ["creative_writing", "industry_writing_and_literature_and_language"],
    },
    {
        "id": "recht",
        "title": "Recht und Verwaltung",
        "text": "Vorschriften, Anträge und Behördenschreiben verständlich aufbereiten.",
        "board": "text",
        "categories": ["industry_legal_and_government"],
    },
]

BOARD_LABELS = {"text": "Text", "agent": "Agent", "document": "Document", "search": "Search"}
CATEGORY_LABELS = {
    "overall": "Gesamt",
    "german": "Deutsch",
    "instruction_following": "Anweisungen befolgen",
    "industry_business_and_management_and_financial_operations": "Business, Management und Finanzen",
    "math": "Mathematik",
    "multi_turn": "Mehrere Gesprächsrunden",
    "longer_query": "Lange Anfragen",
    "creative_writing": "Kreatives Schreiben",
    "industry_writing_and_literature_and_language": "Schreiben und Sprache",
    "industry_legal_and_government": "Recht und Verwaltung",
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


def model_family(name):
    """Schlüssel, unter dem Varianten eines Modells (High, Max …) zusammengefasst werden."""
    key = pretty_name(name).lower()
    key = re.sub(r"\s*\(.*?\)\s*", " ", key)
    key = re.sub(r"[\s-]+" + EFFORT + r"$", "", key.strip())
    return re.sub(r"[\s-]+", " ", key).strip()


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
        raise ValueError("Keine Modelle für Aufgabe " + task["id"])

    ranked = []
    for name in names:
        entries = [by_cat[c][name] for c in task["categories"]]
        ranked.append({
            "name": pretty_name(name),
            "family": model_family(name),
            "organization": ORG_LABELS.get(entries[0]["organization"], entries[0]["organization"].capitalize() or "–"),
            "license": entries[0]["license"],
            "score": sum(score_of(e) for e in entries) / len(entries),
            "ranks": [int(e["rank"]) for e in entries],
        })
    ranked.sort(key=lambda m: -m["score"])

    # Je Modellfamilie nur die stärkste Variante, damit die Top 5 unterschiedliche Modelle zeigen
    top, seen = [], set()
    for m in ranked:
        if m["family"] in seen:
            continue
        seen.add(m["family"])
        top.append(m)
        if len(top) == TOP_N:
            break

    agent = task["board"] == "agent"
    display = (lambda s: round(s * 100, 1)) if agent else round
    for m in top:
        del m["family"]
        m["score"] = display(m["score"])
    # Bezugswert für die Balkenlänge: Score des Modells auf Platz 20 dieser Aufgabe
    floor = display(ranked[min(19, len(ranked) - 1)]["score"])

    return {
        "id": task["id"],
        "title": task["title"],
        "text": task["text"],
        "source": BOARD_LABELS[task["board"]] + "-Arena: " + ", ".join(CATEGORY_LABELS.get(c, c) for c in task["categories"]),
        # Agent-Arena: IPS-Score (τ̂), zur Lesbarkeit × 100; übrige Boards: Arena-Score (Bradley-Terry)
        "unit": "Agent-Score" if agent else "Arena-Score",
        "published": rows[0]["leaderboard_publish_date"],
        "floor": floor,
        "models": top,
    }


def main():
    boards = {}
    for task in TASKS:
        if task["board"] not in boards:
            boards[task["board"]] = load_board(task["board"])

    data = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "https://arena.ai/leaderboard",
        "dataset": "https://huggingface.co/datasets/" + DATASET,
        "license": "CC BY 4.0",
        "tasks": [build_task(t, boards[t["board"]]) for t in TASKS],
    }

    # Nur schreiben, wenn sich die Ranglisten geändert haben – vermeidet leere Commits
    if OUT.exists():
        old = json.loads(OUT.read_text(encoding="utf-8")[len(PREFIX):].rstrip().rstrip(";"))
        if old.get("tasks") == data["tasks"]:
            print("Keine Änderung.")
            return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(PREFIX + json.dumps(data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print("Geschrieben:", OUT)


if __name__ == "__main__":
    sys.exit(main())
