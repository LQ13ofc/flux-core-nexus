import { contextBridge, ipcRenderer } from 'electron';
import { InjectionConfig } from '../types';

contextBridge.exposeInMainWorld('fluxAPI', {
    // Platform Info
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getProcesses: () => ipcRenderer.invoke('get-processes'),
    selectFile: () => ipcRenderer.invoke('select-file'),
    getBundledDLL: () => ipcRenderer.invoke('get-bundled-dll'),
    
    // Window Management
    minimize: () => ipcRenderer.send('window-minimize'),
    toggleMaximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Core Actions (Sanitized)
    inject: (pid: number, dllPath: string, settings: any) => 
        ipcRenderer.invoke('inject', { processName: '', dllPath, method: 0, pid }), // Normalized payload

    executeScript: (script: string) => 
        ipcRenderer.invoke('execute-script', { script }),

    // Listeners
    onLog: (callback: any) => 
        ipcRenderer.on('log-entry', (_, data) => callback(data)),
        
    onPhaseUpdate: (callback: any) => 
        ipcRenderer.on('injection-phase-update', (_, phase) => callback(phase)),
    
    saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
    loadSettings: () => ipcRenderer.invoke('load-settings')
});