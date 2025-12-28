
import { app, ipcMain, dialog } from 'electron';
import { InjectorService } from './services/InjectorService';
import { InjectionConfig } from '../types';

const injector = InjectorService.getInstance();

ipcMain.handle('inject', async (event, config: InjectionConfig) => {
    return await injector.inject(config);
});

ipcMain.handle('get-processes', async () => {
    // Basic process list for dropdowns if needed, implemented simply for now
    return []; 
});

ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Dynamic Link Libraries', extensions: ['dll'] }]
    });
    return result.canceled ? null : result.filePaths[0];
});
