import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import crypto from 'crypto';
import './ipc-handlers';

// Explicit type declaration for global
declare const __dirname: string;

const isDev = process.env.NODE_ENV === 'development';

// 1. Disable Hardware Acceleration to prevent rendering glitches
app.disableHardwareAcceleration();

// 2. Prevent Multiple Instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  (process as any).exit(0);
}

// 3. Randomize Process info to evade simple detections
const randomProcessName = () => {
  const names = ['ServiceHost', 'RuntimeBroker', 'TaskHostW', 'ApplicationFrameHost'];
  return names[Math.floor(Math.random() * names.length)];
};
// app.setName(randomProcessName()); // Note: Can cause issues on some platforms, use with caution

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    frame: false,
    resizable: true,
    backgroundColor: '#0d0d0f',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // CRITICAL SECURITY
      sandbox: true,
      devTools: isDev,
      webSecurity: true
    }
  });

  // Security: Block Navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://') && !isDev) {
        event.preventDefault();
    }
  });

  // Security: Block New Windows
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Window Control Handlers
  ipcMain.on('window-minimize', () => mainWindow?.minimize());
  ipcMain.on('window-maximize', () => {
      if (mainWindow?.isMaximized()) mainWindow.unmaximize();
      else mainWindow?.maximize();
  });
  ipcMain.on('window-close', () => mainWindow?.close());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if ((process as any).platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

export { mainWindow };