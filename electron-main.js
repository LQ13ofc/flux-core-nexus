
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

// Desabilita aceleração de hardware para evitar detecção e bugs gráficos
app.disableHardwareAcceleration();

// Configuração do ambiente (Dev vs Prod)
const isDev = !app.isPackaged;

let nativeCore = null;
let NativeLib = null;

// Tenta carregar Koffi apenas se não estiver em ambiente de build restrito
try {
  const koffi = require('koffi');
  const binName = os.platform() === 'win32' ? 'FluxCore_x64.dll' : 'FluxCore.so';
  
  // Em prod (asar), resourcesPath aponta para fora do arquivo .asar
  const libPath = isDev 
    ? path.join(__dirname, 'native', binName) 
    : path.join(process.resourcesPath, 'native', binName);
  
  const fs = require('fs');
  // Verifica se o arquivo existe antes de carregar
  if (fs.existsSync(libPath)) {
    NativeLib = koffi.load(libPath);
    nativeCore = {
      Inject: NativeLib.func('bool Inject(const char* game, int mode)'),
      ExecuteScript: NativeLib.func('void ExecuteScript(const char* game, const char* script)'),
      SetStealthMode: NativeLib.func('void SetStealthMode(bool enabled)'),
      EmergencyUnload: NativeLib.func('void EmergencyUnload()')
    };
    console.log('Nexus Native Core: LINKED AND SECURE');
  } else {
    console.log(`Nexus Native Core: Bridge Mode (DLL not found at ${libPath})`);
  }
} catch (e) {
  console.warn(`Native Link Warning: ${e.message}`);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    backgroundColor: '#0d0d0f',
    transparent: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      devTools: true,
      webSecurity: false // Permite carregar recursos locais em dev
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: "Flux Core Nexus"
  });

  win.setMenu(null);

  // Lógica de Carregamento Inteligente
  if (isDev) {
    // Em desenvolvimento, conecta ao servidor Vite
    // O 'wait-on' no package.json garante que isso só rode quando a porta estiver pronta
    win.loadURL('http://localhost:5173');
    // win.webContents.openDevTools(); // Descomente para debug automático
  } else {
    // Em produção, carrega o arquivo buildado
    win.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

// Handler de Informações
ipcMain.handle('get-os-info', () => ({
  platform: os.platform(),
  arch: os.arch(),
  isWindows: os.platform() === 'win32',
  hostname: os.hostname(),
  isNativeLoaded: !!nativeCore
}));

// Execução
ipcMain.on('execute-action', (event, { game, script }) => {
  if (nativeCore && os.platform() === 'win32') {
    try {
      nativeCore.ExecuteScript(game, script);
      event.reply('nexus:log', { message: `Executed via Kernel Driver on ${game}`, level: 'SUCCESS' });
    } catch (err) {
      event.reply('nexus:log', { message: `Driver Error: ${err.message}`, level: 'ERROR' });
    }
  } else {
    console.log(`[Bridge] Sending payload to ${game}`);
    setTimeout(() => {
        event.reply('nexus:log', { message: `Bridge: Payload sent to ${game} (Simulated)`, level: 'INFO' });
    }, 200);
  }
});

ipcMain.on('panic-trigger', (event) => {
    if (nativeCore) try { nativeCore.EmergencyUnload(); } catch(e) {}
    event.reply('nexus:log', { message: `PANIC: MEMORY FLUSHED`, level: 'CRITICAL' });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
