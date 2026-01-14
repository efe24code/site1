window.DEVTOOLS={

tools:[
{id:"hash",name:"Hash Generator",cat:"crypto",icon:"🔐"},
{id:"uuid",name:"UUID Generator",cat:"crypto",icon:"🆔"},
{id:"jwt",name:"JWT Decoder",cat:"auth",icon:"🪪"},
{id:"pass",name:"Password Strength",cat:"crypto",icon:"🔑"},
{id:"base64",name:"Base64 Encode/Decode",cat:"data",icon:"📦"},
{id:"json",name:"JSON Formatter",cat:"data",icon:"{ }"},
{id:"csvjson",name:"CSV → JSON",cat:"data",icon:"📑"},
{id:"ip",name:"IP Lookup",cat:"network",icon:"🌍"},
{id:"ua",name:"User-Agent Parser",cat:"network",icon:"📱"},
{id:"wordcount",name:"Word Counter",cat:"text",icon:"🔢"},
{id:"caseswitch",name:"Case Switcher",cat:"text",icon:"Aa"},
{id:"slug",name:"Slug Generator",cat:"text",icon:"🔗"},
{id:"lorem",name:"Lorem Ipsum",cat:"text",icon:"📝"},
{id:"cssmin",name:"CSS Minifier",cat:"dev",icon:"🎨"},
{id:"htmlentities",name:"HTML Entities",cat:"dev",icon:"</>"},
{id:"regex",name:"Regex Tester",cat:"dev",icon:"🧪"},
{id:"pxrem",name:"PX → REM Converter",cat:"dev",icon:"📏"},
{id:"qr",name:"QR Code Generator",cat:"dev",icon:"🔳"}
],

logic:{

hash:{
name:"Hash Generator",
ui:`<textarea id="inp" rows="3" placeholder="Text"></textarea>
<select id="algo"><option>SHA-256</option><option>SHA-1</option></select>
<input id="out" readonly class="mt-2">`,
run:async()=>{
  const b=new TextEncoder().encode(inp.value)
  const h=await crypto.subtle.digest(algo.value,b)
  out.value=[...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("")
},
docs:`JavaScript:\ncrypto.subtle.digest("SHA-256", data)\n\nPython:\nimport hashlib\nhashlib.sha256(b"text").hexdigest()\n\nBash:\necho -n "text" | sha256sum\n\nPHP:\nhash("sha256","text")`
},

uuid:{
name:"UUID Generator",
ui:`<input id="out" readonly>`,
run:()=>out.value=crypto.randomUUID(),
docs:`JavaScript:\ncrypto.randomUUID()\n\nPython:\nimport uuid\nuuid.uuid4()\n\nPHP:\n// Use ramsey/uuid package`
},

jwt:{
name:"JWT Decoder",
ui:`<textarea id="inp" rows="3"></textarea><pre id="out"></pre>`,
run:()=>{
try{out.textContent=JSON.stringify(JSON.parse(atob(inp.value.split(".")[1])),null,2)}
catch{out.textContent="Invalid JWT"}
},
docs:`JavaScript:\nJSON.parse(atob(token.split(".")[1]))\n\nPython:\nimport jwt\njwt.decode(token, options={"verify_signature":False})\n\nNode:\njwt-decode(token)`
},

pass:{
name:"Password Strength",
ui:`<input id="inp" placeholder="Enter password"><div id="out" class="mt-2"></div>`,
run:()=>{
let p=inp.value,s=0
if(p.length>7)s++
if(/[A-Z]/.test(p))s++
if(/[0-9]/.test(p))s++
if(/[^A-Za-z0-9]/.test(p))s++
out.textContent=["Very Weak","Weak","OK","Strong","Very Strong"][s]
},
docs:`Check strength of a password:\nJavaScript, Python, etc.`
},

base64:{
name:"Base64 Encode/Decode",
ui:`<textarea id="inp" rows="3"></textarea><textarea id="out" rows="3" readonly></textarea>`,
run:()=>{try{out.value=btoa(inp.value)}catch{out.value="Error"}},
docs:`JavaScript:\nbtoa('text')\natob('dGV4dA==')\nPython: base64.b64encode(b"text")\nPHP: base64_encode('text');`
},

json:{
name:"JSON Formatter",
ui:`<textarea id="inp" rows="6"></textarea>`,
run:()=>{try{inp.value=JSON.stringify(JSON.parse(inp.value),null,2)}catch{alert("Invalid JSON")}},
docs:`Beautify JSON:\nJavaScript: JSON.stringify(obj,null,2)\nPython: json.dumps(obj,indent=4)\nPHP: json_encode($obj,JSON_PRETTY_PRINT)`
},

csvjson:{
name:"CSV → JSON",
ui:`<textarea id="inp" rows="6"></textarea><pre id="out"></pre>`,
run:()=>{
const [h,...r]=inp.value.split("\n"),keys=h.split(",")
out.textContent=JSON.stringify(r.map(l=>Object.fromEntries(l.split(",").map((v,i)=>[keys[i],v]))),null,2)
},
docs:`Convert CSV to JSON`
},

ip:{
name:"IP Lookup",
ui:`<input id="inp" placeholder="8.8.8.8 or empty"><pre id="out" class="mt-2 text-xs"></pre>`,
run:async()=>{
const ip=inp.value||""
out.textContent="Loading..."
try{
const r=await fetch("https://ipapi.co/"+ip+"/json/")
out.textContent=JSON.stringify(await r.json(),null,2)
}catch{out.textContent="IP lookup failed"}
},
docs:`JS: fetch('https://ipapi.co/8.8.8.8/json')\nPython: requests.get(...)`
},

ua:{
name:"User-Agent Parser",
ui:`<textarea id="inp"></textarea><pre id="out"></pre>`,
run:()=>out.textContent=/mobile/i.test(inp.value)?"Mobile":/chrome/i.test(inp.value)?"Chrome":"Unknown",
docs:`Detect user agent type`
},

wordcount:{
name:"Word Counter",
ui:`<textarea id="inp" rows="4"></textarea><div id="out"></div>`,
run:()=>{const t=inp.value; out.textContent=`Words: ${t.trim()?t.trim().split(/\s+/).length:0} | Chars: ${t.length}`},
docs:`Count words and characters`
},

caseswitch:{
name:"Case Switcher",
ui:`<textarea id="inp" rows="4"></textarea>`,
run:()=>inp.value=[...inp.value].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join(""),
docs:`Switch uppercase/lowercase`
},

slug:{
name:"Slug Generator",
ui:`<input id="inp"><input id="out" readonly>`,
run:()=>out.value=inp.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),
docs:`Convert string to slug`
},

lorem:{
name:"Lorem Ipsum Generator",
ui:`<input id="inp" placeholder="Number of paragraphs"><div id="out" class="mt-2"></div>`,
run:()=>{
const n=parseInt(inp.value)||1
const text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20)
out.textContent=Array(n).fill(text).join("\n\n")
},
docs:`Generate Lorem Ipsum`
},

cssmin:{
name:"CSS Minifier",
ui:`<textarea id="inp" rows="6"></textarea><textarea id="out" rows="6" readonly></textarea>`,
run:()=>out.value=inp.value.replace(/\s+/g," ").replace(/ ?([:;{}]) ?/g,"$1"),
docs:`Minify CSS`
},

htmlentities:{
name:"HTML Entities",
ui:`<textarea id="inp" rows="4"></textarea><textarea id="out" rows="4" readonly></textarea>`,
run:()=>{out.value=inp.value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},
docs:`Convert HTML special characters`
},

regex:{
name:"Regex Tester",
ui:`<input id="pattern" placeholder="Pattern"><textarea id="inp" rows="4"></textarea><pre id="out"></pre>`,
run:()=>{try{out.textContent=inp.value.match(new RegExp(pattern.value,"g"))?.join("\n")||"No match"}catch{out.textContent="Invalid regex"}},
docs:`Test regex patterns`
},

pxrem:{
name:"PX → REM Converter",
ui:`<input id="inp" placeholder="PX"><input id="out" readonly>`,
run:()=>out.value=(parseFloat(inp.value)/16).toFixed(2)+"rem",
docs:`Convert PX to REM`
},

qr:{
name:"QR Code Generator",
ui:`<input id="inp" placeholder="Text or URL"><div class="mt-2"><img id="out"></div>`,
run:()=>{out.src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+encodeURIComponent(inp.value)},
docs:`Generate QR code using qrserver.com API`
}

}
}
