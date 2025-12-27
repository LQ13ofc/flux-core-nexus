
export enum AppView {
  DASHBOARD = 'dashboard',
  EDITOR = 'editor',
  SECURITY = 'security',
  LOGS = 'logs',
  SETTINGS = 'settings'
}

export interface SystemStats {
  cpu: number;
  memory: number;
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
