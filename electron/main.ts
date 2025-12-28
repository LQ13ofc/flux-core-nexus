import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import './services/injector.service';

const isDev = process.env.NODE_ENV === 'development';

// 1. Disable Hardware Acceleration to prevent rendering glitches
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

// 2. Prevent Multiple Instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, '../../resources/icon.ico'),
    
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js')
    },
    
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  // Security: Block Navigation
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (isDev) {
      if (!url.startsWith('http://localhost:5173')) {
        e.preventDefault();
      }
    } else {
      if (!url.startsWith('file://')) {
        e.preventDefault();
      }
    }
  });

  // Security: Prevent new windows
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // Security: Prevent downloads
  mainWindow.webContents.session.on('will-download', (e) => {
    e.preventDefault();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window Controls IPC
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window-close', () => app.quit());

// Platform IPC
ipcMain.handle('get-platform', () => process.platform);

// Lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Error Handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (!isDev) {
    dialog.showErrorBox('Fatal Error', `Application crashed: ${error.message}`);
    app.quit();
  }
});

export { mainWindow };