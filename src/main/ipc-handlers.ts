
import { ipcMain } from 'electron';
import path from 'path';
import Injector from './injector';
import { InjectionPayload, ScriptPayload } from '../types';

// Mock Encryption for demonstration (Replace with real shared-secret exchange in production)
// In a real scenario, keys should be exchanged securely via preload.
const decryptPayload = (data: any) => data; // Placeholder

ipcMain.handle('get-platform', () => process.platform);

ipcMain.handle('get-bundled-dll', async () => {
    // Handle differences between Dev and Prod paths
    const basePath = process.env.NODE_ENV === 'development' 
        ? path.join(process.cwd(), 'assets') 
        : path.join(process.resourcesPath, 'assets');
    return path.join(basePath, 'flux-core-engine.dll');
});

ipcMain.handle('get-processes', async () => {
    return await Injector.getProcessList();
});

ipcMain.handle('inject-dll', async (_, encryptedPayload: string) => {
    const data = decryptPayload(JSON.parse(encryptedPayload)) as InjectionPayload;
    if (!data || !data.pid) return { success: false, error: "Invalid payload" };
    
    try {
        return await Injector.inject(data.pid, data.dllPath);
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('execute-script', async (_, encryptedPayload: string) => {
    const data = decryptPayload(JSON.parse(encryptedPayload)) as ScriptPayload;
    if (!data || !data.script) return { success: false, error: "Invalid payload" };
    
    try {
        await Injector.executeScript(data.script);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});
