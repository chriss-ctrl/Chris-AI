const $=id=>document.getElementById(id), box=$("transcript");
function count(){let n=box.value.trim()?box.value.trim().split(/\\s+/).length:0;$("wordCount").textContent=n+" words"}box.addEventListener("input",count);
function mode(live){$("livePanel").classList.toggle("hidden",!live);$("uploadPanel").classList.toggle("hidden",live);$("liveTab").classList.toggle("active",live);$("uploadTab").classList.toggle("active",!live)}
$("liveTab").onclick=()=>mode(true);$("uploadTab").onclick=()=>mode(false);
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null,base="";
if(!SR){$("startBtn").disabled=true;$("liveStatus").textContent="Live recognition is not supported in this browser. Try current Chrome."}
else{rec=new SR();rec.continuous=true;rec.interimResults=true;
rec.onstart=()=>{base=box.value.trim();if(base)base+=" ";$("startBtn").disabled=true;$("stopBtn").disabled=false;$("liveStatus").textContent="Listening…"};
// Rebuild the session from all current results instead of repeatedly appending interim text.
rec.onresult=e=>{let f="",t="";for(let i=0;i<e.results.length;i++){let r=e.results[i];if(r.isFinal)f+=r[0].transcript+" ";else t+=r[0].transcript}box.value=base+f+t;count()};
rec.onerror=e=>$("liveStatus").textContent="Recognition issue: "+e.error;
rec.onend=()=>{$("startBtn").disabled=false;$("stopBtn").disabled=true;$("liveStatus").textContent="Recording stopped.";count()};
$("startBtn").onclick=()=>{rec.lang=$("liveLanguage").value;try{rec.start()}catch(e){$("liveStatus").textContent="Wait a moment and try again."}};
$("stopBtn").onclick=()=>rec.stop()}
let file=null;$("audioFile").onchange=e=>{file=e.target.files[0]||null;$("fileName").textContent=file?file.name+" · "+(file.size/1048576).toFixed(1)+" MB":"No file selected";$("transcribeBtn").disabled=!file};
$("transcribeBtn").onclick=async()=>{if(!file)return;if(file.size>25*1048576){$("uploadStatus").textContent="File exceeds 25 MB.";return}let b=$("transcribeBtn");b.disabled=true;b.textContent="Transcribing…";try{let f=new FormData();f.append("audio",file);let r=await fetch("/api/transcribe",{method:"POST",body:f});let d=await r.json();if(!r.ok)throw Error(d.error||"Transcription failed");box.value+=(box.value.trim()?"\\n\\n":"")+d.text;count();$("uploadStatus").textContent="Transcription complete."}catch(e){$("uploadStatus").textContent=e.message.includes("Failed to fetch")?"Audio backend is not deployed or connected yet.":"Error: "+e.message}finally{b.disabled=false;b.textContent="Transcribe audio"}};
$("copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText(box.value);$("liveStatus").textContent="Copied."}catch(e){box.select()}};
$("downloadBtn").onclick=()=>{let u=URL.createObjectURL(new Blob([box.value],{type:"text/plain"})),a=document.createElement("a");a.href=u;a.download="chris-ai-transcript.txt";a.click();URL.revokeObjectURL(u)};
$("clearBtn").onclick=()=>{if(rec&&!$("stopBtn").disabled)rec.stop();box.value="";base="";count();$("liveStatus").textContent="Transcript cleared."};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
