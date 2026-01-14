
window.DEVTOOLS = {tools:[],logic:{}};
// Örnek mini tool
DEVTOOLS.tools.push({id:'ip',cat:'network',name:'IP Tracker',icon:'📡'});
DEVTOOLS.logic['ip']={ui:'<input id="inp"><button class="btn" onclick="run(\'ip\')">TRACK</button><div id="out"></div>',
run:async()=>{const ip=document.getElementById('inp').value;document.getElementById('out').innerText='IP:'+ip;},
code:{js:"fetch('https://ipapi.co/json/')"}};
function run(tool){DEVTOOLS.logic[tool].run();}
