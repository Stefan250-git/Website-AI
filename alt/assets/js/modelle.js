(function () {
  "use strict";

  /* ---------- KI-Kompass · Modelle: gewichtete Top 3 aus assets/data/modelle.js ---------- */
  var data = window.MODEL_DATA;
  var form = document.getElementById("model-picker");
  var rowsEl = document.getElementById("picker-rows");
  var resultEl = document.getElementById("model-result");
  if (!form || !rowsEl || !resultEl || !data || !data.tasks) return;

  var TOP = 3;
  var WEIGHTS = [
    { value: 0, label: "unwichtig" },
    { value: 1, label: "wichtig" },
    { value: 2, label: "sehr wichtig" },
  ];
  var tasks = data.tasks;
  var themes = tasks.concat(data.extra || []);
  var fallback = themes[themes.length - 1];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function dateDe(iso) {
    var p = String(iso).slice(0, 10).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : iso;
  }

  function segment(id) {
    return '<div class="seg">' + WEIGHTS.map(function (w) {
      var inputId = "w-" + id + "-" + w.value;
      return '<input type="radio" id="' + inputId + '" name="w-' + id + '" value="' + w.value + '">' +
        '<label for="' + inputId + '">' + w.label + "</label>";
    }).join("") + "</div>";
  }

  function topList(theme) {
    return theme.models.slice(0, TOP).map(function (m) {
      return "<li><strong>" + esc(m.name) + "</strong> <span>" + esc(m.organization) + "</span></li>";
    }).join("");
  }

  function topDetails(theme) {
    return '<details class="theme-top"><summary>Top 3</summary>' +
      '<ol>' + topList(theme) + '</ol>' +
      '<p>' + esc(theme.source) + ' · Stand ' + dateDe(theme.published) + '</p></details>';
  }

  /* ---------- Auswahlfeld aufbauen ---------- */
  rowsEl.innerHTML = tasks.map(function (t) {
    return '<fieldset class="theme" data-id="' + esc(t.id) + '">' +
      '<legend class="visually-hidden">' + esc(t.title) + '</legend>' +
      '<div class="theme-info" aria-hidden="true"><strong>' + esc(t.title) + '</strong><span>' + esc(t.text) + '</span></div>' +
      segment(t.id) + topDetails(t) +
      '</fieldset>';
  }).join("") +
    '<fieldset class="theme theme-custom" data-id="custom">' +
    '<legend class="visually-hidden">Individuelles Thema</legend>' +
    '<div class="theme-info">' +
    '<label for="custom-topic"><strong>Individuelles Thema</strong> <span>(Freitext)</span></label>' +
    '<input id="custom-topic" type="text" maxlength="80" autocomplete="off" placeholder="z. B. Rechnungen prüfen, Übersetzungen, Social Media" aria-describedby="custom-match">' +
    '<span class="custom-match" id="custom-match"></span>' +
    '</div>' +
    segment("custom") +
    '<div class="theme-top-slot" id="custom-top"></div>' +
    '</fieldset>';

  var customInput = document.getElementById("custom-topic");
  var customMatchEl = document.getElementById("custom-match");
  var customTopEl = document.getElementById("custom-top");
  var progressBar = document.getElementById("picker-progress");
  var progressLabel = document.getElementById("picker-progress-label");
  var customTheme = null;

  // Freitext → passendes Thema über die Schlagwörter aus den Daten; sonst Gesamtwertung
  function matchCustom() {
    var text = customInput.value.trim().toLowerCase();
    if (!text) return null;
    for (var i = 0; i < themes.length; i++) {
      if (themes[i].keywords && new RegExp(themes[i].keywords).test(text)) return themes[i];
    }
    return fallback;
  }

  function weightOf(id) {
    var checked = form.querySelector('input[name="w-' + id + '"]:checked');
    return checked ? Number(checked.value) : null;
  }

  /* ---------- Ergebnisfeld ---------- */
  resultEl.innerHTML = '<p class="result-empty" id="result-empty"></p><ol class="result-list">' +
    [0, 1, 2].map(function (i) {
      return '<li class="result-item" style="--i:' + i + '">' +
        '<span class="result-rank">' + (i + 1) + '</span>' +
        '<span class="result-body">' +
        '<span class="result-name"><strong></strong><span></span></span>' +
        '<span class="result-bar" aria-hidden="true"><span></span></span>' +
        '<span class="result-why"></span>' +
        '</span>' +
        '<span class="result-score"></span>' +
        '</li>';
    }).join("") + "</ol>";

  var emptyEl = document.getElementById("result-empty");
  var slots = resultEl.querySelectorAll(".result-item");

  function update() {
    var picked = [];
    var touched = 0;

    tasks.forEach(function (t) {
      var w = weightOf(t.id);
      if (w !== null) touched++;
      if (w) picked.push({ theme: t, weight: w });
    });

    customTheme = matchCustom();
    var cw = weightOf("custom");
    if (customTheme && cw !== null) touched++;
    if (customTheme && cw) picked.push({ theme: customTheme, weight: cw });

    customMatchEl.textContent = customTheme
      ? "Gewertet als: " + customTheme.title + (customTheme === fallback ? " (kein spezielles Thema erkannt)" : "")
      : "";
    var customId = customTheme ? customTheme.id : "";
    if (customTopEl.getAttribute("data-theme") !== customId) {
      customTopEl.setAttribute("data-theme", customId);
      customTopEl.innerHTML = customTheme ? topDetails(customTheme) : "";
    }

    var total = tasks.length + 1;
    progressBar.style.width = (touched / total * 100) + "%";
    progressLabel.textContent = touched + " von " + total + " Themen bewertet";

    // Gewichteter Mittelwert der normierten Werte; nicht bewertete Modelle zählen 0
    var sumWeights = 0;
    var agg = {};
    picked.forEach(function (p) {
      sumWeights += p.weight;
      p.theme.models.forEach(function (m, i) {
        var a = agg[m.key] || (agg[m.key] = { label: m.label, org: m.organization, points: 0, strong: [] });
        a.points += p.weight * m.norm;
        if (i < TOP && a.strong.indexOf(p.theme.title) === -1) a.strong.push(p.theme.title);
      });
    });

    var ranked = Object.keys(agg).map(function (k) { return agg[k]; })
      .sort(function (a, b) { return b.points - a.points; });

    resultEl.classList.toggle("is-empty", !sumWeights);
    emptyEl.textContent = sumWeights ? "" : "Bewerten Sie mindestens ein Thema mit „wichtig“ oder „sehr wichtig“.";

    slots.forEach(function (slot, i) {
      var m = sumWeights ? ranked[i] : null;
      var name = slot.querySelector(".result-name strong");
      var label = m ? m.label : "";
      if (name.textContent !== label) {
        slot.classList.remove("is-new");
        void slot.offsetWidth; // Animation neu starten
        slot.classList.add("is-new");
      }
      name.textContent = label;
      slot.querySelector(".result-name span").textContent = m ? m.org : "";
      var score = m ? Math.round(m.points / sumWeights) : 0;
      slot.querySelector(".result-bar span").style.width = score + "%";
      slot.querySelector(".result-score").textContent = m ? score : "";
      slot.querySelector(".result-why").textContent = m && m.strong.length ? "Top 3 bei: " + m.strong.join(", ") : "";
    });
  }

  form.addEventListener("change", update);
  customInput.addEventListener("input", function () {
    // Wer ein Thema eintippt, meint es meist ernst: „wichtig“ vorwählen
    if (customInput.value.trim() && weightOf("custom") === null) {
      document.getElementById("w-custom-1").checked = true;
    }
    update();
  });
  form.addEventListener("reset", function () { setTimeout(update, 0); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  var updated = document.getElementById("models-updated");
  if (updated) updated.textContent = "Arena-Daten zuletzt abgerufen am " + dateDe(data.updated) + ".";

  update();
})();
