// SPA Navigation
function showTool(id) {
  document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
  window.scrollTo(0,0);
  history.pushState({tool:id},"",`/${id}`);
}

function goBack(){
  history.back();
}

window.addEventListener('popstate',()=>{
  document.querySelectorAll(".tool-panel").forEach(p=>p.style.display="none");
  history.replaceState({tool:null},"","/");
});

// Search filter
document.getElementById("tool-search").addEventListener("input",function(){
  const q=this.value.toLowerCase();
  document.querySelectorAll(".tool-card").forEach(c=>{
    c.style.display=c.innerText.toLowerCase().includes(q)?"block":"none";
  });
});

// Currency placeholder
document.getElementById("convertBtn").addEventListener("click",()=>{
  document.getElementById("currencyResult").innerText="Live rates disabled";
});

// Unit Convert
function convertUnit(){
  document.getElementById("unit-result").innerText="Converted!";
}

// Password Generator
function generatePassword(){
  const len=document.getElementById("password-length").value;
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let p="";
  for(let i=0;i<len;i++){ p+=chars[Math.floor(Math.random()*chars.length)]; }
  document.getElementById("password-result").innerText=p;
}

// QR Code
function generateQR(){
  const t=document.getElementById("qr-input").value;
  document.getElementById("qr-result").innerHTML=
  `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(t)}">`;
}

// Age Calculator
function calculateAge(){
  const b=new Date(document.getElementById("birthdate").value);
  const age=new Date(Date.now()-b).getUTCFullYear()-1970;
  document.getElementById("age-result").innerText=`Age: ${age}`;
}

// Image Resize by px
function resizeAndDisplayImage(){
  const file=document.getElementById("image-upload").files[0];
  if(!file) return alert("Upload image first");

  const w=parseInt(document.getElementById("resize-width").value);
  const h=parseInt(document.getElementById("resize-height").value);

  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);
      document.getElementById("image-result-display").innerHTML=
      `<img src="${canvas.toDataURL("image/jpeg")}" style="max-width:100%;">`;
      document.getElementById("image-result-text").innerText="Resized successfully!";
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ==== Dropdown Scroll Fix ==== */
document.querySelectorAll("select").forEach(sel => {
  sel.addEventListener("mousedown", () => {
    document.body.style.overflow = "hidden";
  });
  sel.addEventListener("blur", () => {
    document.body.style.overflow = "";
  });
  sel.addEventListener("change", () => {
    document.body.style.overflow = "";
  });
});
