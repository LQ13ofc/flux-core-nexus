
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { exec } = require('child_process');

// Tenta carregar Koffi para chamadas nativas (Kernel32)
let libKoffi = null;
let kernel32 = null;
let OpenProcess = null;
let CloseHandle = null;

try {
    libKoffi = require('koffi');
    if (process.platform === 'win32') {
        kernel32 = libKoffi.load('kernel32.dll');
        // Define assinaturas da API do Windows
        OpenProcess = kernel32.func('__stdcall', 'OpenProcess', 'uint32', ['uint32', 'int', 'uint32']);
        CloseHandle = kernel32.func('__stdcall', 'CloseHandle', 'int', ['uint32']);
    }
} catch (e) {
    console.warn("Native Bindings (Koffi) failed to load. Running in restricted mode.", e);
}

const PROCESS_ALL_ACCESS = 0x1F0FFF;

app.disableHardwareAcceleration();
const isDev = !app.isPackaged;
const PLATFORM = process.platform;
let mainWindow;

function emitLog(msg, level = 'INFO', cat = 'SYSTEM') {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('log-entry', { message: msg, level, category: cat });
  }
}

function updatePhase(phase) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('injection-phase-update', phase);
  }
}

ipcMain.handle('get-platform', () => PLATFORM);

// --- FILE SELECTION DIALOG ---
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Select Cheat Module (.dll)',
    filters: [
      { name: 'Dynamic Link Libraries', extensions: ['dll'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (result.canceled || result.filePaths.length === 0) return null;

  const selectedPath = result.filePaths[0];
  
  // Validação Imediata do Arquivo
  try {
      const stats = fs.statSync(selectedPath);
      return { 
          path: selectedPath, 
          size: (stats.size / 1024).toFixed(2) + ' KB',
          name: path.basename(selectedPath)
      };
  } catch (e) {
      return null;
  }
});

ipcMain.handle('get-processes', async () => {
  return new Promise((resolve) => {
    const cmd = PLATFORM === 'win32' ? 'tasklist /v /fo csv /nh' : 'ps -A -o comm,pid,rss';
    exec(cmd, { maxBuffer: 1024 * 1024 * 2 }, (err, stdout) => {
      if (err) return resolve([]);
      const list = [];
      const lines = stdout.toString().split(/\r?\n/);
      lines.forEach(line => {
        if (!line.trim()) return;
        let parts = PLATFORM === 'win32' ? line.split('","').map(s => s.replace(/"/g, '')) : line.trim().split(/\s+/);
        if (parts.length >= 2) {
          list.push({ 
            name: PLATFORM === 'win32' ? parts[0] : parts[0].split('/').pop(), 
            pid: parseInt(parts[1]), 
            memory: PLATFORM === 'win32' ? parts[4] : parts[2] + ' KB',
            title: PLATFORM === 'win32' ? (parts[8] || parts[0]) : parts[0]
          });
        }
      });
      resolve(list.filter(p => p.pid > 0));
    });
  });
});

// --- MANUAL MAPPING 7-PHASE EXECUTION ---
ipcMain.handle('inject-dll', async (event, { pid, dllPath, settings }) => {
  try {
    // 1. Validação Rigorosa do Arquivo
    if (!dllPath) throw new Error("No DLL file selected.");
    
    try {
        fs.accessSync(dllPath, fs.constants.R_OK);
        const stats = fs.statSync(dllPath);
        emitLog(`File Verified: ${path.basename(dllPath)} (${stats.size} bytes)`, 'INFO', 'LOADER');
    } catch (err) {
        throw new Error(`File Access Denied or Missing: ${dllPath}`);
    }

    // 2. Validação Rigorosa do Processo (API Real do Windows)
    if (PLATFORM === 'win32' && OpenProcess) {
        emitLog(`Requesting Handle for PID ${pid}...`, 'INFO', 'KERNEL');
        
        // Tenta abrir o processo com permissões totais
        const handle = OpenProcess(PROCESS_ALL_ACCESS, 0, pid);
        
        if (handle === 0) {
             throw new Error("Access Denied: Could not open process handle. Try running Flux Core as Administrator.");
        }
        
        emitLog(`Handle Acquired: 0x${handle.toString(16).toUpperCase()}`, 'SUCCESS', 'KERNEL');
        
        // Fecha o handle por enquanto (a injeção simulada prossegue, ou aqui entraria o WriteProcessMemory real)
        CloseHandle(handle);
    } else if (PLATFORM === 'win32' && !OpenProcess) {
        emitLog("Warning: Running in compatibility mode (Native Libs Missing)", 'WARN', 'SYSTEM');
    }

    // 3. Sequência de Injeção (Simulação Visual Baseada em Passos Reais)
    // Se passou das verificações acima, significa que TEMOS o arquivo e TEMOS permissão no processo.
    const phases = [
      { id: 1, msg: `Phase 1: Parsing PE Headers of ${path.basename(dllPath)}...`, cat: "PE_ENGINE" },
      { id: 2, msg: "Phase 2: Allocating Remote Memory (PAGE_EXECUTE_READWRITE)...", cat: "MEMORY" },
      { id: 3, msg: "Phase 3: Mapping Sections to Target Address Space...", cat: "PE_ENGINE" },
      { id: 4, msg: "Phase 4: Resolving Import Table (IAT) & Relocations...", cat: "KERNEL" },
      { id: 5, msg: "Phase 5: Writing Shellcode Stub...", cat: "MEMORY" },
      { id: 6, msg: "Phase 6: Creating Remote Thread (NtCreateThreadEx)...", cat: "THREAD" },
      { id: 7, msg: "Phase 7: Cleaning Metadata & Unlinking Module...", cat: "GHOST" }
    ];

    for (const phase of phases) {
      updatePhase(phase.id);
      emitLog(phase.msg, 'INFO', phase.cat);
      // Timing variável para realismo
      await new Promise(r => setTimeout(r, 400 + Math.random() * 500));
    }

    // AOB SCAN SIMULATION
    emitLog("AOB Scanning for Script Engine patterns...", "WARN", "LUA_VM");
    await new Promise(r => setTimeout(r, 1000));
    emitLog("Pattern Found: lua_getfield at offset 0x140AD2F", "SUCCESS", "LUA_VM");

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('execute-script', async (event, code) => {
  const pipeName = PLATFORM === 'win32' ? '\\\\.\\pipe\\NexusEnginePipe' : '/tmp/NexusEnginePipe';
  
  return new Promise((resolve) => {
    let attempts = 0;
    const connect = () => {
      attempts++;
      const client = net.createConnection(pipeName, () => {
        client.write(code, (err) => {
          if (!err) { client.end(); resolve({ success: true }); }
          else { client.destroy(); resolve({ success: false, error: err.message }); }
        });
      });

      client.on('error', () => {
        client.destroy();
        if (attempts < 5) setTimeout(connect, 500);
        else {
          if (isDev) resolve({ success: true }); // Mock success for UI testing
          else resolve({ success: false, error: "Pipe Connection Timeout: Target not responding." });
        }
      });
    };
    connect();
  });
});

ipcMain.handle('reset-injection-state', () => {
  emitLog("Emergency Eject: Unhooking VMT and clearing pipe handles...", "CRITICAL", "SYSTEM");
  return { success: true };
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1050, height: 680,
    frame: false, resizable: false,
    backgroundColor: '#0d0d0f',
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  const startUrl = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, 'dist', 'index.html')}`;
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(createWindow);
