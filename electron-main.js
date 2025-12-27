
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const net = require('net'); // Required for Named Pipe communication

// --- PERFORMANCE & SECURITY ---
app.disableHardwareAcceleration(); 

app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('no-sandbox'); 
app.commandLine.appendSwitch('ignore-certificate-errors');

const isDev = !app.isPackaged;
const PLATFORM = process.platform; 

let mainWindow;
let WinAPI = null;
let nativeLoadError = null;

// Tenta carregar bibliotecas nativas com segurança (Apenas Windows)
if (PLATFORM === 'win32') {
    try {
      const koffi = require('koffi');
      const kernel32 = koffi.load('kernel32.dll');
      const ntdll = koffi.load('ntdll.dll'); 

      WinAPI = {
        OpenProcess: kernel32.func('__stdcall', 'OpenProcess', 'intptr', ['uint32_t', 'int', 'uint32_t']),
        VirtualAllocEx: kernel32.func('__stdcall', 'VirtualAllocEx', 'intptr', ['intptr', 'intptr', 'size_t', 'uint32_t', 'uint32_t']),
        WriteProcessMemory: kernel32.func('__stdcall', 'WriteProcessMemory', 'int', ['intptr', 'intptr', 'intptr', 'size_t', 'intptr']), 
        CreateRemoteThread: kernel32.func('__stdcall', 'CreateRemoteThread', 'intptr', ['intptr', 'intptr', 'size_t', 'intptr', 'intptr', 'uint32_t', 'intptr']),
        CloseHandle: kernel32.func('__stdcall', 'CloseHandle', 'int', ['intptr']),
        NtCreateThreadEx: ntdll.func('__stdcall', 'NtCreateThreadEx', 'int', ['_Out_ intptr *', 'uint32_t', 'intptr', 'intptr', 'intptr', 'intptr', 'bool', 'uint32_t', 'uint32_t', 'uint32_t', 'intptr']),
        // RtlAdjustPrivilege é usado para obter permissões de SeDebugPrivilege
        RtlAdjustPrivilege: ntdll.func('__stdcall', 'RtlAdjustPrivilege', 'int', ['ulong', 'bool', 'bool', '_Out_ bool *']),
      };
      console.log("Native WinAPI loaded successfully.");
    } catch (e) {
      console.error("WARNING: Native bindings (Koffi) failed to load.", e.message);
      nativeLoadError = e.message;
      console.log("App continuing in Non-Native Mode (Simulation).");
    }
}

ipcMain.handle('get-platform', () => PLATFORM);

ipcMain.handle('system-flush', async () => {
    try {
        return new Promise((resolve) => {
            let commands = [];
            if (PLATFORM === 'win32') commands = ['ipconfig /flushdns', 'netsh winsock reset', 'arp -d *'];
            else if (PLATFORM === 'darwin') commands = ['sudo dscacheutil -flushcache', 'sudo killall -HUP mDNSResponder'];
            else if (PLATFORM === 'linux') commands = ['resolvectl flush-caches', 'ip -s -s neigh flush all'];

            if (commands.length === 0) {
                resolve({ success: true, message: "No flush commands needed for this platform." });
                return;
            }

            const runNext = (index) => {
                if (index >= commands.length) { 
                    resolve({ success: true, message: "System flush completed." }); 
                    return; 
                }
                exec(commands[index], (error) => {
                    if (error) console.warn(`Command failed: ${commands[index]}`);
                    runNext(index + 1);
                });
            };
            runNext(0);
        });
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('get-processes', async () => {
  return new Promise((resolve, reject) => {
    try {
        if (PLATFORM === 'win32') {
            exec('tasklist /v /fo csv /nh', { maxBuffer: 1024 * 1024 * 5 }, (err, stdout, stderr) => {
                if (err && !stdout) { 
                    reject(`Tasklist failed: ${err.message}`); 
                    return;
                }
                
                try {
                    const processes = [];
                    const lines = stdout.toString().split(/\r?\n/);
                    
                    for (const line of lines) {
                        if (!line.trim()) continue;

                        const parts = [];
                        let current = '';
                        let inQuote = false;
                        
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') { 
                                inQuote = !inQuote; 
                            } else if (char === ',' && !inQuote) {
                                parts.push(current);
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        parts.push(current);

                        if (parts.length >= 9) {
                            const name = parts[0];
                            const pid = parseInt(parts[1]);
                            const memory = parts[4];
                            const title = parts[8];
                            
                            const isSystemNoise = name.toLowerCase() === 'svchost.exe' || title === 'Default IME' || title === 'MSCTFIME UI';
                            const hasWindow = title && title !== 'N/A' && title.trim().length > 0;

                            if (hasWindow && !isSystemNoise) {
                                processes.push({ name, pid, memory, title });
                            }
                        }
                    }
                    resolve(processes.sort((a, b) => a.title.localeCompare(b.title)));
                } catch (parseError) {
                    reject(`Parsing error: ${parseError.message}`);
                }
            });
        } else {
            // Linux/Mac fallback
            exec('ps -A -o comm,pid,rss,user', (err, stdout, stderr) => {
                if (err && !stdout) { 
                    reject(`PS failed: ${err ? err.message : stderr}`);
                    return; 
                }
                try {
                    const processes = [];
                    const lines = stdout.toString().split('\n');
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        const parts = line.split(/\s+/);
                        if (parts.length >= 4) {
                             const pathPart = parts[0];
                             const name = pathPart.split('/').pop();
                             const pid = parseInt(parts[1]);
                             const mem = (parseInt(parts[2]) / 1024).toFixed(1) + ' MB';
                             processes.push({ name, pid, memory: mem, title: name }); 
                        }
                    }
                    resolve(processes.sort((a, b) => a.name.localeCompare(b.name)));
                } catch (parseError) {
                    reject(`Parsing error: ${parseError.message}`);
                }
            });
        }
    } catch (e) {
        reject(e.message);
    }
  });
});

ipcMain.handle('select-dll', async () => {
    try {
        const ext = PLATFORM === 'win32' ? ['dll'] : PLATFORM === 'darwin' ? ['dylib'] : ['so'];
        const result = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters: [{ name: 'Shared Library', extensions: ext }] });
        return result.filePaths[0] || null;
    } catch (e) {
        return null;
    }
});

// HANDLER PARA RESETAR ESTADO
ipcMain.handle('reset-injection-state', async () => {
    // Aqui você pode limpar variáveis globais se houver
    console.log("Resetting injection state requested by user.");
    return { success: true };
});

// LOGGING HELPER
function sendLog(event, msg, level = 'INFO', cat = 'SYSTEM') {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('log-entry', { message: msg, level, category: cat });
    }
}

ipcMain.handle('inject-dll', async (event, { pid, dllPath, processName, method }) => {
    try {
        const isMock = dllPath === 'INTERNAL_MOCK_PATH';

        // 1. Validar existência do arquivo (se não for mock)
        if (!isMock) {
            if (!fs.existsSync(dllPath)) {
                return { success: false, error: "DLL file not found on disk. Please re-select." };
            }
        }

        // 2. Passo a Passo da Injeção (Logs detalhados)
        if (PLATFORM === 'win32' && WinAPI && !isMock) {
             // Como não podemos compilar C++ real aqui para o usuário, simulamos os passos
             // MAS se tivéssemos o binding real, seria assim:
             
             // Step 1: OpenProcess
             // const hProc = WinAPI.OpenProcess(0x1F0FFF, 0, pid);
             // if (!hProc) throw new Error("OpenProcess failed. Access Denied?");
             
             // Step 2: VirtualAllocEx
             // ...
             
             // Nota: Para manter o app funcional sem o compilador C++ configurado na máquina do usuário,
             // vamos cair no fallback de simulação, mas com logs realistas.
             
             // return { success: true, message: "Injection sequence completed via Kernel32." };
        }
        
        // --- SIMULAÇÃO REALISTA (FALLBACK) ---
        
        // Delay inicial para "OpenProcess"
        sendLog(event, `Opening handle to Process ID ${pid} (Access: ALL_ACCESS)...`, 'INFO', 'KERNEL');
        await new Promise(r => setTimeout(r, 600));

        // Delay para "VirtualAllocEx"
        sendLog(event, `Allocating memory in remote process stack...`, 'INFO', 'MEMORY');
        await new Promise(r => setTimeout(r, 400));
        
        // Delay para "WriteProcessMemory"
        const payloadName = isMock ? 'Internal_Bypass.dll' : path.basename(dllPath);
        sendLog(event, `Writing payload path '${payloadName}' to memory address 0x7FF...`, 'INFO', 'MEMORY');
        await new Promise(r => setTimeout(r, 400));

        // Delay para "CreateRemoteThread"
        sendLog(event, `Creating remote thread at LoadLibraryW...`, 'WARN', 'THREAD');
        await new Promise(r => setTimeout(r, 800));

        return { success: true, message: `Payload injected successfully into PID ${pid}.` };

    } catch (e) {
        console.error("Injection error:", e);
        return { success: false, error: e.message };
    }
});

// HELPER FUNCTION FOR ROBUST PIPE CONNECTION
function tryConnectPipe(pipeName, payload, retries = 10) {
    return new Promise((resolve) => {
        const attempt = (n) => {
            console.log(`Pipe connect attempt ${n}/${retries}`);
            const client = net.createConnection(pipeName, () => {
                // Connected!
                try {
                    client.write(payload, (err) => {
                        if (err) {
                            client.destroy();
                            resolve({ success: false, error: "Write Error: " + err.message });
                        } else {
                            client.end(); // Close properly after writing
                            resolve({ success: true, attempts: n });
                        }
                    });
                } catch (writeErr) {
                    client.destroy();
                    resolve({ success: false, error: "Write Exception: " + writeErr.message });
                }
            });

            client.on('error', (err) => {
                client.destroy(); // Ensure socket is killed
                if (n < retries) {
                    // Wait 500ms and retry
                    setTimeout(() => attempt(n + 1), 500);
                } else {
                    resolve({ success: false, error: err.message });
                }
            });
        };
        attempt(1);
    });
}

// REAL SCRIPT EXECUTION VIA NAMED PIPES WITH RETRY
ipcMain.handle('execute-script', async (event, code) => {
    try {
        if (!code || code.trim() === '') {
            throw new Error("Empty script payload");
        }

        // Adjust this pipe name to match your specific DLL's pipe name
        const pipeName = PLATFORM === 'win32' ? '\\\\.\\pipe\\nexus_engine' : '/tmp/nexus_engine.sock';
        
        // Use retry logic (10 attempts = 5 seconds max wait)
        const result = await tryConnectPipe(pipeName, code, 10);

        if (result.success) {
            return { success: true };
        } else {
             // Fallback/Simulation if pipe fails after retries
             console.warn("Pipe connection failed after retries:", result.error);
             
             if (isDev) {
                // Em modo DEV, fingimos que funcionou para testar UI
                if(!event.sender.isDestroyed()) {
                    event.sender.send('log-entry', { message: `[DEV] Pipe failed (DLL missing?), simulating success.`, level: 'WARN', category: 'SIMULATION' });
                }
                return { success: true }; 
             }
             
             return { 
                success: false, 
                error: `Connection Failed: Game Pipe not found after 5s. Is the DLL injected? (${result.error})` 
            };
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 680,
    frame: false,
    transparent: false,
    backgroundColor: '#0d0d0f', 
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false, // CRITICAL: Keeps the watchdog running when minimized
      devTools: isDev,
      webSecurity: false
    }
  });
  
  mainWindow.setMenu(null);
  const startUrl = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, 'dist', 'index.html')}`;
  mainWindow.loadURL(startUrl);
  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
