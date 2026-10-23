(function () {
  "use strict";

  /* ---------- Modelle: Top 5 je Aufgabe aus assets/data/modelle.js ---------- */
  var data = window.MODEL_DATA;
  var grid = document.getElementById("models-grid");
  var updated = document.getElementById("models-updated");
  if (!grid || !data || !data.tasks) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function dateDe(iso) {
    var p = String(iso).slice(0, 10).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : iso;
  }

  function num(n) { return String(n).replace(".", ","); }

  grid.innerHTML = data.tasks.map(function (task) {
    var top = task.models[0].score;
    var range = top - task.floor || 1;

    var rows = task.models.map(function (m, i) {
      // Mindestlänge, damit auch Platz 5 sichtbar bleibt
      var width = Math.max(8, Math.round((m.score - task.floor) / range * 100));
      return '<li>' +
        '<span class="rank-no">' + (i + 1) + '</span>' +
        '<span class="rank-name"><strong>' + esc(m.name) + '</strong><span>' + esc(m.organization) + '</span></span>' +
        '<span class="rank-score">' + num(m.score) + '</span>' +
        '<span class="rank-bar" aria-hidden="true"><span style="--w:' + width + '%"></span></span>' +
        '</li>';
    }).join("");

    return '<article class="model-card" id="aufgabe-' + esc(task.id) + '">' +
      '<h2>' + esc(task.title) + '</h2>' +
      '<p class="model-task">' + esc(task.text) + '</p>' +
      '<ol class="model-rank" aria-label="Top 5 für ' + esc(task.title) + ', Werte als ' + esc(task.unit) + '">' + rows + '</ol>' +
      '<p class="model-source">' + esc(task.source) + ' · ' + esc(task.unit) + ' · Stand ' + dateDe(task.published) + '</p>' +
      '</article>';
  }).join("");

  if (updated) updated.textContent = "Zuletzt abgerufen am " + dateDe(data.updated) + ".";

  // Balken wachsen, sobald die Karte sichtbar wird
  var cards = grid.querySelectorAll(".model-card");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  grid.classList.add("is-ready");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  cards.forEach(function (card) { observer.observe(card); });
})();
