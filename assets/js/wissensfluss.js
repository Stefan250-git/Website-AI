(function () {
  "use strict";

  /* ---------- Lösungsskizze Wissensbasis ----------
     Erster Durchgang: Felder und Pfeile (.flow-step) erscheinen nacheinander in Dokument-Reihenfolge.
     Danach bleibt das Modell stehen, nur die Pfeile laufen in Schleife erneut durch.
     Sobald alles steht, springt eine kleine Katze (reine Figur, ohne Bot-Funktion) von rechts
     auf die Karte und bleibt unten rechts sitzen.
     Läuft nur, solange der Dialog offen ist. Bei „reduzierte Bewegung“ nur Endzustand. */
  var STEP_MS = 650;    // Abstand zwischen zwei Feldern im ersten Durchgang
  var ARROW_MS = 900;   // Abstand zwischen zwei Pfeilen in der Schleife
  var HOLD_MS = 2500;   // Pause, bevor die Pfeile erneut laufen

  var dialog = document.getElementById("flow-dialog");
  var opener = document.querySelector("[data-open-flow]");
  if (!dialog || !opener) return;

  var flow = dialog.querySelector(".flow");
  var steps = flow.querySelectorAll(".flow-step");
  var arrows = flow.querySelectorAll(".flow-arrow");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = null;
  var catTimers = [];
  var cat = makeCat();

  // Figur der Katze aus der Ablauf-Kette übernehmen (main.js), damit sie überall gleich aussieht
  function makeCat() {
    var source = document.querySelector(".chain-cat svg");
    if (!source) return null;
    var el = document.createElement("span");
    el.className = "chain-cat flow-cat";
    el.setAttribute("aria-hidden", "true");
    el.appendChild(source.cloneNode(true));
    flow.appendChild(el);
    return el;
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
    catTimers.forEach(clearTimeout);
    catTimers = [];
    if (cat && cat.getAnimations) cat.getAnimations().forEach(function (a) { a.cancel(); });
  }

  function build(i) {
    if (i < steps.length) {
      steps[i].classList.add("is-on");
      timer = setTimeout(function () { build(i + 1); }, STEP_MS);
      return;
    }
    catJump();
    timer = setTimeout(arrowLoop, HOLD_MS);
  }

  // Pfeile ohne Übergang zurücksetzen und nacheinander neu zeichnen
  function arrowLoop() {
    Array.prototype.forEach.call(arrows, function (a) {
      a.style.transition = "none";
      a.classList.remove("is-on");
    });
    void flow.offsetWidth;
    Array.prototype.forEach.call(arrows, function (a) { a.style.transition = ""; });
    (function draw(i) {
      if (i < arrows.length) {
        arrows[i].classList.add("is-on");
        timer = setTimeout(function () { draw(i + 1); }, ARROW_MS);
      } else {
        timer = setTimeout(arrowLoop, HOLD_MS);
      }
    })(0);
  }

  // Katze springt in einem Satz von rechts unten im Bogen auf die Karte und setzt sich unten rechts
  function catJump() {
    if (!cat || !cat.animate) return;
    cat.classList.remove("is-sitting", "is-leaping");
    cat.classList.add("is-in");
    cat.classList.add("is-leaping");
    cat.animate([
      { transform: "translate(30px, 56px)", opacity: 0 },
      { transform: "translate(22px, 14px)", opacity: 1, offset: .3 },
      { transform: "translate(10px, -18px)", offset: .65 },
      { transform: "translate(0, 0)", opacity: 1 }
    ], { duration: 750, easing: "ease-in-out", fill: "forwards" });
    catTimers.push(setTimeout(function () {
      cat.classList.remove("is-leaping");
      cat.classList.add("is-sitting");
    }, 750));
  }

  function reset() {
    Array.prototype.forEach.call(steps, function (s) { s.classList.remove("is-on"); });
    if (cat) cat.classList.remove("is-in", "is-sitting", "is-leaping");
  }

  opener.addEventListener("click", function () {
    dialog.showModal();
    stop();
    if (reduceMotion) {
      if (cat) cat.classList.add("is-in");
      return;
    }
    flow.classList.add("is-armed");
    reset();
    timer = setTimeout(function () { build(0); }, 400);
  });

  dialog.addEventListener("close", stop);
  dialog.querySelector(".check-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
})();
