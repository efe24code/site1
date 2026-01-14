window.DEVTOOLS = {

tools:[
 {id:"hash",name:"Hash Lab",cat:"crypto",icon:"🔐"},
 {id:"uuid",name:"UUID Generator",cat:"crypto",icon:"🆔"},
 {id:"jwt",name:"JWT Decoder",cat:"crypto",icon:"🪪"},
 {id:"pass",name:"Password Check",cat:"crypto",icon:"🔑"},

 {id:"json",name:"JSON Formatter",cat:"data",icon:"{ }"},
 {id:"base",name:"Base64 Encode/Decode",cat:"data",icon:"📦"},
 {id:"csv",name:"CSV → JSON",cat:"data",icon:"📑"},

 {id:"count",name:"Word Counter",cat:"text",icon:"🔢"},
 {id:"slug",name:"Slug Generator",cat:"text",icon:"🔗"},
 {id:"case",name:"Case Switcher",cat:"text",icon:"Aa"},

 {id:"css",name:"CSS Minifier",cat:"dev",icon:"🎨"},
 {id:"regex",name:"Regex Tester",cat:"dev",icon:"🧪"},
 {id:"env",name:".env Validator",cat:"dev",icon:"⚙️"},

 {id:"ua",name:"User-Agent Parser",cat:"network",icon:"📱"}
],

logic:{

hash:{
 ui:`<textarea id="inp" rows="3"></textarea>
     <select id="algo"><option>SHA-256</option><option>SHA-1</option></select>
     <input id="out" readonly>`,
 run:async()=>{
  const b=new TextEncoder().encode(inp.value)
  const h=await crypto.subtle.digest(algo.value,b)
  out.value=[...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("")
 }
},

uuid:{
 ui:`<input id="out" readonly>`,
 run:()=>out.value=crypto.randomUUID()
},

jwt:{
 ui:`<textarea id="inp" rows="3"></textarea><pre id="out"></pre>`,
 run:()=>{
  try{out.textContent=JSON.stringify(JSON.parse(atob(inp.value.split(".")[1])),null,2)}
  catch{out.textContent="Invalid JWT"}
 }
},

pass:{
 ui:`<input id="inp"><div id="out"></div>`,
 run:()=>{
  let s=0,p=inp.value
  if(p.length>7)s++
  if(/[A-Z]/.test(p))s++
  if(/[0-9]/.test(p))s++
  if(/[^A-Za-z0-9]/.test(p))s++
  out.textContent=["Very Weak","Weak","OK","Strong","Very Strong"][s]
 }
},

json:{
 ui:`<textarea id="inp" rows="6"></textarea>`,
 run:()=>{
  try{inp.value=JSON.stringify(JSON.parse(inp.value),null,2)}
  catch{alert("Invalid JSON")}
 }
},

base:{
 ui:`<textarea id="inp"></textarea><textarea id="out"></textarea>`,
 run:()=>{
  try{out.value=btoa(inp.value)}
  catch{out.value="Error"}
 }
},

csv:{
 ui:`<textarea id="inp" rows="6"></textarea><pre id="out"></pre>`,
 run:()=>{
  const [h,...r]=inp.value.split("\n")
  const k=h.split(",")
  out.textContent=JSON.stringify(r.map(l=>Object.fromEntries(l.split(",").map((v,i)=>[k[i],v]))),null,2)
 }
},

count:{
 ui:`<textarea id="inp" rows="6"></textarea><div id="out"></div>`,
 run:()=>{
  const t=inp.value
  out.textContent=`Words: ${t.trim()?t.trim().split(/\s+/).length:0} | Chars: ${t.length}`
 }
},

slug:{
 ui:`<input id="inp"><input id="out" readonly>`,
 run:()=>out.value=inp.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")
},

case:{
 ui:`<textarea id="inp" rows="4"></textarea>`,
 run:()=>inp.value=[...inp.value].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join("")
},

css:{
 ui:`<textarea id="inp" rows="6"></textarea><textarea id="out"></textarea>`,
 run:()=>out.value=inp.value.replace(/\s+/g," ").replace(/ ?([:;{}]) ?/g,"$1")
},

regex:{
 ui:`<input id="pattern"><textarea id="inp"></textarea><pre id="out"></pre>`,
 run:()=>{
  try{out.textContent=inp.value.match(new RegExp(pattern.value,"g"))?.join("\n")||"No match"}
  catch{out.textContent="Invalid regex"}
 }
},

env:{
 ui:`<textarea id="inp" rows="6"></textarea><pre id="out"></pre>`,
 run:()=>{
  const bad=inp.value.split("\n").filter(l=>!/^\\w+=/.test(l))
  out.textContent=bad.length?bad.join("\n"):"Valid .env"
 }
},

ua:{
 ui:`<textarea id="inp"></textarea><pre id="out"></pre>`,
 run:()=>out.textContent=/mobile/i.test(inp.value)?"Mobile":/chrome/i.test(inp.value)?"Chrome":"Unknown"
}

}
}
