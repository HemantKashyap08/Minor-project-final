/* ---------------------------------------------------
   Play Zone — app logic
   1. Section navigation (home / cricket / football / basketball / fitness)
   2. Mobile nav toggle
   3. Calculators, one function per tool
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupMobileNav();
  setupCricketCalculators();
  setupFootballCalculators();
  setupBasketballCalculators();
  setupFitnessCalculators();
});

/* ---------- navigation ---------- */

function setupNavigation() {
  var sections = ["home", "cricket", "football", "basketball", "fitness"];
  var navLinks = document.querySelectorAll(".nav-link");
  var jumpButtons = document.querySelectorAll("[data-nav]");

  jumpButtons.forEach(function (el) {
    el.addEventListener("click", function (e) {
      var target = el.getAttribute("data-nav");
      if (!target) return;
      e.preventDefault();
      showSection(target);
    });
  });

  function showSection(target) {
    sections.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      if (id === target) {
        section.hidden = false;
      } else {
        section.hidden = true;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === target);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    var nav = document.getElementById("mainNav");
    if (nav) nav.classList.remove("is-open");
  }
}

function setupMobileNav() {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* ---------- shared helpers ---------- */

function readNumber(id) {
  var el = document.getElementById(id);
  if (!el) return NaN;
  return parseFloat(el.value);
}

function showResult(id, message, isError) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.remove("is-value", "is-error");
  el.classList.add(isError ? "is-error" : "is-value");
}

function bindForm(formId, handler) {
  var form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handler();
  });
}

function bmiClassification(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal range";
  if (bmi < 30) return "overweight";
  return "obese range";
}

function calculateBMI(resultId, weightId, heightId) {
  var weight = readNumber(weightId);
  var heightCm = readNumber(heightId);

  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    showResult(resultId, "Enter a valid weight and height.", true);
    return;
  }

  var heightM = heightCm / 100;
  var bmi = weight / (heightM * heightM);
  showResult(resultId, "BMI " + bmi.toFixed(1) + " — " + bmiClassification(bmi) + ".");
}

/* ---------- cricket ---------- */

function setupCricketCalculators() {
  bindForm("form-cricket-avg", function () {
    var runs = readNumber("cricket-avg-runs");
    var innings = readNumber("cricket-avg-innings");
    var notOuts = readNumber("cricket-avg-notout");

    if (isNaN(runs) || isNaN(innings) || isNaN(notOuts) || innings < 0 || notOuts < 0) {
      showResult("result-cricket-avg", "Fill in all three fields with valid numbers.", true);
      return;
    }

    var completed = innings - notOuts;
    if (completed <= 0) {
      showResult("result-cricket-avg", "No completed innings yet — average not out.", true);
      return;
    }

    var avg = runs / completed;
    showResult("result-cricket-avg", "Average " + avg.toFixed(2));
  });

  bindForm("form-cricket-sr", function () {
    var runs = readNumber("cricket-sr-runs");
    var balls = readNumber("cricket-sr-balls");

    if (isNaN(runs) || !balls || balls <= 0) {
      showResult("result-cricket-sr", "Enter runs and balls faced (balls must be above 0).", true);
      return;
    }

    var sr = (runs / balls) * 100;
    showResult("result-cricket-sr", "Strike rate " + sr.toFixed(2));
  });

  bindForm("form-cricket-eco", function () {
    var runs = readNumber("cricket-eco-runs");
    var overs = readNumber("cricket-eco-overs");

    if (isNaN(runs) || !overs || overs <= 0) {
      showResult("result-cricket-eco", "Enter runs conceded and overs bowled.", true);
      return;
    }

    var economy = runs / overs;
    showResult("result-cricket-eco", "Economy " + economy.toFixed(2) + " runs/over");
  });

  bindForm("form-cricket-bmi", function () {
    calculateBMI("result-cricket-bmi", "cricket-bmi-weight", "cricket-bmi-height");
  });
}

/* ---------- football ---------- */

function setupFootballCalculators() {
  bindForm("form-football-speed", function () {
    var distance = readNumber("football-speed-distance");
    var time = readNumber("football-speed-time");

    if (!distance || !time || distance <= 0 || time <= 0) {
      showResult("result-football-speed", "Enter distance and time, both above 0.", true);
      return;
    }

    var speedKmh = (distance / time) * 3.6;
    showResult("result-football-speed", "Pace " + speedKmh.toFixed(2) + " km/h");
  });

  bindForm("form-football-pass", function () {
    var success = readNumber("football-pass-success");
    var total = readNumber("football-pass-total");

    if (isNaN(success) || !total || total <= 0 || success > total) {
      showResult("result-football-pass", "Successful passes can't exceed passes attempted.", true);
      return;
    }

    var accuracy = (success / total) * 100;
    showResult("result-football-pass", "Pass accuracy " + accuracy.toFixed(1) + "%");
  });

  bindForm("form-football-goals", function () {
    var goals = readNumber("football-goals-total");
    var matches = readNumber("football-goals-matches");

    if (isNaN(goals) || !matches || matches <= 0) {
      showResult("result-football-goals", "Enter total goals and matches played.", true);
      return;
    }

    var rate = goals / matches;
    showResult("result-football-goals", rate.toFixed(2) + " goals per match");
  });

  bindForm("form-football-bmi", function () {
    calculateBMI("result-football-bmi", "football-bmi-weight", "football-bmi-height");
  });
}

/* ---------- basketball ---------- */

function setupBasketballCalculators() {
  bindForm("form-basketball-fg", function () {
    var made = readNumber("basketball-fg-made");
    var attempted = readNumber("basketball-fg-attempt");

    if (isNaN(made) || !attempted || attempted <= 0 || made > attempted) {
      showResult("result-basketball-fg", "Shots made can't exceed shots attempted.", true);
      return;
    }

    var pct = (made / attempted) * 100;
    showResult("result-basketball-fg", "Field goal " + pct.toFixed(1) + "%");
  });

  bindForm("form-basketball-ft", function () {
    var made = readNumber("basketball-ft-made");
    var attempted = readNumber("basketball-ft-attempt");

    if (isNaN(made) || !attempted || attempted <= 0 || made > attempted) {
      showResult("result-basketball-ft", "Free throws made can't exceed attempts.", true);
      return;
    }

    var pct = (made / attempted) * 100;
    showResult("result-basketball-ft", "Free throw " + pct.toFixed(1) + "%");
  });

  bindForm("form-basketball-ppg", function () {
    var points = readNumber("basketball-ppg-points");
    var games = readNumber("basketball-ppg-games");

    if (isNaN(points) || !games || games <= 0) {
      showResult("result-basketball-ppg", "Enter total points and games played.", true);
      return;
    }

    var ppg = points / games;
    showResult("result-basketball-ppg", ppg.toFixed(1) + " points per game");
  });

  bindForm("form-basketball-bmi", function () {
    calculateBMI("result-basketball-bmi", "basketball-bmi-weight", "basketball-bmi-height");
  });
}

/* ---------- fitness ---------- */

function setupFitnessCalculators() {
  bindForm("form-fitness-bmi", function () {
    calculateBMI("result-fitness-bmi", "fitness-bmi-weight", "fitness-bmi-height");
  });

  bindForm("form-fitness-bmr", function () {
    var gender = document.getElementById("fitness-bmr-gender").value;
    var weight = readNumber("fitness-bmr-weight");
    var height = readNumber("fitness-bmr-height");
    var age = readNumber("fitness-bmr-age");

    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
      showResult("result-fitness-bmr", "Fill in weight, height and age with valid numbers.", true);
      return;
    }

    var bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += gender === "male" ? 5 : -161;

    showResult("result-fitness-bmr", "BMR " + Math.round(bmr) + " kcal/day");
  });

  bindForm("form-fitness-ibw", function () {
    var gender = document.getElementById("fitness-ibw-gender").value;
    var heightCm = readNumber("fitness-ibw-height");

    if (!heightCm || heightCm <= 0) {
      showResult("result-fitness-ibw", "Enter a valid height.", true);
      return;
    }

    var heightIn = heightCm / 2.54;
    var base = gender === "male" ? 50 : 45.5;
    var extraInches = heightIn - 60;

    if (extraInches < 0) extraInches = 0;

    var ibw = base + 2.3 * extraInches;
    showResult("result-fitness-ibw", "Ideal weight ~" + ibw.toFixed(1) + " kg");
  });

  bindForm("form-fitness-cal", function () {
    var met = parseFloat(document.getElementById("fitness-cal-activity").value);
    var weight = readNumber("fitness-cal-weight");
    var duration = readNumber("fitness-cal-duration");

    if (!weight || !duration || weight <= 0 || duration <= 0) {
      showResult("result-fitness-cal", "Enter weight and duration, both above 0.", true);
      return;
    }

    var hours = duration / 60;
    var calories = met * weight * hours;
    showResult("result-fitness-cal", "~" + Math.round(calories) + " kcal burned");
  });
}