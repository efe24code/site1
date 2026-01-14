window.DEVTOOLS = {
tools:[
{id:"hash",name:"Hash Generator",cat:"crypto",icon:"🔐"},
{id:"uuid",name:"UUID Generator",cat:"crypto",icon:"🆔"},
{id:"jwt",name:"JWT Decoder",cat:"auth",icon:"🪪"},
{id:"pass",name:"Password Strength",cat:"crypto",icon:"🔑"},
{id:"base64",name:"Base64 Encode/Decode",cat:"data",icon:"📦"}
],

logic:{
/* --- HASH GENERATOR --- */
hash:{
name:"Hash Generator",
ui:`
<textarea id="inp" rows="3" placeholder="Text to hash"></textarea>
<select id="algo"><option value="SHA-256">SHA-256</option><option value="SHA-1">SHA-1</option></select>
<input id="out" readonly class="mt-2">`,
run: async()=>{
  const text=document.getElementById("inp").value
  const algo=document.getElementById("algo").value
  if(!text){document.getElementById("out").value="No input"; return;}
  const encoder=new TextEncoder()
  const data=encoder.encode(text)
  try{
    const hash=await crypto.subtle.digest(algo,data)
    const hex=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")
    document.getElementById("out").value=hex
  }catch(e){document.getElementById("out").value="Error"}
},
code:{
js:`crypto.subtle.digest("SHA-256", data)`,
py:`import hashlib\nhashlib.sha256(b"text").hexdigest()`,
php:`hash("sha256","text")`,
bash:`echo -n "text" | sha256sum`
},
docs:`Generate SHA-256 or SHA-1 hash in multiple languages`
},

/* --- UUID GENERATOR --- */
uuid:{
name:"UUID Generator",
ui:`<input id="out" readonly>`,
run:()=>document.getElementById("out").value=crypto.randomUUID(),
code:{js:`crypto.randomUUID()`,py:`import uuid\nuuid.uuid4()`,php:`// Use ramsey/uuid`,bash:`uuidgen`},
docs:`Generate UUID v4`
},

/* --- JWT DECODER --- */
jwt:{
name:"JWT Decoder",
ui:`<textarea id="inp" rows="3" placeholder="JWT Token"></textarea><pre id="out"></pre>`,
run:()=>{
  try{
    const payload=JSON.parse(atob(document.getElementById("inp").value.split(".")[1]))
    document.getElementById("out").textContent=JSON.stringify(payload,null,2)
  }catch(e){document.getElementById("out").textContent="Invalid JWT"}
},
code:{
js:`JSON.parse(atob(token.split(".")[1]))`,
py:`import jwt\njwt.decode(token, options={"verify_signature":False})`,
php:`// Use firebase/php-jwt`,
bash:`# Decode payload base64`
},
docs:`Decode JWT without verifying signature`
},

/* --- PASSWORD STRENGTH --- */
pass:{
name:"Password Strength",
ui:`<input id="inp" placeholder="Enter password"><div id="out" class="mt-2"></div>`,
run:()=>{
  const p=document.getElementById("inp").value
  let s=0
  if(p.length>7)s++
  if(/[A-Z]/.test(p))s++
  if(/[0-9]/.test(p))s++
  if(/[^A-Za-z0-9]/.test(p))s++
  document.getElementById("out").textContent=["Very Weak","Weak","OK","Strong","Very Strong"][s]
},
code:{js:`// JS logic`,py:`# Python logic`,php:`// PHP logic`,bash:`# Bash logic`},
docs:`Check password strength`
},

/* --- BASE64 ENCODE / DECODE --- */
base64:{
name:"Base64 Encode/Decode",
ui:`<textarea id="inp" rows="3"></textarea><textarea id="out" rows="3" readonly></textarea>
<div class="flex gap-2 mt-2">
<button class="btn" onclick="DEVTOOLS.logic['base64'].run('encode')">Encode</button>
<button class="btn" onclick="DEVTOOLS.logic['base64'].run('decode')">Decode</button>
</div>`,
run:(mode)=>{
  try{
    const input=document.getElementById("inp").value
    const output=mode==="encode"?btoa(input):atob(input)
    document.getElementById("out").value=output
  }catch(e){document.getElementById("out").value="Error"}
},
code:{
js:`btoa('text') // Encode\natob('dGV4dA==') // Decode`,
py:`import base64\nbase64.b64encode(b"text")`,
php:`base64_encode('text')`,
bash:`echo -n "text" | base64`
},
docs:`Encode or decode Base64 text in JS/Python/PHP/Bash`
}

} // logic sonu
} // DEVTOOLS sonu
/* --- Bölüm 2: Data & Converter Tools --- */

DEVTOOLS.tools.push(
  {id:"json",name:"JSON Formatter",cat:"data",icon:"{ }"},
  {id:"csvjson",name:"CSV → JSON",cat:"data",icon:"📑"},
  {id:"pxrem",name:"PX → REM Converter",cat:"dev",icon:"📏"},
  {id:"cssmin",name:"CSS Minifier",cat:"dev",icon:"🎨"}
);

DEVTOOLS.logic.json={
name:"JSON Formatter",
ui:`<textarea id="inp" rows="6" placeholder='{"ugly":"json"}'></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['json'].run()">Beautify JSON</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  try{
    const val=document.getElementById("inp").value
    const beautified=JSON.stringify(JSON.parse(val),null,2)
    document.getElementById("out").value=beautified
  }catch(e){
    document.getElementById("out").value="Invalid JSON"
  }
},
code:{
js:`JSON.stringify(obj,null,2)`,
py:`import json\njson.dumps(obj,indent=4)`,
php:`json_encode($obj,JSON_PRETTY_PRINT)`,
bash:`# jq '.' file.json`
},
docs:`Beautify or pretty-print JSON data in JS/Python/PHP/Bash`
};

DEVTOOLS.logic.csvjson={
name:"CSV → JSON",
ui:`<textarea id="inp" rows="6" placeholder="CSV data"></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['csvjson'].run()">Convert CSV → JSON</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  try{
    const csv=document.getElementById("inp").value.trim()
    const lines=csv.split("\n")
    const headers=lines[0].split(",")
    const arr=lines.slice(1).map(l=>{
      const vals=l.split(",")
      const obj={}
      headers.forEach((h,i)=>obj[h.trim()]=vals[i].trim())
      return obj
    })
    document.getElementById("out").value=JSON.stringify(arr,null,2)
  }catch(e){document.getElementById("out").value="Error parsing CSV"}
},
code:{
js:`// Convert CSV string to JSON array\n/* See run() logic */`,
py:`import csv,json\n# Use csv.DictReader`,
php:`// Parse CSV and json_encode`,
bash:`# csvtool or custom awk script`
},
docs:`Convert CSV data to JSON in multiple languages`
};

DEVTOOLS.logic.pxrem={
name:"PX → REM Converter",
ui:`<input id="inp" placeholder="PX value, e.g. 16">
<input id="out" readonly class="mt-2">`,
run:()=>{
  const px=parseFloat(document.getElementById("inp").value)
  if(isNaN(px)){document.getElementById("out").value="Invalid"; return}
  const rem=(px/16).toFixed(3)
  document.getElementById("out").value=rem+"rem"
},
code:{
js:`(px/16)+'rem'`,
py:`px/16`,
php:`$px/16 . 'rem'`,
bash:`echo "$px/16 rem"`
},
docs:`Convert PX to REM assuming base font-size 16px`
};

DEVTOOLS.logic.cssmin={
name:"CSS Minifier",
ui:`<textarea id="inp" rows="6" placeholder="Paste CSS"></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['cssmin'].run()">Minify CSS</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  try{
    let css=document.getElementById("inp").value
    css=css.replace(/\s+/g,' ').replace(/\/\*[\s\S]*?\*\//g,'').replace(/ ?([:;{}]) ?/g,'$1').trim()
    document.getElementById("out").value=css
  }catch(e){document.getElementById("out").value="Error"}
},
code:{
js:`css.replace(/\\s+/g,' ').replace(/\/\*.*?\*\//g,'').trim()`,
py:`# Use regex sub to minify`,
php:`// preg_replace to minify`,
bash:`# sed/awk to remove spaces and comments`
},
docs:`Minify CSS code by removing spaces/comments`
};
/* --- Bölüm 3: Network Tools --- */

DEVTOOLS.tools.push(
  {id:"ip",name:"IP Tracker",cat:"network",icon:"📡"},
  {id:"whois",name:"Whois Lookup",cat:"network",icon:"🌐"},
  {id:"dns",name:"DNS Lookup",cat:"network",icon:"📓"},
  {id:"port",name:"Port Check",cat:"network",icon:"🔌"},
  {id:"ua",name:"User-Agent Parser",cat:"network",icon:"📱"}
);

DEVTOOLS.logic.ip={
name:"IP Tracker",
ui:`<input id="inp" placeholder="IP Address (leave empty = your IP)">
<button class="btn mt-2" onclick="DEVTOOLS.logic['ip'].run()">Track IP</button>
<pre id="out" class="mt-2"></pre>`,
run:async()=>{
  const ip=document.getElementById("inp").value||""
  const outEl=document.getElementById("out")
  outEl.textContent="Loading..."
  try{
    const res=await fetch(`https://ipapi.co/${ip}/json/`)
    const data=await res.json()
    outEl.textContent=
`IP: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country_name}
ISP: ${data.org}
ASN: ${data.asn}`
  }catch(e){outEl.textContent="Error fetching IP"}
},
code:{
js:`fetch('https://ipapi.co/json/').then(r=>r.json())`,
py:`import requests\nrequests.get('https://ipapi.co/json/')`,
php:`file_get_contents('https://ipapi.co/json/')`,
bash:`curl https://ipapi.co/json/`
},
docs:`Lookup IP details (geolocation, ISP, ASN)`
};

DEVTOOLS.logic.whois={
name:"Whois Lookup",
ui:`<input id="inp" placeholder="example.com">
<button class="btn mt-2" onclick="DEVTOOLS.logic['whois'].run()">Lookup</button>
<pre id="out" class="mt-2"></pre>`,
run:async()=>{
  const domain=document.getElementById("inp").value
  const outEl=document.getElementById("out")
  outEl.textContent="Querying..."
  try{
    const res=await fetch(`https://rdap.org/domain/${domain}`)
    const data=await res.json()
    outEl.textContent=JSON.stringify(data,null,2)
  }catch(e){outEl.textContent="Domain not found"}
},
code:{
js:`fetch('https://rdap.org/domain/google.com').then(r=>r.json())`,
py:`import whois\nwhois.whois('google.com')`,
php:`shell_exec('whois google.com')`,
bash:`whois google.com`
},
docs:`Query domain info using RDAP/Whois`
};

DEVTOOLS.logic.dns={
name:"DNS Lookup",
ui:`<input id="inp" placeholder="example.com">
<button class="btn mt-2" onclick="DEVTOOLS.logic['dns'].run()">Lookup DNS</button>
<pre id="out" class="mt-2"></pre>`,
run:async()=>{
  const domain=document.getElementById("inp").value
  const outEl=document.getElementById("out")
  outEl.textContent="Fetching DNS..."
  try{
    const res=await fetch(`https://dns.google/resolve?name=${domain}`)
    const data=await res.json()
    outEl.textContent=JSON.stringify(data.Answer || data, null,2)
  }catch(e){outEl.textContent="Error fetching DNS"}
},
code:{
js:`fetch('https://dns.google/resolve?name=example.com')`,
py:`import dns.resolver\nanswers=dns.resolver.resolve('example.com','A')`,
php:`// Use dns_get_record('example.com')`,
bash:`dig example.com`
},
docs:`Resolve DNS records`
};

DEVTOOLS.logic.port={
name:"Port Check",
ui:`<input id="host" placeholder="Host (example.com)">
<input id="port" placeholder="Port (80)">
<button class="btn mt-2" onclick="DEVTOOLS.logic['port'].run()">Check Port</button>
<pre id="out" class="mt-2"></pre>`,
run:async()=>{
  const host=document.getElementById("host").value
  const port=parseInt(document.getElementById("port").value)
  const outEl=document.getElementById("out")
  outEl.textContent="Checking..."
  try{
    const res=await fetch(`https://api.portcheckapi.com/check?host=${host}&port=${port}`)
    const data=await res.json()
    outEl.textContent=data.open?"Open":"Closed"
  }catch(e){outEl.textContent="Error"}
},
code:{
js:`// Fetch API to port check (needs service)`,
py:`# Use socket library`,
php:`// Use fsockopen`,
bash:`nc -zv example.com 80`
},
docs:`Check if TCP port is open`
};

DEVTOOLS.logic.ua={
name:"User-Agent Parser",
ui:`<textarea id="inp" rows="3" placeholder="Paste User-Agent"></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['ua'].run()">Parse UA</button>
<pre id="out" class="mt-2"></pre>`,
run:async()=>{
  const ua=document.getElementById("inp").value
  const outEl=document.getElementById("out")
  outEl.textContent="Parsing..."
  try{
    const res=await fetch(`https://api.userstack.com/detect?access_key=demo&ua=${encodeURIComponent(ua)}`)
    const data=await res.json()
    outEl.textContent=JSON.stringify(data,null,2)
  }catch(e){outEl.textContent="Error parsing UA"}
},
code:{
js:`fetch('https://api.userstack.com/...')`,
py:`# requests to user agent API`,
php:`// Use curl`,
bash:`# Use curl to UA API`
},
docs:`Parse User-Agent string to detect browser/device`
};
/* --- Bölüm 4: Text Tools --- */

DEVTOOLS.tools.push(
  {id:"count",name:"Word & Character Count",cat:"text",icon:"🔢"},
  {id:"case",name:"Case Switch",cat:"text",icon:"Aa"},
  {id:"slug",name:"Slug Generator",cat:"text",icon:"📝"},
  {id:"lorem",name:"Lorem Ipsum Generator",cat:"text",icon:"💬"}
);

// WORD & CHARACTER COUNT
DEVTOOLS.logic.count={
name:"Word & Character Count",
ui:`<textarea id="inp" rows="6" placeholder="Type your text..."></textarea>
<div id="out" class="mt-2"></div>`,
run:()=>{
  const t=document.getElementById("inp").value
  const words=t.trim()?t.trim().split(/\s+/).length:0
  const chars=t.length
  document.getElementById("out").textContent=`WORDS: ${words} | CHARACTERS: ${chars}`
},
code:{
js:`text.split(/\s+/).length // words\ntext.length // chars`,
py:`len(text.split()) # words\nlen(text) # chars`,
php:`str_word_count($text) // words\nstrlen($text) // chars`,
bash:`wc -w file.txt # words\nwc -c file.txt # chars`
},
docs:`Count words and characters in text`
};

// CASE SWITCH
DEVTOOLS.logic.case={
name:"Case Switch",
ui:`<textarea id="inp" rows="3" placeholder="Text"></textarea>
<select id="mode">
  <option value="upper">UPPERCASE</option>
  <option value="lower">lowercase</option>
  <option value="capitalize">Capitalize</option>
</select>
<button class="btn mt-2" onclick="DEVTOOLS.logic['case'].run()">Switch Case</button>
<textarea id="out" rows="3" readonly class="mt-2"></textarea>`,
run:()=>{
  const t=document.getElementById("inp").value
  const mode=document.getElementById("mode").value
  let res=""
  if(mode==="upper") res=t.toUpperCase()
  else if(mode==="lower") res=t.toLowerCase()
  else if(mode==="capitalize") res=t.replace(/\b\w/g,c=>c.toUpperCase())
  document.getElementById("out").value=res
},
code:{
js:`text.toUpperCase() | text.toLowerCase() | capitalize logic`,
py:`text.upper() | text.lower() | title()`,
php:`strtoupper($text) | strtolower($text) | ucwords($text)`,
bash:`# tr or awk for case conversion`
},
docs:`Switch text case`
};

// SLUG GENERATOR
DEVTOOLS.logic.slug={
name:"Slug Generator",
ui:`<input id="inp" placeholder="Enter text">
<button class="btn mt-2" onclick="DEVTOOLS.logic['slug'].run()">Generate Slug</button>
<input id="out" readonly class="mt-2">`,
run:()=>{
  const t=document.getElementById("inp").value
  const slug=t.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
  document.getElementById("out").value=slug
},
code:{
js:`text.toLowerCase().replace(/[^a-z0-9]+/g,'-')`,
py:`import re\nre.sub('[^a-z0-9]+','-',text.lower()).strip('-')`,
php:`strtolower($text); preg_replace('/[^a-z0-9]+/','-',$text)`,
bash:`# sed/awk to create slug`
},
docs:`Convert text to URL-friendly slug`
};

// LOREM IPSUM GENERATOR
DEVTOOLS.logic.lorem={
name:"Lorem Ipsum Generator",
ui:`<input id="count" placeholder="Paragraphs" type="number" value="1">
<button class="btn mt-2" onclick="DEVTOOLS.logic['lorem'].run()">Generate</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  const count=parseInt(document.getElementById("count").value)||1
  const para="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
  document.getElementById("out").value=Array(count).fill(para).join("\n\n")
},
code:{
js:`Array(count).fill("Lorem ipsum ...").join("\\n\\n")`,
py:`"Lorem ipsum ...\\n" * count`,
php:`str_repeat("Lorem ipsum ...\\n",count)`,
bash:`# echo "Lorem ipsum" multiple times`
},
docs:`Generate dummy text for testing`
};
/* --- Bölüm 5: Dev Tools --- */

DEVTOOLS.tools.push(
  {id:"qr",name:"QR Code Generator",cat:"dev",icon:"🔳"},
  {id:"regex",name:"Regex Tester",cat:"dev",icon:"🔍"},
  {id:"html",name:"HTML Entities",cat:"dev",icon:"</>"},
  {id:"jsmin",name:"JS Minifier",cat:"dev",icon:"📉"},
  {id:"phpfmt",name:"PHP Formatter",cat:"dev",icon:"🐘"}
);

// QR CODE GENERATOR
DEVTOOLS.logic.qr={
name:"QR Code Generator",
ui:`<input id="inp" placeholder="URL or Text">
<button class="btn mt-2" onclick="DEVTOOLS.logic['qr'].run()">Generate QR</button>
<div class="mt-2 flex justify-center"><img id="outImg" class="rounded border"></div>`,
run:()=>{
  const val=document.getElementById("inp").value
  document.getElementById("outImg").src=`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(val)}`
},
code:{
js:`// Use QR API\nconst url='https://api.qrserver.com/v1/create-qr-code/?data=...'`,
py:`import qrcode\nimg=qrcode.make('data')`,
php:`// Use phpqrcode library`
},
docs:`Generate QR code from text or URL`
};

// REGEX TESTER
DEVTOOLS.logic.regex={
name:"Regex Tester",
ui:`<textarea id="inp" rows="4" placeholder="Text"></textarea>
<input id="pattern" placeholder="Regex Pattern, e.g. \\d+">
<button class="btn mt-2" onclick="DEVTOOLS.logic['regex'].run()">Test Regex</button>
<pre id="out" class="mt-2"></pre>`,
run:()=>{
  try{
    const text=document.getElementById("inp").value
    const pattern=document.getElementById("pattern").value
    const re=new RegExp(pattern,"g")
    const matches=text.match(re)
    document.getElementById("out").textContent=matches?matches.join("\n"):"No match"
  }catch(e){document.getElementById("out").textContent="Invalid regex"}
},
code:{
js:`text.match(new RegExp(pattern,'g'))`,
py:`import re\nre.findall(pattern,text)`,
php:`preg_match_all('/pattern/',text,matches)`,
bash:`# grep -oP 'pattern' file`
},
docs:`Test regex patterns on text`
};

// HTML ENTITIES
DEVTOOLS.logic.html={
name:"HTML Entities Encoder/Decoder",
ui:`<textarea id="inp" rows="3" placeholder="Text"></textarea>
<div class="grid grid-cols-2 gap-2 mt-2">
<button class="btn" onclick="DEVTOOLS.logic['html'].run('encode')">Encode</button>
<button class="btn" onclick="DEVTOOLS.logic['html'].run('decode')">Decode</button>
</div>
<textarea id="out" rows="3" readonly class="mt-2"></textarea>`,
run:(mode)=>{
  const val=document.getElementById("inp").value
  let res=""
  if(mode==="encode") res=val.replace(/[\u00A0-\u9999<>\&]/gim,function(i){return '&#'+i.charCodeAt(0)+';'})
  else if(mode==="decode") res=val.replace(/&#(\d+);/g,(m,c)=>String.fromCharCode(c))
  document.getElementById("out").value=res
},
code:{
js:`text.replace(/[\u00A0-\u9999<>\&]/g,function(c){return '&#'+c.charCodeAt(0)+';'})`,
py:`import html\nhtml.escape(text) / html.unescape(text)`,
php:`htmlentities($text)/html_entity_decode($text)`,
bash:`# Use sed or awk`
},
docs:`Encode or decode HTML entities`
};

// JS MINIFIER
DEVTOOLS.logic.jsmin={
name:"JS Minifier",
ui:`<textarea id="inp" rows="6" placeholder="Paste JS"></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['jsmin'].run()">Minify JS</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  let val=document.getElementById("inp").value
  val=val.replace(/\s+/g,' ').replace(/\/\*[\s\S]*?\*\//g,'').replace(/ ?([:;{}(),=+]) ?/g,'$1').trim()
  document.getElementById("out").value=val
},
code:{
js:`js.replace(/\\s+/g,' ').replace(/\\/\\*.*?\\*\\//g,'').trim()`,
py:`# Use regex sub to minify JS`,
php:`// preg_replace to minify`,
bash:`# sed/awk to minify JS`
},
docs:`Minify JavaScript code`
};

// PHP FORMATTER
DEVTOOLS.logic.phpfmt={
name:"PHP Formatter",
ui:`<textarea id="inp" rows="6" placeholder="Paste PHP"></textarea>
<button class="btn mt-2" onclick="DEVTOOLS.logic['phpfmt'].run()">Format PHP</button>
<textarea id="out" rows="6" readonly class="mt-2"></textarea>`,
run:()=>{
  let val=document.getElementById("inp").value
  // Basit indentation için
  val=val.replace(/\s*{\s*/g,'{\n').replace(/\s*}\s*/g,'}\n').replace(/;\s*/g,';\n').trim()
  document.getElementById("out").value=val
},
code:{
js:`// Basic PHP formatting with regex`,
py:`# Use php-parser lib`,
php:`// Use php-cs-fixer or phpformatter`,
bash:`# Use phpcbf or phpfmt tools`
},
docs:`Format PHP code`
};
