

export enum InjectionMethod {
  MANUAL_MAP = 0,
  PROCESS_HOLLOWING = 1,
  THREAD_HIJACKING = 2,
  APC_INJECTION = 3
}

export type Platform = 'win32' | 'linux' | 'darwin';

export interface InjectionConfig {
  processName: string;
  dllPath: string;
  method: InjectionMethod;
}

export interface InjectionResult {
  success: boolean;
  pid?: number;
  error?: string;
  log?: string[];
}

export interface ProcessInfo {
  pid: number;
  name: string;
  memory: string;
  title: string;
  user?: string;
  path?: string;
}

export interface FluxAPI {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
  getProcesses: () => Promise<ProcessInfo[]>;
  
  // Overloaded inject to support different usage patterns across the app
  inject(config: InjectionConfig): Promise<InjectionResult>;
  inject(pid: number, dllPath: string, settings: any): Promise<{ success: boolean; error?: string }>;
  
  selectFile: () => Promise<string | null>;
  
  // Updated onLog to match object-based log data usage
  onLog: (callback: (data: { message: string, level: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN', category: string }) => void) => void;
  
  // Added missing methods referenced in components
  getPlatform: () => Promise<string>;
  getBundledDLL: () => Promise<string>;
  onPhaseUpdate: (callback: (phase: number) => void) => void;
  executeScript: (script: string) => Promise<{ success: boolean; error?: string }>;
  saveSettings: (settings: any) => Promise<boolean>;
  loadSettings: () => Promise<any>;
}

declare global {
  interface Window {
    fluxAPI: FluxAPI;
  }
}