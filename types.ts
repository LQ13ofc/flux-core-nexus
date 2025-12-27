
export enum AppView {
  DASHBOARD = 'dashboard',
  EDITOR = 'editor',
  SECURITY = 'security',
  PLUGINS = 'plugins',
  LOGS = 'logs'
}

export type LanguageRuntime = 'lua' | 'python' | 'js' | 'csharp' | 'cpp' | 'c' | 'auto';

export interface SystemStats {
  processStatus: 'INACTIVE' | 'ATTACHING' | 'ACTIVE' | 'ERROR';
  targetProcess: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  category: string;
}

export interface HWIDProfile {
  smbios: string;
  diskId: string;
  mac: string;
  gpu: string;
}

export interface PluginModule {
  id: LanguageRuntime;
  name: string;
  description: string;
  type: 'Engine' | 'Wrapper' | 'JIT';
  enabled: boolean;
}
