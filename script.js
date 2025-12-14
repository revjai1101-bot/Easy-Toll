"use strict";

/* =============================
   SPA NAVIGATION + FOOTER CONTROL
   ============================= */

function showTool(id) {
  document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");

  const panel = document.getElementById(id);
  if (panel) panel.style.display = "block";

  window.location.hash = id;

  const footer = document.querySelector(".footer");
  if (footer) footer.style.display = "none";

  window.scrollTo(0, 0);
}

function goBack() {
  document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");

  history.pushState("", document.title, window.location.pathname + window.location.search);

  const footer = document.querySelector(".footer");
  if (footer) footer.style.display = "block";

  window.scrollTo(0, 0);
}

function handleHashChange() {
  const id = window.location.hash.replace("#", "");
  const footer = document.querySelector(".footer");

  if (!id) {
    document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");
    if (footer) footer.style.display = "block";
    return;
  }

  document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");
  const panel = document.getElementById(id);
  if (panel) panel.style.display = "block";

  if (footer) footer.style.display = "none";

  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", handleHashChange);
handleHashChange();

/* =============================
   SEARCH FILTER
   ============================= */

const toolSearch = document.getElementById("tool-search");
if (toolSearch) {
  toolSearch.addEventListener("input", function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll(".tool-card").forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(q) ? "block" : "none";
    });
  });
}

/* =============================
   CURRENCY CONVERTER (LIVE + FALLBACK)
   ============================= */

const topCurrencies = [
  "USD","EUR","GBP","JPY","AUD","CAD","SGD","CHF","THB","IDR","CNY","HKD","NZD","SAR",
  "AED","INR","KRW","PHP","VND","BDT","PKR","MMK","BRL","ZAR","SEK","NOK","DKK","PLN",
  "TRY","HUF","EGP","QAR","KWD","BHD","OMR","LKR","NPR","KES","RUB","MXN","ARS","NGN",
  "COP","CLP","CZK","RON","ILS","MAD","MYR"
];

// Offline fallback table
const fallbackMYR = {
  MYR: 1, USD: 0.2120, EUR: 0.1945, GBP: 0.1650, JPY: 31.40, AUD: 0.3180,
  CAD: 0.2890, SGD: 0.2855, CHF: 0.1870, THB: 7.70, IDR: 3300, CNY: 1.50,
  HKD: 1.65, NZD: 0.3420, SAR: 0.7950, AED: 0.7800, INR: 17.65, KRW: 275,
  PHP: 11.75, VND: 5000, BDT: 23, PKR: 59, MMK: 450, BRL: 1.10, ZAR: 3.85,
  SEK: 2.25, NOK: 2.22, DKK: 1.45, PLN: 0.84, TRY: 6.9, HUF: 72, EGP: 13.5,
  QAR: 0.77, KWD: 0.065, BHD: 0.08, OMR: 0.08, LKR: 70, NPR: 29, KES: 33,
  RUB: 19, MXN: 3.50, ARS: 190, NGN: 180, COP: 850, CLP: 230, CZK: 4.5,
  RON: 0.96, ILS: 0.78, MAD: 2.2
};

let LIVE_RATES = null;

const ratesBody = document.getElementById("ratesBody");

function buildRatesTable() {
  if (!ratesBody) return;

  const rates = LIVE_RATES || fallbackMYR;
  ratesBody.innerHTML = "";

  const sorted = Object.keys(rates).sort();
  sorted.forEach(code => {
    const val = Number(rates[code]);
    ratesBody.innerHTML += `
      <tr>
        <td>${code}</td>
        <td>${isFinite(val) ? val.toFixed(4) : "-"}</td>
      </tr>
    `;
  });
}

async function loadRates() {
  try {
    const res = await fetch("https://v6.exchangerate-api.com/v6/f1d5ca13ec0d67c2ef78b766/latest/MYR");
    const json = await res.json();
    LIVE_RATES = json.conversion_rates;
  } catch {
    LIVE_RATES = fallbackMYR;
  } finally {
    buildRatesTable();
  }
}
loadRates();

// Dropdown elements
const fromSel = document.getElementById("fromCurrency");
const toSel   = document.getElementById("toCurrency");
const resultBox = document.getElementById("currencyResult");

// Favorites
let favFrom = JSON.parse(localStorage.getItem("fav_from") || "[]");
let favTo   = JSON.parse(localStorage.getItem("fav_to") || "[]");

function buildCurrencyOptions(target, favList) {
  target.innerHTML = "";

  favList.forEach(c => {
    target.innerHTML += `<option value="${c}">⭐ ${c}</option>`;
  });

  topCurrencies.forEach(c => {
    if (!favList.includes(c)) {
      target.innerHTML += `<option value="${c}">${c}</option>`;
    }
  });
}

function refreshDropdowns() {
  if (fromSel) buildCurrencyOptions(fromSel, favFrom);
  if (toSel) buildCurrencyOptions(toSel, favTo);

  if (fromSel && !fromSel.value) fromSel.value = "MYR";
  if (toSel && !toSel.value) toSel.value = "USD";
}

refreshDropdowns();

// Fav buttons
const favFromBtn = document.getElementById("favFromBtn");
const favToBtn   = document.getElementById("favToBtn");

if (favFromBtn) {
  favFromBtn.addEventListener("click", () => {
    const c = fromSel.value;
    favFrom = favFrom.includes(c) ? favFrom.filter(x => x !== c) : [...favFrom, c];
    localStorage.setItem("fav_from", JSON.stringify(favFrom));
    refreshDropdowns();
  });
}

if (favToBtn) {
  favToBtn.addEventListener("click", () => {
    const c = toSel.value;
    favTo = favTo.includes(c) ? favTo.filter(x => x !== c) : [...favTo, c];
    localStorage.setItem("fav_to", JSON.stringify(favTo));
    refreshDropdowns();
  });
}

document.getElementById("convertBtn")?.addEventListener("click", () => {
  const amt = parseFloat(document.getElementById("amount").value);
  if (isNaN(amt)) {
    resultBox.innerText = "Enter a valid amount.";
    return;
  }

  const from = fromSel.value;
  const to = toSel.value;

  const rates = LIVE_RATES || fallbackMYR;

  let myrValue = (from === "MYR") ? amt : amt / rates[from];
  let final = (to === "MYR") ? myrValue : myrValue * rates[to];

  resultBox.innerText = `${amt} ${from} ≈ ${final.toFixed(4)} ${to}`;
});

/* =============================
   UNIT CONVERTER
   ============================= */

const unitCategory = document.getElementById("unit-category");
const unitFrom = document.getElementById("unit-from");
const unitTo = document.getElementById("unit-to");
const unitVal = document.getElementById("unit-value");
const unitResult = document.getElementById("unit-result");

const units = {
  length: { m:1, cm:100, mm:1000, km:0.001, inch:39.37, ft:3.28 },
  weight: { kg:1, g:1000, mg:1000000, lb:2.20462, oz:35.274 },
  temperature: "special",
  speed: { "m/s":1, "km/h":3.6, mph:2.23694 }
};

function loadUnits() {
  const c = unitCategory.value;
  unitFrom.innerHTML = "";
  unitTo.innerHTML = "";

  if (c === "temperature") {
    ["Celsius","Fahrenheit","Kelvin"].forEach(u=>{
      unitFrom.innerHTML += `<option>${u}</option>`;
      unitTo.innerHTML += `<option>${u}</option>`;
    });
  } else {
    Object.keys(units[c]).forEach(u=>{
      unitFrom.innerHTML += `<option>${u}</option>`;
      unitTo.innerHTML += `<option>${u}</option>`;
    });
  }
}
unitCategory?.addEventListener("change", loadUnits);
loadUnits();

document.getElementById("unit-convert-btn")?.addEventListener("click", () => {
  const c = unitCategory.value;
  const from = unitFrom.value;
  const to = unitTo.value;
  const v = parseFloat(unitVal.value);

  if (isNaN(v)) { unitResult.innerText = "Enter a value."; return; }

  if (c === "temperature") {
    let k;

    if (from === "Celsius") k = v + 273.15;
    else if (from === "Fahrenheit") k = (v - 32) * 5/9 + 273.15;
    else k = v;

    let final;
    if (to === "Celsius") final = k - 273.15;
    else if (to === "Fahrenheit") final = (k - 273.15) * 9/5 + 32;
    else final = k;

    unitResult.innerText = `${v} ${from} = ${final.toFixed(2)} ${to}`;
    return;
  }

  const base = v / units[c][from];
  const final = base * units[c][to];
  unitResult.innerText = `${v} ${from} = ${final.toFixed(4)} ${to}`;
});

/* =============================
   PASSWORD GENERATOR
   ============================= */

window.generatePassword = function () {
  const len = parseInt(document.getElementById("password-length").value) || 12;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random()*chars.length)];
  document.getElementById("password-result").innerText = out;
};

/* =============================
   QR GENERATOR + DOWNLOAD
   ============================= */

window.generateQR = function () {
  const val = document.getElementById("qr-input").value.trim();
  const out = document.getElementById("qr-result");
  const btn = document.getElementById("qr-download");

  if (!val) {
    out.innerHTML = "Enter text.";
    if (btn) btn.style.display = "none";
    return;
  }

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(val)}`;
  out.innerHTML = `<img id="qr-image" src="${url}" alt="QR Code">`;
  if (btn) btn.style.display = "block";
};

document.getElementById("qr-download")?.addEventListener("click", ()=>{
  const img = document.getElementById("qr-image");
  if (!img) return;
  const link = document.createElement("a");
  link.href = img.src;
  link.download = "qrcode.png";
  link.click();
});

/* =============================
   AGE CALCULATOR
   ============================= */

window.calculateAge = function () {
  const birth = new Date(document.getElementById("birthdate").value);
  const out = document.getElementById("age-result");
  if (isNaN(birth.getTime())) { out.innerText="Select a date."; return; }
  const diff = Date.now() - birth.getTime();
  out.innerText = `Age: ${new Date(diff).getUTCFullYear() - 1970} years`;
};

/* =============================
   IMAGE RESIZER
   ============================= */

window.resizeAndDisplayImage = function () {
  const file = document.getElementById("image-upload").files[0];
  const w = parseInt(document.getElementById("resize-width").value);
  const h = parseInt(document.getElementById("resize-height").value);
  const out = document.getElementById("image-result-display");
  const msg = document.getElementById("image-result-text");
  const dl = document.getElementById("img-download");

  if (!file) { alert("Upload an image."); return; }
  if (!w || !h) { msg.innerText="Invalid size."; return; }

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = ()=>{
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img,0,0,w,h);
      const url = c.toDataURL("image/png");
      out.innerHTML = `<img id="resized-image" src="${url}" style="max-width:100%;" alt="Resized image">`;
      msg.innerText = "Image resized!";
      if (dl) dl.style.display="block";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

document.getElementById("img-download")?.addEventListener("click", () => {
  const img = document.getElementById("resized-image");
  if (!img) return;
  const link = document.createElement("a");
  link.href = img.src;
  link.download = "resized-image.png";
  link.click();
});
