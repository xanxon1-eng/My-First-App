export function getOfflineSandboxTemplate(tasksJson: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kingfisher Hub: C++ School 100-Year Offline Sandbox</title>
  <style>
    :root {
      --bg-dark: #0f172a;
      --bg-panel: #1e293b;
      --border: #334155;
      --text: #cbd5e1;
      --text-muted: #64748b;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #f97316;
      --emerald: #10b981;
      --rose: #f43f5e;
      --font-mono: "Courier New", Courier, monospace;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: var(--bg-dark);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      height: 100vh;
      overflow: hidden;
      display: flex;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .app-container {
      display: flex;
      width: 100%;
      height: 100%;
    }

    /* Sidebar */
    .sidebar {
      width: 300px;
      background-color: #0b0f19;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 300px;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-header h1 {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.05em;
    }

    .sidebar-header p {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .task-list {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      border-radius: 8px;
      background: transparent;
      color: var(--text);
      font-size: 13px;
      margin-bottom: 6px;
      border: 1px solid transparent;
    }

    .task-item:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .task-item.active {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.4);
      color: #fff;
      font-weight: 600;
    }

    .task-badge {
      font-family: var(--font-mono);
      font-size: 10px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .task-item.active .task-badge {
      background: var(--primary);
      color: #fff;
    }

    /* Main workspace */
    .workspace {
      flex: 1;
      display: grid;
      grid-template-columns: 10fr 9fr;
      height: 100%;
      overflow: hidden;
    }

    /* Left panel: Info & Editor */
    .left-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-right: 1px solid var(--border);
      overflow: hidden;
    }

    .info-pane {
      height: 40%;
      border-bottom: 1px solid var(--border);
      padding: 20px;
      overflow-y: auto;
    }

    .info-pane h2 {
      font-size: 18px;
      color: #fff;
      margin-bottom: 10px;
    }

    .info-pane h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-top: 16px;
      margin-bottom: 6px;
    }

    .info-pane p {
      font-size: 13px;
      line-height: 1.5;
      color: var(--text);
      margin-bottom: 10px;
    }

    .info-pane ul {
      margin-left: 20px;
      margin-bottom: 10px;
      font-size: 13px;
    }

    .info-pane li {
      margin-bottom: 4px;
    }

    .editor-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #111827;
      position: relative;
      overflow: hidden;
    }

    .editor-header {
      background-color: #030712;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }

    .editor-tab {
      background-color: var(--bg-panel);
      padding: 6px 12px;
      border-radius: 4px 4px 0 0;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #fff;
      border: 1px solid var(--border);
      border-bottom: none;
    }

    .editor-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .line-numbers {
      width: 40px;
      background-color: #030712;
      padding-top: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #4b5563;
      text-align: right;
      padding-right: 8px;
      line-height: 20px;
      user-select: none;
    }

    .code-textarea {
      flex: 1;
      background-color: transparent;
      color: #10b981;
      border: none;
      outline: none;
      resize: none;
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 20px;
      overflow-y: auto;
      white-space: pre;
    }

    .editor-footer {
      background-color: #030712;
      border-top: 1px solid var(--border);
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .verify-btn {
      background-color: var(--primary);
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      padding: 10px 18px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .verify-btn:hover {
      background-color: var(--primary-hover);
    }

    /* Right panel: Visual Window & Hex View */
    .right-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      padding: 20px;
      gap: 20px;
      background: #0a0d14;
    }

    /* Visual simulator */
    .sim-card {
      background-color: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sim-header {
      background-color: #0f172a;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sim-header h3 {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      font-family: var(--font-mono);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: var(--emerald);
      border-radius: 50%;
      display: inline-block;
    }

    .sim-body {
      flex: 1;
      background-color: #020617;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .visualizer-stage {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .avatar-row {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex: 1;
    }

    .character-box {
      background: rgba(30, 41, 59, 0.8);
      border: 2px solid var(--border);
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      width: 130px;
      position: relative;
    }

    .character-box.hero {
      border-color: var(--primary);
    }

    .character-box.mob {
      border-color: var(--rose);
    }

    .char-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.1em;
    }

    .char-health-bar {
      width: 100%;
      height: 8px;
      background: #030712;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .char-health-fill {
      height: 100%;
      background: var(--emerald);
      width: 100%;
      transition: width 0.3s;
    }

    .character-box.mob .char-health-fill {
      background: var(--rose);
    }

    .char-ammo {
      font-family: var(--font-mono);
      font-size: 11px;
    }

    .console-pane {
      background: #030712;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--emerald);
      height: 100px;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    .floating-text {
      position: absolute;
      color: var(--rose);
      font-weight: 800;
      font-size: 16px;
      animation: floatUp 0.8s forwards;
      pointer-events: none;
    }

    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-30px); }
    }

    /* Hex RAM Grid Visuals */
    .hex-card {
      background-color: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      height: 40%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .hex-body {
      flex: 1;
      background-color: #030712;
      padding: 16px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 12px;
    }

    .hex-row {
      display: flex;
      margin-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.02);
      padding-bottom: 4px;
    }

    .hex-addr {
      color: var(--text-muted);
      width: 100px;
    }

    .hex-val {
      color: #60a5fa;
      font-weight: bold;
      width: 120px;
    }

    .hex-desc {
      color: #94a3b8;
      flex: 1;
    }

    .validation-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }

    .val-pass {
      background: rgba(16, 185, 129, 0.15);
      color: var(--emerald);
      border: 1px solid var(--emerald);
    }

    .val-idle {
      background: rgba(249, 115, 22, 0.15);
      color: var(--accent);
      border: 1px solid var(--accent);
    }

    /* Custom Input Controls inside Simulator */
    .sim-controls {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      justify-content: center;
    }

    .sim-btn {
      background: #334155;
      color: white;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: bold;
    }

    .sim-btn:hover {
      background: #475569;
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
      background: rgba(255,255,255,0.03);
      padding: 8px 16px;
      border-radius: 6px;
    }

    .slider-container label {
      font-size: 11px;
      color: var(--accent);
      font-weight: bold;
      text-transform: uppercase;
    }

    .slider-container input {
      flex: 1;
    }
  </style>
</head>
<body>

  <div class="app-container">
    <!-- Sidebar Task Manager -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>KINGFISHER HUB C++</h1>
        <p>100-Year Offline Interactive Sandbox</p>
      </div>
      <div class="task-list" id="taskList"></div>
    </div>

    <!-- Workspace -->
    <div class="workspace">
      <!-- Left Panel -->
      <div class="left-panel">
        <div class="info-pane" id="infoPane"></div>
        <div class="editor-pane">
          <div class="editor-header">
            <div class="editor-tab" id="editorTabName">Source.cpp</div>
            <div class="validation-badge val-idle" id="validationBadge">State: Verification Required</div>
          </div>
          <div class="editor-body">
            <div class="line-numbers" id="lineNumbers">
              1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10
            </div>
            <textarea class="code-textarea" id="codeTextarea" spellcheck="false"></textarea>
          </div>
          <div class="editor-footer">
            <span style="font-size:11px; color:var(--text-muted);">C++ Standard: C++20 Standard GCC Compiler</span>
            <button class="verify-btn" onclick="verifyAndRunCode()">Run Code & Verify</button>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <!-- Simulation viewport -->
        <div class="sim-card">
          <div class="sim-header">
            <h3>VIRTUAL GAMEWINDOW VIEWPORT</h3>
            <span class="status-dot"></span>
          </div>
          <div class="sim-body" id="simBody"></div>
        </div>

        <!-- HEX RAM registers mapping details -->
        <div class="hex-card">
          <div class="sim-header">
            <h3>HEX RECONCILER SEGMENT MAPS</h3>
          </div>
          <div class="hex-body" id="hexBody"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const globalTasks = ${tasksJson};
    let activeTaskIdx = 0;
    let editBuffer = {};
    
    let simHealth = 100;
    let simAmmo = 30;
    let loopsSimStep = 0;
    
    function initApp() {
      const taskListElem = document.getElementById('taskList');
      taskListElem.innerHTML = '';
      
      globalTasks.forEach((t, index) => {
        const btn = document.createElement('button');
        btn.className = 'task-item' + (index === activeTaskIdx ? ' active' : '');
        btn.onclick = () => selectTask(index);
        
        const badge = document.createElement('span');
        badge.className = 'task-badge';
        badge.innerText = 'L' + (index + 1);
        
        const label = document.createElement('span');
        label.innerText = t.title;
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.whiteSpace = 'nowrap';
        
        btn.appendChild(badge);
        btn.appendChild(label);
        taskListElem.appendChild(btn);
      });
      
      selectTask(activeTaskIdx);
    }
    
    function selectTask(idx) {
      if (globalTasks[activeTaskIdx]) {
        const currentCode = document.getElementById('codeTextarea').value;
        const mainFile = Object.keys(globalTasks[activeTaskIdx].starterCode)[0];
        if (!editBuffer[activeTaskIdx]) editBuffer[activeTaskIdx] = {};
        editBuffer[activeTaskIdx][mainFile] = currentCode;
      }
      
      activeTaskIdx = idx;
      
      const items = document.querySelectorAll('.task-item');
      items.forEach((item, index) => {
        if (index === idx) item.classList.add('active');
        else item.classList.remove('active');
      });
      
      const task = globalTasks[idx];
      simHealth = 100;
      simAmmo = 30;
      loopsSimStep = 0;
      
      const infoPane = document.getElementById('infoPane');
      let successHtml = '';
      if (task.successCriteria && task.successCriteria.length > 0) {
        successHtml = '<h3>Success Criteria:</h3><ul>' + 
          task.successCriteria.map(s => '<li>' + s + '</li>').join('') + '</ul>';
      }
      
      infoPane.innerHTML = \`
        <h2>\${task.title}</h2>
        <p><strong>Category:</strong> \${task.category}</p>
        <div>\${task.objective.replace(/\\n/g, '<br>')}</div>
        \${successHtml}
      \`;
      
      const mainFile = Object.keys(task.starterCode)[0];
      const editorTabName = document.getElementById('editorTabName');
      editorTabName.innerText = mainFile;
      
      let codeToLoad = '';
      if (editBuffer[idx] && editBuffer[idx][mainFile]) {
        codeToLoad = editBuffer[idx][mainFile];
      } else {
        codeToLoad = task.starterCode[mainFile];
      }
      
      const textarea = document.getElementById('codeTextarea');
      textarea.value = codeToLoad;
      updateLineNumbers();
      
      const badge = document.getElementById('validationBadge');
      badge.className = 'validation-badge val-idle';
      badge.innerText = 'State: Verification Required';
      
      drawVisualizer();
      drawHexRegister();
    }
    
    function updateLineNumbers() {
      const textarea = document.getElementById('codeTextarea');
      const lns = document.getElementById('lineNumbers');
      const lines = textarea.value.split('\\n');
      let html = '';
      for (let i = 1; i <= Math.max(15, lines.length); i++) {
        html += i + '<br>';
      }
      lns.innerHTML = html;
    }
    
    document.getElementById('codeTextarea').addEventListener('input', updateLineNumbers);
    document.getElementById('codeTextarea').addEventListener('scroll', function() {
      document.getElementById('lineNumbers').scrollTop = this.scrollTop;
    });
    
    function drawVisualizer() {
      const task = globalTasks[activeTaskIdx];
      const container = document.getElementById('simBody');
      container.innerHTML = '';
      
      const stage = document.createElement('div');
      stage.className = 'visualizer-stage';
      
      if (task.id === 'task_1' || task.id === 'task_2' || task.id === 'task_8') {
        stage.innerHTML = \`
          <div class="avatar-row">
            <div class="character-box hero">
              <div class="char-title" style="color:#6366f1">Hero (PC)</div>
              <div class="char-health-bar">
                <div class="char-health-fill" id="heroHpFill" style="width: 100%"></div>
              </div>
              <div class="char-ammo" id="heroHpText">100 / 100 HP</div>
            </div>
            <div class="character-box mob">
              <div class="char-title" style="color:#f43f5e">Orc Brute (NPC)</div>
              <div class="char-health-bar">
                <div class="char-health-fill" id="mobHpFill" style="width: 70%"></div>
              </div>
              <div class="char-ammo" id="mobHpText">150 / 200 HP</div>
            </div>
          </div>
          <div class="console-pane" id="simConsole">Console: Game system ticking... Ready to strike or heal!</div>
          <div class="sim-controls">
            <button class="sim-btn" onclick="strikeEnemy()">Execute Attack Strike (C++)</button>
            <button class="sim-btn" onclick="healHero()">Apply Health Recovery (Regen)</button>
          </div>
        \`;
      } else if (task.id === 'task_3') {
        stage.innerHTML = \`
          <div style="color:#10b981; font-family:var(--font-mono); font-size:12px; margin-bottom:12px;">
            TCP/UDP Auth Server Simulation Protocol Streams:
          </div>
          <div class="console-pane" id="simConsole" style="height:140px;">
[client] socket connection stream listening on port 7777...
[client] packet sent (type: C2S_PLAYER_ACTION, payload: hello_server_handshake)
[server] UDP Replication session established. RTT = 12ms.
[server] processing validated C++ replication streams...
          </div>
        \`;
      } else if (task.id === 'task_4') {
        stage.innerHTML = \`
          <div class="avatar-row">
            <div class="character-box hero" style="width:200px;">
              <div class="char-title" style="color:#10b981">Assault Rifle (UProperty)</div>
              <div style="font-size:11px; margin-bottom:4px;">Ammo variable: <span id="ammoVal" style="color:#60a5fa; font-weight:800;">30</span></div>
              <div style="font-size:11px; margin-bottom:8px;">Pointer reference: <span style="color:#f59e0b;">AmmoPtr -> 0x7FFEE3C0</span></div>
              <div class="sim-controls">
                <button class="sim-btn" style="background:#10b981;" onclick="fireWeapon()">Fire Weapon (*AmmoPtr--)</button>
                <button class="sim-btn" style="background:#f59e0b;" onclick="reloadWeapon()">Reload (Deref Write)</button>
              </div>
            </div>
          </div>
          <div class="console-pane" id="simConsole" style="height:70px;">[Pointer sandbox]: dereference operations log...</div>
        \`;
      } else if (task.id === 'task_6') {
        stage.innerHTML = \`
          <div class="avatar-row" style="flex-direction:column; gap:10px;">
            <div id="flowStatusCard" style="background:rgba(16,185,129,0.1); border:2px solid var(--emerald); border-radius:8px; padding:12px 24px; text-align:center; font-weight:bold; font-size:16px;">
              STATUS: Healthy (Health = 100)
            </div>
            <div class="slider-container" style="width:100%;">
              <label>Simulated HP</label>
              <input type="range" min="0" max="100" value="100" id="hpFlowSlider" oninput="changeFlowHp(this.value)">
            </div>
          </div>
          <div class="console-pane" id="simConsole" style="height:70px;">[Control Flow Solver]: branching simulator active. Toggle the slider to execute path logic!</div>
        \`;
      } else {
        stage.innerHTML = \`
          <div style="font-size:11px; color:#fff; font-weight:bold; margin-bottom:12px;">Dynamic Loop Engine Runner Simulation:</div>
          <div id="loopVisualGrid" style="display:flex; justify-content:center; gap:8px; margin-bottom:12px;"></div>
          <div class="console-pane" id="simConsole" style="height:80px;">[Loop sandbox active]: press step to sequence instruction loops.</div>
          <div class="sim-controls">
            <button class="sim-btn" style="background:var(--primary);" onclick="stepLoopAnimation()">Iterate Next Core Loop Step</button>
            <button class="sim-btn" style="background:var(--accent);" onclick="resetLoopAnimation()">Reset Loop Ticker</button>
          </div>
        \`;
        setTimeout(populateLoopVisualGrid, 50);
      }
      
      container.appendChild(stage);
    }
    
    function drawHexRegister() {
      const task = globalTasks[activeTaskIdx];
      const hexBody = document.getElementById('hexBody');
      hexBody.innerHTML = '';
      
      let rows = '';
      const addRow = (addr, val, desc) => {
        rows += \`<div class="hex-row">
            <span class="hex-addr">\${addr}</span>
            <span class="hex-val">[\${val}]</span>
            <span class="hex-desc">\${desc}</span>
          </div>\`;
      };
      
      if (task.id === 'task_1' || task.id === 'task_2' || task.id === 'task_6' || task.id === 'task_8') {
        addRow("0x7FFEE3C0-C4", simHealth, "int32 Health state register bounds");
        addRow("0x7FFEE3C4-C8", "45.50", "float Damage scalar constant specifier");
        addRow("0x7FFEE3C8-C9", simHealth > 0 ? "true" : "false", "bool bIsAlive player status flag");
        addRow("0x7FFEE3C9-D0", "0x000", "Reserved layout padding bytes");
        addRow("0x7FFEE3D0-D8", "0x00000000", "Unallocated class slots");
      } else if (task.id === 'task_4') {
        addRow("0x7FFEE3C0-C4", simAmmo, "int32 Ammo counts base register block");
        addRow("0x7FFEE3D0-D8", "0x7FFEE3C0", "int32* AmmoPtr pointing address registers");
        addRow("0x7FFEE3D8-E0", "0x000", "Default system layouts boundaries padding");
      } else {
        addRow("0x7FFEE3C0-C4", "scores[0]", "Array index registry 0 pointer");
        addRow("0x7FFEE3C4-C8", "scores[1]", "Array index registry 1 pointer");
        addRow("0x7FFEE3C8-CC", "scores[2]", "Array index registry 2 pointer");
        addRow("0x7FFEE3D0-D8", "0xFFFFA020", "Active loops variables indices registers");
      }
      
      hexBody.innerHTML = rows;
    }
    
    function strikeEnemy() {
      const mobFill = document.getElementById('mobHpFill');
      const mobText = document.getElementById('mobHpText');
      const cons = document.getElementById('simConsole');
      
      const currentWidth = parseFloat(mobFill.style.width);
      if (currentWidth <= 0) {
        cons.innerText += '\\n[system] Orc Brute is already deceased! Spawning new Mob.';
        mobFill.style.width = '100%';
        mobText.innerText = '200 / 200 HP';
        return;
      }
      
      const damage = Math.floor(Math.random() * 25) + 15;
      const nextWidth = Math.max(0, currentWidth - (damage / 2));
      mobFill.style.width = nextWidth + '%';
      mobText.innerText = Math.round(nextWidth * 2) + ' / 200 HP';
      
      const floatVal = document.createElement('div');
      floatVal.className = 'floating-text';
      floatVal.innerText = '-' + damage + ' HP!';
      floatVal.style.left = '60%';
      floatVal.style.top = '30%';
      document.getElementById('simBody').appendChild(floatVal);
      setTimeout(() => floatVal.remove(), 800);
      
      cons.innerText += \`\\n[strike] Player strikes Orc Brute for \${damage} damage. (C++ validation triggers normal maps PSD)\`;
      cons.scrollTop = cons.scrollHeight;
    }
    
    function healHero() {
      const heroFill = document.getElementById('heroHpFill');
      const heroText = document.getElementById('heroHpText');
      const cons = document.getElementById('simConsole');
      
      simHealth = Math.min(100, simHealth + 25);
      heroFill.style.width = simHealth + '%';
      heroText.innerText = simHealth + ' / 100 HP';
      
      cons.innerText += '\\n[heal] Player drinks dynamic potion. Regen added: +25 HP.';
      cons.scrollTop = cons.scrollHeight;
      drawHexRegister();
    }
    
    function fireWeapon() {
      if (simAmmo <= 0) {
        document.getElementById('simConsole').innerText += '\\n[click] Click! Out of ammo!';
        return;
      }
      simAmmo--;
      document.getElementById('ammoVal').innerText = simAmmo;
      document.getElementById('simConsole').innerText += '\\n[fire] Pew! *AmmoPtr dereferenced and decremented.';
      document.getElementById('simConsole').scrollTop = document.getElementById('simConsole').scrollHeight;
      
      const floatVal = document.createElement('div');
      floatVal.className = 'floating-text';
      floatVal.innerText = 'PEW!';
      floatVal.style.left = '45%';
      floatVal.style.top = '25%';
      floatVal.style.color = '#38bdf8';
      document.getElementById('simBody').appendChild(floatVal);
      setTimeout(() => floatVal.remove(), 800);
      
      drawHexRegister();
    }
    
    function reloadWeapon() {
      simAmmo = 30;
      document.getElementById('ammoVal').innerText = simAmmo;
      document.getElementById('simConsole').innerText += '\\n[reload] AmmoPtr write overrides: Ammo initialized to 30.';
      document.getElementById('simConsole').scrollTop = document.getElementById('simConsole').scrollHeight;
      drawHexRegister();
    }
    
    function changeFlowHp(val) {
      simHealth = parseInt(val);
      const card = document.getElementById('flowStatusCard');
      const cons = document.getElementById('simConsole');
      
      let status = '';
      let color = '';
      let bg = '';
      
      if (simHealth > 50) {
        status = 'Healthy';
        color = 'var(--emerald)';
        bg = 'rgba(16,185,129,0.1)';
      } else if (simHealth > 0) {
        status = 'Wounded';
        color = 'var(--accent)';
        bg = 'rgba(249,115,22,0.1)';
      } else {
        status = 'Dead (Respawning Target...)';
        color = 'var(--rose)';
        bg = 'rgba(244,63,94,0.1)';
      }
      
      card.innerText = \`STATUS: \${status} (Health = \${simHealth})\`;
      card.style.borderColor = color;
      card.style.background = bg;
      
      cons.innerText += \`\\n[flow] HP changed to \${simHealth}. Branching: \${status}\`;
      cons.scrollTop = cons.scrollHeight;
      drawHexRegister();
    }
    
    function populateLoopVisualGrid() {
      const grid = document.getElementById('loopVisualGrid');
      if (!grid) return;
      grid.innerHTML = '';
      
      const nums = [12, 24, 7, 18, 41];
      nums.forEach((num, idx) => {
        const cell = document.createElement('div');
        cell.id = 'loopCell_' + idx;
        cell.style.width = '42px';
        cell.style.height = '42px';
        cell.style.background = '#1e293b';
        cell.style.border = '2px solid #475569';
        cell.style.borderRadius = '6px';
        cell.style.display = 'flex';
        cell.style.flexDirection = 'column';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = '12px';
        cell.style.fontFamily = 'var(--font-mono)';
        cell.style.fontWeight = 'bold';
        
        cell.innerHTML = \`<span style="font-size:9px; color:var(--text-muted);">[\${idx}]</span><span>\${num}</span>\`;
        grid.appendChild(cell);
      });
    }
    
    function stepLoopAnimation() {
      const idx = loopsSimStep % 5;
      
      for(let i=0; i<5; i++) {
        const c = document.getElementById('loopCell_' + i);
        if (c) {
          c.style.background = '#1e293b';
          c.style.borderColor = '#475569';
        }
      }
      
      const activeCell = document.getElementById('loopCell_' + idx);
      if (activeCell) {
        activeCell.style.background = 'rgba(99, 102, 241, 0.2)';
        activeCell.style.borderColor = 'var(--primary)';
      }
      
      const nums = [12, 24, 7, 18, 41];
      document.getElementById('simConsole').innerText += \`\\n[loop step] i = \${idx}; array[\${idx}] = \${nums[idx]}; accumulating totals...\`;
      document.getElementById('simConsole').scrollTop = document.getElementById('simConsole').scrollHeight;
      
      loopsSimStep++;
    }
    
    function resetLoopAnimation() {
      loopsSimStep = 0;
      for(let i=0; i<5; i++) {
        const c = document.getElementById('loopCell_' + i);
        if (c) {
          c.style.background = '#1e293b';
          c.style.borderColor = '#475569';
        }
      }
      document.getElementById('simConsole').innerText += '\\n[loop] Ticker reset to index 0.';
    }
    
    function verifyAndRunCode() {
      const task = globalTasks[activeTaskIdx];
      const code = document.getElementById('codeTextarea').value;
      const badge = document.getElementById('validationBadge');
      
      let verifiedCount = 0;
      const missingCriteria = [];
      
      if (task.hiddenTests && task.hiddenTests.length > 0) {
        task.hiddenTests.forEach(test => {
          let match = false;
          if (test.type === 'contains') {
            match = code.includes(test.target);
          } else if (test.type === 'regex') {
            const rx = new RegExp(test.target);
            match = rx.test(code);
          }
          
          if (match) verifiedCount++;
          else missingCriteria.push(test.feedback || "Missing required structure elements");
        });
      }
      
      const success = (task.hiddenTests && task.hiddenTests.length > 0) ? (verifiedCount === task.hiddenTests.length) : true;
        
      if (success) {
        badge.className = 'validation-badge val-pass';
        badge.innerText = 'Compiler Verification: SUCCESS';
        
        const floatVal = document.createElement('div');
        floatVal.className = 'floating-text';
        floatVal.innerText = 'SUCCESS! 100%';
        floatVal.style.left = '40%';
        floatVal.style.top = '40%';
        floatVal.style.color = 'var(--emerald)';
        document.getElementById('simBody').appendChild(floatVal);
        setTimeout(() => floatVal.remove(), 1200);
        
        document.getElementById('simConsole').innerText += '\\n[compiler] COMPILATION SECURE. Standard dynamic tests passed.';
      } else {
        badge.className = 'validation-badge val-idle';
        badge.style.borderColor = 'var(--rose)';
        badge.style.color = 'var(--rose)';
        badge.style.background = 'rgba(244,63,94,0.1)';
        badge.innerText = 'Verification Failed';
        
        document.getElementById('simConsole').innerText += '\\n[compiler_fallback] Error feedback: ' + missingCriteria.join(', ');
      }
      
      document.getElementById('simConsole').scrollTop = document.getElementById('simConsole').scrollHeight;
    }
    
    window.onload = initApp;
  </script>
</body>
</html>`;
}
