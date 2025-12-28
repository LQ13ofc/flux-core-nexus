
import { contextBridge, ipcRenderer } from 'electron';
import { InjectionConfig } from '../types';

contextBridge.exposeInMainWorld('fluxAPI', {
    minimize: () => ipcRenderer.send('window-minimize'),
    toggleMaximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    
    inject: (config: InjectionConfig) => ipcRenderer.invoke('inject', config),
    selectFile: () => ipcRenderer.invoke('select-file'),
    getProcesses: () => ipcRenderer.invoke('get-processes'),
    
    onLog: (callback: any) => ipcRenderer.on('log-entry', (_, ...args) => callback(...args))
});
