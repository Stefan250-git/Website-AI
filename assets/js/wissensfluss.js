(function () {
  "use strict";

  /* ---------- Lösungsskizze Wissensbasis ----------
     Felder und Pfeile (.flow-step) erscheinen nacheinander in Dokument-Reihenfolge.
     Ist alles sichtbar, steht das Bild kurz, blendet aus und beginnt von vorn.
     Läuft nur, solange der Dialog offen ist. Bei „reduzierte Bewegung“ nur Endzustand. */
  var STEP_MS = 650;   // Abstand zwischen zwei Feldern
  var HOLD_MS = 3500;  // fertiges Bild stehen lassen
  var FADE_MS = 700;   // Ausblenden vor dem Neustart

  var dialog = document.getElementById("flow-dialog");
  var opener = document.querySelector("[data-open-flow]");
  if (!dialog || !opener) return;

  var flow = dialog.querySelector(".flow");
  var steps = flow.querySelectorAll(".flow-step");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = null;

  function stop() {
    clearTimeout(timer);
    timer = null;
  }

  function run(i) {
    if (i < steps.length) {
      steps[i].classList.add("is-on");
      timer = setTimeout(function () { run(i + 1); }, STEP_MS);
      return;
    }
    timer = setTimeout(function () {
      flow.classList.add("is-fading");
      timer = setTimeout(function () {
        Array.prototype.forEach.call(steps, function (s) { s.classList.remove("is-on"); });
        flow.classList.remove("is-fading");
        timer = setTimeout(function () { run(0); }, STEP_MS);
      }, FADE_MS);
    }, HOLD_MS);
  }

  opener.addEventListener("click", function () {
    dialog.showModal();
    if (reduceMotion) return;
    stop();
    flow.classList.add("is-armed");
    Array.prototype.forEach.call(steps, function (s) { s.classList.remove("is-on"); });
    timer = setTimeout(function () { run(0); }, 400);
  });

  dialog.addEventListener("close", stop);
  dialog.querySelector(".check-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
})();
