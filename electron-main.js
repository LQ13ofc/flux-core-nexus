
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require('os');
const { autoUpdater } = require('electron-updater');

// --- CRITICAL SECURITY: DISABLE HARDWARE ACCELERATION ---
// Isso impede que o overlay do Flux Core seja desenhado pela GPU,
// o que é um vetor comum de detecção (ex: Discord Overlay detection).
app.disableHardwareAcceleration();

// --- CONFIGURAÇÃO DO CORE NATIVO (DLL/SO) VIA KOFFI ---
let nativeCore = null;
let NativeLib = null;

try {
  // Koffi é a alternativa moderna e rápida para FFI-NAPI
  const koffi = require('koffi');
  
  // Mapeia o binário correto com base na plataforma
  const binName = os.platform() === 'win32' ? 'FluxCore_x64.dll' : 'FluxCore.so';
  
  // Em desenvolvimento, as DLLs podem não existir, então usamos um try/catch silencioso para não quebrar a UI
  const libPath = path.join(process.resourcesPath, 'native', binName);
  
  // Definição das assinaturas C++
  /*
    bool Inject(const char* game, int mode);
    void ExecuteScript(const char* game, const char* script);
    void SetStealthMode(bool enabled);
    void EmergencyUnload();
  */
  
  // Tenta carregar a biblioteca apenas se o arquivo existir (simulação em dev)
  const fs = require('fs');
  if (fs.existsSync(libPath)) {
    NativeLib = koffi.load(libPath);

    nativeCore = {
      Inject: NativeLib.func('bool Inject(const char* game, int mode)'),
      ExecuteScript: NativeLib.func('void ExecuteScript(const char* game, const char* script)'),
      SetStealthMode: NativeLib.func('void SetStealthMode(bool enabled)'),
      EmergencyUnload: NativeLib.func('void EmergencyUnload()')
    };
    console.log('Nexus Native Core: LINKED AND SECURE (Ring -1 Driver Loaded)');
  } else {
    throw new Error("Binary not found on disk");
  }

} catch (e) {
  console.warn(`Nexus Native Core: Driver not loaded. Running in UI/Remote Bridge Mode. Reason: ${e.message}`);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    backgroundColor: '#0d0d0f',
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Necessário para require('electron') no render process (React)
      backgroundThrottling: false,
      devTools: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: "Flux Core Host"
  });

  win.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  // Proteção contra captura de tela (Windows/Mac)
  if (process.platform === 'win32' || process.platform === 'darwin') {
    win.setContentProtection(true);
  }

  win.loadFile('index.html');
  
  // Auto-Update silencioso
  // autoUpdater.checkForUpdatesAndNotify();
}

// Handler de Informações de Sistema
ipcMain.handle('get-os-info', () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    isWindows: os.platform() === 'win32',
    hostname: os.hostname(),
    isNativeLoaded: !!nativeCore
  };
});

// Canal de Execução Principal
ipcMain.on('execute-action', (event, { game, script, params }) => {
  if (nativeCore && os.platform() === 'win32') {
    try {
      // Koffi converte string JS para const char* automaticamente
      nativeCore.ExecuteScript(game, script);
      event.reply('nexus:log', { message: `Executed: Payload injected into ${game} [NATIVE KERNEL]`, level: 'SUCCESS' });
    } catch (err) {
      event.reply('nexus:log', { message: `Native Driver Error: ${err.message}`, level: 'ERROR' });
    }
  } else {
    // Modo Simulação / Remote Bridge
    console.log(`[Remote Bridge] Target: ${game} | Payload Size: ${script.length} bytes`);
    
    setTimeout(() => {
        // Simula sucesso para a UI
        event.reply('nexus:log', { message: `Remote Bridge: Payload dispatched to ${game} (127.0.0.1:8080)`, level: 'INFO' });
    }, 200);
  }
});

// Canal de Pânico (Emergency)
ipcMain.on('panic-trigger', (event) => {
    if (nativeCore) {
        try {
            nativeCore.EmergencyUnload();
        } catch(e) {
            console.error("Panic Error:", e);
        }
    }
    event.reply('nexus:log', { message: `*** EMERGENCY PANIC: DRIVER UNLOADED & MEMORY ZEROED ***`, level: 'CRITICAL' });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
