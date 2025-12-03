// ================= CORE UI =================
function showTool(id) {
  document.querySelectorAll(".tool-panel").forEach(e => e.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function goBack() {
  document.querySelectorAll(".tool-panel").forEach(e => e.style.display = "none");
}

// ================= SEARCH =================
document.getElementById('tool-search').addEventListener('keyup', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const toolName = card.querySelector('p').textContent.toLowerCase();
        card.style.display = toolName.includes(query) ? 'block' : 'none';
    });
});

// ================= CURRENCY =================
let ratesData = {};

// ******* ALL currencies for dropdown ********
const currencyList = {
    'USD': 'United States Dollar (USD)', 'EUR': 'Euro (EUR)', 'JPY': 'Japanese Yen (JPY)', 'GBP': 'British Pound (GBP)', 
    'AUD': 'Australian Dollar (AUD)', 'CAD': 'Canadian Dollar (CAD)', 'CHF': 'Swiss Franc (CHF)', 'CNY': 'Chinese Yuan (CNY)',
    'HKD': 'Hong Kong Dollar (HKD)', 'NZD': 'New Zealand Dollar (NZD)', 'SGD': 'Singapore Dollar (SGD)', 'KRW': 'South Korean Won (KRW)',
    'SEK': 'Swedish Krona (SEK)', 'NOK': 'Norwegian Krone (NOK)', 'MXN': 'Mexican Peso (MXN)', 'INR': 'Indian Rupee (INR)',
    'BRL': 'Brazilian Real (BRL)', 'ZAR': 'South African Rand (ZAR)', 'RUB': 'Russian Ruble (RUB)', 'TRY': 'Turkish Lira (TRY)',
    'AED': 'UAE Dirham (AED)', 'SAR': 'Saudi Riyal (SAR)', 'THB': 'Thai Baht (THB)', 'IDR': 'Indonesian Rupiah (IDR)',
    'MYR': 'Malaysian Ringgit (MYR)', 'PHP': 'Philippine Peso (PHP)', 'VND': 'Vietnamese Dong (VND)', 'DKK': 'Danish Krone (DKK)',
    'PLN': 'Polish Zloty (PLN)', 'HUF': 'Hungarian Forint (HUF)', 'CZK': 'Czech Koruna (CZK)', 'ILS': 'Israeli Shekel (ILS)',
    'CLP': 'Chilean Peso (CLP)', 'COP': 'Colombian Peso (COP)', 'PEN': 'Peruvian Sol (PEN)', 'EGP': 'Egyptian Pound (EGP)',
    'KWD': 'Kuwaiti Dinar (KWD)', 'QAR': 'Qatari Riyal (QAR)', 'PKR': 'Pakistani Rupee (PKR)', 'BDT': 'Bangladeshi Taka (BDT)',
    'NPR': 'Nepalese Rupee (NPR)', 'LKR': 'Sri Lankan Rupee (LKR)', 'KES': 'Kenyan Shilling (KES)', 'NGN': 'Nigerian Naira (NGN)',
    'GHS': 'Ghanaian Cedi (GHS)', 'ARS': 'Argentine Peso (ARS)', 'TWD': 'Taiwan Dollar (TWD)', 'UAH': 'Ukrainian Hryvnia (UAH)',
    'RON': 'Romanian Leu (RON)'
};

// ******* TOP 50 currencies for display table *******
const top50Currencies = [
  "USD","EUR","GBP","JPY","SGD","THB","IDR","CNY","AUD","NZD",
  "HKD","KRW","PHP","INR","VND","MYR","SAR","AED","QAR","KWD",
  "BHD","CAD","CHF","SEK","NOK","DKK","ZAR","TRY","BRL","MXN",
  "TWD","PKR","BDT","NPR","LKR","EGP","RUB","PLN","HUF","CZK",
  "ILS","ARS","CLP","PEN","COP","KES","NGN","GHS","UAH","RON"
];

// --- API Setup ---
const V6_API_KEY = 'YOUR_V6_API_KEY_HERE';
const API_URL = `https://v6.exchangerate-api.com/v6/${V6_API_KEY}/latest/MYR`;

// Fallback when API fails
const fallbackRates = {
    "MYR": 1,
    "USD": 0.2420, "EUR": 0.2083, "GBP": 0.1832, "SGD": 0.3139,
    "JPY": 37.7287, "AUD": 0.3180, "CAD": 0.2890, "CNY": 1.50,
    "THB": 7.70, "IDR": 3300.00, "HKD": 1.65, "INR": 17.65
};

async function fetchCurrencyRates() {
  const tbody = document.getElementById("ratesBody");
  const currencyResult = document.getElementById("currencyResult");

  try {
    tbody.innerHTML = '<tr><td colspan="2">Fetching live rates...</td></tr>';
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("API blocked / CORS issue");

    const data = await res.json();

    if (data.result === "success") {
      ratesData = data.conversion_rates;
      currencyResult.innerText = "Live currency rates updated.";
    } else {
      throw new Error("Malformed API data");
    }

  } catch (err) {
    console.warn("API failed → using fallback", err);
    ratesData = fallbackRates;
    currencyResult.innerText = "Using offline/fallback currency rates.";
  }

  populateDropdowns();
  populateRatesTable();
}

// =========== Populate Converter Dropdown ===========
function populateDropdowns() {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");

  from.innerHTML = "";
  to.innerHTML = "";

  Object.keys(currencyList).sort().forEach(code => {
    from.add(new Option(currencyList[code], code));
    to.add(new Option(currencyList[code], code));
  });

  from.value = "MYR";
  to.value = "USD";
}

// =========== Convert Button ===========
document.getElementById("convertBtn").onclick = () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  if (!amount || amount <= 0) {
    document.getElementById("currencyResult").innerText = "Enter valid amount.";
    return;
  }

  if (!ratesData[from] || !ratesData[to]) {
    document.getElementById("currencyResult").innerText = "Rate unavailable.";
    return;
  }

  const result = amount * (ratesData[to] / ratesData[from]);

  document.getElementById("currencyResult").innerText =
    `${amount} ${from} = ${result.toFixed(4)} ${to}`;
};

// =========== Populate Money Changer Table (TOP 50) ===========
function populateRatesTable() {
  const tbody = document.getElementById("ratesBody");
  tbody.innerHTML = "";

  top50Currencies.forEach(code => {
    if (!ratesData[code]) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${code}</td>
      <td>${ratesData[code].toFixed(4)}</td>
    `;
    tbody.appendChild(row);
  });
}

// ================= UNIT =================
const unitOptions = {
  length: ["m", "cm", "mm", "km", "in", "ft"],
  weight: ["kg", "g", "lb", "oz"],
  temperature: ["°C", "°F", "K"],
  speed: ["km/h", "m/s", "mph", "knot"]
};

function populateUnitDropdowns() {
  const cat = document.getElementById("unit-category").value;
  const fromSel = document.getElementById("unit-from");
  const toSel = document.getElementById("unit-to");

  fromSel.innerHTML = "";
  toSel.innerHTML = "";

  unitOptions[cat].forEach(u => fromSel.add(new Option(u, u)));
  unitOptions[cat].forEach(u => toSel.add(new Option(u, u)));

  toSel.value = unitOptions[cat][1] || unitOptions[cat][0];
}

// UNIT Conversion Logic…
function convertUnit() {
  const val = parseFloat(document.getElementById("unit-value").value);
  const from = document.getElementById("unit-from").value;
  const to = document.getElementById("unit-to").value;
  const cat = document.getElementById("unit-category").value;
  const resultElem = document.getElementById("unit-result");

  if (!val) {
    resultElem.innerText = "Enter a value.";
    return;
  }

  let base = val, result;

  try {
    if (cat === 'length') {
      const map = { cm: 0.01, mm: 0.001, km: 1000, in: 0.0254, ft: 0.3048, m: 1 };
      base = val * map[from];
      result = base / map[to];
    }

    else if (cat === 'weight') {
      const map = { g: 0.001, oz: 0.0283495, lb: 0.453592, kg: 1 };
      base = val * map[from];
      result = base / map[to];
    }

    else if (cat === 'temperature') {
      if (from === "°F") base = (val - 32) * 5/9;
      else if (from === "K") base = val - 273.15;
      
      if (to === "°F") result = base * 9/5 + 32;
      else if (to === "K") result = base + 273.15;
      else result = base;
    }

    else if (cat === 'speed') {
      const map = { "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444, "m/s": 1 };
      base = val * map[from];
      result = base / map[to];
    }

    resultElem.innerText = `${val} ${from} = ${result.toFixed(4)} ${to}`;

  } catch {
    resultElem.innerText = "Conversion error.";
  }
}

// ================= PASSWORD =================
function generatePassword() {
  const length = parseInt(document.getElementById("password-length").value) || 12;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  document.getElementById("password-result").innerText =
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ================= QR =================
function generateQR() {
  const val = document.getElementById("qr-input").value;
  if (!val) return document.getElementById("qr-result").innerHTML = "Enter text.";
  document.getElementById("qr-result").innerHTML =
    `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(val)}">`;
}

// ================= AGE =================
function calculateAge() {
  const dob = new Date(document.getElementById("birthdate").value);
  if (!dob) return;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;

  document.getElementById("age-result").innerText = `${age} years old`;
}

// ================= IMAGE RESIZER =================
function fileToDataUri(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

async function resizeAndDisplayImage() {
  const fileInput = document.getElementById("image-upload");
  const widthInput = document.getElementById("resize-width");
  const heightInput = document.getElementById("resize-height");
  const resultDiv = document.getElementById("image-result-display");
  const resultText = document.getElementById("image-result-text");

  const file = fileInput.files[0];
  const w = parseInt(widthInput.value);
  const h = parseInt(heightInput.value);

  if (!file || !w || !h) {
    resultText.innerText = "Provide file and size.";
    return;
  }

  const img = new Image();
  img.src = await fileToDataUri(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    const url = canvas.toDataURL("image/jpeg", 0.92);
    resultDiv.innerHTML = `<img src="${url}" style="max-width:100%;margin-top:10px;">`;
    resultText.innerText = `Resized to ${w} × ${h}px`;

    const link = document.createElement("a");
    link.href = url;
    link.download = "resized.jpeg";
    link.innerText = "Download";
    link.className = "download-link-btn";
    resultDiv.appendChild(link);
  };
};

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  fetchCurrencyRates();
  populateUnitDropdowns();
});
