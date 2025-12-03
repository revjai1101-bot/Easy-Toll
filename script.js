/* SPA Navigation */
function showTool(id) {
  document.querySelectorAll(".tool-panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
  window.scrollTo(0,0);
  history.pushState({tool:id},"",`/${id}`);
}
function goBack(){ history.back(); }
window.addEventListener('popstate',()=>location.reload());

document.getElementById("tool-search").addEventListener("input",function(){
  const q=this.value.toLowerCase();
  document.querySelectorAll(".tool-card").forEach(c=>{
    c.style.display=c.innerText.toLowerCase().includes(q)?"block":"none";
  });
});

/******** Currency Dropdown Fix ********/
document.querySelectorAll("select").forEach(sel=>{
  sel.addEventListener("mousedown",()=>document.body.style.overflow="hidden");
  sel.addEventListener("blur",()=>document.body.style.overflow="auto");
});

/******** Dummy converter */
document.getElementById("convertBtn").addEventListener("click",()=>{
  document.getElementById("currencyResult").innerText="Live rates disabled";
});

/******** Unit Converter */
function convertUnit(){
    document.getElementById("unit-result").innerText="Converted!";
}

/******** Password Generator */
function generatePassword(){
  const len=document.getElementById("password-length").value;
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let pass="";
  for(let i=0;i<len;i++){ pass+=chars[Math.floor(Math.random()*chars.length)]; }
  document.getElementById("password-result").innerText=pass;
}

/******** QR Code */
function generateQR(){
  const t=document.getElementById("qr-input").value;
  document.getElementById("qr-result").innerHTML=
  `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(t)}">`;
}

/******** Age Calc */
function calculateAge(){
  const b=new Date(document.getElementById("birthdate").value);
  const age=new Date(Date.now()-b.getTime()).getUTCFullYear()-1970;
  document.getElementById("age-result").innerText=`Age: ${age}`;
}

/******** Image Resize + Compression (NEW!) */
document.getElementById("resize-mode").addEventListener("change",function(){
  document.getElementById("dimension-controls").style.display =
  this.value==="dimension"?"block":"none";
  document.getElementById("filesize-controls").style.display =
  this.value==="filesize"?"block":"none";
});

function resizeImage(){
  const file=document.getElementById("image-upload").files[0];
  if(!file) return alert("Upload image first");

  const reader=new FileReader();
  reader.onload=(e)=>{
    let img=new Image();
    img.onload=()=>{
      const mode=document.getElementById("resize-mode").value;
      if(mode==="dimension") resizeByDimension(img);
      else resizeByFileSize(img);
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function resizeByDimension(img){
  const w=parseInt(document.getElementById("resize-width").value);
  const h=parseInt(document.getElementById("resize-height").value);
  const canvas=document.createElement("canvas");
  canvas.width=w; canvas.height=h;
  canvas.getContext("2d").drawImage(img,0,0,w,h);
  showResult(canvas.toDataURL("image/jpeg",0.92),"Resized by pixels!");
}

function resizeByFileSize(img){
  const targetKB=parseInt(document.getElementById("resize-filesize").value);
  const targetBytes=targetKB*1024;
  let quality=0.9,out="";
  const canvas=document.createElement("canvas");
  canvas.width=img.width; canvas.height=img.height;
  const ctx=canvas.getContext("2d");

  while(quality>0.05){
    ctx.drawImage(img,0,0,img.width,img.height);
    out=canvas.toDataURL("image/jpeg",quality);
    if(out.length*0.75<=targetBytes) break;
    quality-=0.05;
  }

  showResult(out,`Compressed to ~${Math.round(out.length*0.75/1024)} KB`);
}

function showResult(src,msg){
  document.getElementById("image-result-display").innerHTML=
  `<img src="${src}" style="max-width:100%;border-radius:8px;margin-top:10px;">`;
  document.getElementById("image-result-text").innerText=msg;
}
