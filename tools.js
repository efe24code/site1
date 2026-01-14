/* ================================
   DEVTOOL LITE – ALL TOOLS
   ================================ */

window.DEVTOOLS = {

  /* ---------- TOOL LIST ---------- */
  tools: [
    { id: "hash", name: "Hash Lab", cat: "crypto", icon: "🔐" },
    { id: "ip", name: "IP Intelligence", cat: "network", icon: "📡" },
    { id: "json", name: "JSON Repair", cat: "data", icon: "{ }" },
    { id: "jwt", name: "JWT Decoder", cat: "crypto", icon: "🪪" },
    { id: "uuid", name: "UUID Studio", cat: "crypto", icon: "🆔" },
    { id: "base", name: "Encoding Lab", cat: "data", icon: "📦" },
    { id: "css", name: "CSS Minifier", cat: "dev", icon: "🎨" },
    { id: "count", name: "Word Counter", cat: "text", icon: "🔢" }
  ],

  /* ---------- TOOL LOGIC ---------- */
  logic: {

    hash: {
      ui: `
        <textarea id="inp" rows="4" placeholder="Text..."></textarea>
        <select id="algo" class="mt-3">
          <option>SHA-256</option>
          <option>SHA-1</option>
          <option>SHA-512</option>
        </select>
        <button class="btn-action mt-3" onclick="run()">GENERATE</button>
        <input id="out" class="mt-3 font-mono text-green-400" readonly>
      `,
      run: async () => {
        const txt = inp.value;
        const algo = algoSelect().value;
        const buf = new TextEncoder().encode(txt);
        const hash = await crypto.subtle.digest(algo, buf);
        out.value = [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
      },
      code: {
        js: "crypto.subtle.digest('SHA-256', data)",
        py: "hashlib.sha256(b'text').hexdigest()",
        php: "hash('sha256','text');"
      }
    },

    ip: {
      ui: `
        <input id="inp" placeholder="IP (empty = yours)">
        <button class="btn-action mt-3" onclick="run()">SCAN</button>
        <pre id="out" class="mt-3 text-xs text-blue-300"></pre>
      `,
      run: async () => {
        out.textContent = "Loading...";
        const r = await fetch("/api/ip");
        out.textContent = JSON.stringify(await r.json(), null, 2);
      },
      code: { js: "fetch('/api/ip')" }
    },

    json: {
      ui: `
        <textarea id="inp" rows="6" placeholder="Broken JSON"></textarea>
        <button class="btn-action mt-3" onclick="run()">REPAIR</button>
      `,
      run: () => {
        try {
          inp.value = JSON.stringify(JSON.parse(inp.value), null, 2);
        } catch {
          alert("Invalid JSON");
        }
      },
      code: { js: "JSON.parse + JSON.stringify" }
    },

    jwt: {
      ui: `
        <textarea id="inp" rows="3" placeholder="JWT token"></textarea>
        <button class="btn-action mt-3" onclick="run()">DECODE</button>
        <pre id="out" class="mt-3 text-xs"></pre>
      `,
      run: () => {
        try {
          const p = inp.value.split(".")[1];
          out.textContent = JSON.stringify(JSON.parse(atob(p)), null, 2);
        } catch {
          out.textContent = "Invalid JWT";
        }
      },
      code: { js: "atob(token.split('.')[1])" }
    },

    uuid: {
      ui: `
        <button class="btn-action" onclick="run()">GENERATE UUID</button>
        <input id="out" class="mt-3 font-mono text-center" readonly>
      `,
      run: () => out.value = crypto.randomUUID(),
      code: { js: "crypto.randomUUID()" }
    },

    base: {
      ui: `
        <textarea id="inp" rows="3"></textarea>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <button class="btn-action" onclick="run('e')">ENCODE</button>
          <button class="btn-action bg-slate-700" onclick="run('d')">DECODE</button>
        </div>
        <textarea id="out" rows="3" class="mt-3" readonly></textarea>
      `,
      run: (m) => {
        try {
          out.value = m === "e" ? btoa(inp.value) : atob(inp.value);
        } catch {
          out.value = "Error";
        }
      },
      code: { js: "btoa / atob" }
    },

    css: {
      ui: `
        <textarea id="inp" rows="6" placeholder="CSS..."></textarea>
        <button class="btn-action mt-3" onclick="run()">MINIFY</button>
        <textarea id="out" rows="6" class="mt-3"></textarea>
      `,
      run: () => {
        out.value = inp.value
          .replace(/\/\*[\s\S]*?\*\//g,"")
          .replace(/\s+/g," ")
          .replace(/ ?([:;{}]) ?/g,"$1")
          .trim();
      },
      code: { js: "regex minify" }
    },

    count: {
      ui: `
        <textarea id="inp" rows="6" onkeyup="run()"></textarea>
        <div id="out" class="mt-3 text-xs"></div>
      `,
      run: () => {
        const t = inp.value;
        out.innerHTML = `Words: ${t.trim()?t.trim().split(/\s+/).length:0} | Chars: ${t.length}`;
      },
      code: { js: "split + length" }
    }

  }
};

/* helpers */
function algoSelect(){return document.getElementById("algo")}
