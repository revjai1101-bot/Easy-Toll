/* SPA HASH ROUTING */
function showTool(id){
  document.querySelectorAll(".tool-panel").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
  window.location.hash = id;
}
function goBack(){ history.back(); }
window.addEventListener("hashchange",()=>{
  const id = window.location.hash.replace("#","");
  document.querySelectorAll(".tool-panel").forEach(p=>p.style.display="none");
  if(id) document.getElementById(id).style.display="block";
});

/*** SEARCH FILTER ***/
document.getElementById("tool-search").addEventListener("input",()=>{
  const q=this.value.toLowerCase();
  document.querySelectorAll(".tool-card").forEach(c=>c.style.display=c.innerText.toLowerCase().includes(q)?"block":"none");
});

/******************************************************
 CURRENCY CONVERTER - OFFLINE STATIC RATE MULTIPLIER
******************************************************/
const topCurrencies=["USD","EUR","GBP","JPY","AUD","CAD","SGD","CHF","THB","IDR","CNY","HKD","NZD","SAR","AED","INR","KRW","PHP","VND","BDT","PKR","MMK","BRL","ZAR","SEK","NOK","DKK","PLN","TRY","HUF","EGP","QAR","KWD","BHD","OMR","LKR","NPR","KES","RUB","MXN","ARS","NGN","COP","CLP","CZK","RON","ILS","MAD","MYR"];
const fromCurrency=document.getElementById("fromCurrency");
const toCurrency=document.getElementById("toCurrency");
let favFrom=JSON.parse(localStorage.getItem("fav_from"))||[];
let favTo=JSON.parse(localStorage.getItem("fav_to"))||[];

function buildOptions(){
  function doFav(f,target){
    target.innerHTML="";
    f.forEach(x=>target.innerHTML+=`<option value="${x}">⭐ ${x}</option>`);
    topCurrencies.forEach(x=>{if(!f.includes(x)) target.innerHTML+=`<option value="${x}">${x}</option>`;});
  }
  doFav(favFrom,fromCurrency);
  doFav(favTo,toCurrency);
}
buildOptions();

document.getElementById("favFromBtn").onclick=()=>{
  const c=fromCurrency.value;
  favFrom = favFrom.includes(c)?favFrom.filter(x=>x!==c):[...favFrom,c];
  localStorage.setItem("fav_from",JSON.stringify(favFrom));
  buildOptions();
};
document.getElementById("favToBtn").onclick=()=>{
  const c=toCurrency.value;
  favTo = favTo.includes(c)?favTo.filter(x=>x!==c):[...favTo,c];
  localStorage.setItem("fav_to",JSON.stringify(favTo));
  buildOptions();
};

document.getElementById("convertBtn").onclick=()=>{
  const amt=parseFloat(document.getElementById("amount").value);
  if(isNaN(amt))return currencyResult.innerText="Enter number";
  const iA=topCurrencies.indexOf(fromCurrency.value)+1;
  const iB=topCurrencies.indexOf(toCurrency.value)+1;
  const rate=iB/iA;
  currencyResult.innerText=`${amt} ${fromCurrency.value} ≈ ${(amt*rate).toFixed(2)} ${toCurrency.value}`;
};

/******************************************************
 UNIT CONVERTER — FULL WORKING
******************************************************/
const unitCategory=document.getElementById("unit-category");
const unitFrom=document.getElementById("unit-from");
const unitTo=document.getElementById("unit-to");
const units={
  length:{m:1,cm:100,mm:1000,km:0.001,inch:39.37,ft:3.28},
  weight:{kg:1,g:1000,mg:1000000,lb:2.2,oz:35.27},
  temperature:"special",
  speed:{"m/s":1,"km/h":3.6,mph:2.23}
};
function loadUnits(){
  const cat=unitCategory.value;
  unitFrom.innerHTML=unitTo.innerHTML="";
  if(cat==="temperature"){
    ["Celsius","Fahrenheit","Kelvin"].forEach(u=>{
      unitFrom.innerHTML+=`<option>${u}</option>`;
      unitTo.innerHTML+=`<option>${u}</option>`;
    });
  }else{
    Object.keys(units[cat]).forEach(u=>{
      unitFrom.innerHTML+=`<option value="${u}">${u}</option>`;
      unitTo.innerHTML+=`<option value="${u}">${u}</option>`;
    });
  }
}
unitCategory.onchange=loadUnits;
loadUnits();

function convertUnit(){
  const val=parseFloat(document.getElementById("unit-value").value);
  if(isNaN(val)) return unitResult.innerText="Enter number";
  const from=unitFrom.value,to=unitTo.value,cat=unitCategory.value;
  if(cat==="temperature"){
    let k=(from==="Celsius")?val+273.15:(from==="Fahrenheit")?((val-32)*5/9+273.15):val;
    let fin=(to==="Celsius")?k-273.15:(to==="Fahrenheit")?((k-273.15)*9/5+32):k;
    return unitResult.innerText=`${val} ${from} = ${fin.toFixed(2)} ${to}`;
  }
  const base=val/units[cat][from];
  const res=base*units[cat][to];
  unitResult.innerText=`${val} ${from} = ${res.toFixed(4)} ${to}`;
}

/******************************************************
 QR GENERATOR + DOWNLOAD
******************************************************/
function generateQR(){
  const txt=document.getElementById("qr-input").value;
  document.getElementById("qr-result").innerHTML=`<img id="qrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(txt)}">`;
  document.getElementById("qr-download").style.display="block";
}
document.getElementById("qr-download").onclick=()=>{
  const link=document.createElement("a");
  link.download="qrcode.png";
  link.href=document.getElementById("qrImg").src;
  link.click();
};

/******************************************************
 IMAGE RESIZER + DOWNLOAD
******************************************************/
function resizeAndDisplayImage(){
  const file=document.getElementById("image-upload").files[0];
  if(!file) return alert("Upload first");
  const w=+document.getElementById("resize-width").value;
  const h=+document.getElementById("resize-height").value;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      canvas.getContext("2d").drawImage(img,0,0,w,h);
      const url=canvas.toDataURL("image/png");
      document.getElementById("image-result-display").innerHTML=`<img id="resizedImg" src="${url}">`;
      document.getElementById("image-result-text").innerText="Resized successfully!";
      document.getElementById("img-download").style.display="block";
    }
    img.src=e.target.result;
  }
  reader.readAsDataURL(file);
}
document.getElementById("img-download").onclick=()=>{
  const link=document.createElement("a");
  link.download="resized.png";
  link.href=document.getElementById("resizedImg").src;
  link.click();
};
