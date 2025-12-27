
export enum AppView {
  DASHBOARD = 'dashboard',
  EDITOR = 'editor',
  SECURITY = 'security',
  PLUGINS = 'plugins',
  LOGS = 'logs',
  SETTINGS = 'settings'
}

export type LanguageRuntime = 'lua' | 'python' | 'js' | 'csharp' | 'cpp' | 'c' | 'asm' | 'java' | 'auto';
export type Platform = 'win32' | 'linux' | 'darwin' | 'arm64';
export type ComplexityMode = 'SIMPLE' | 'COMPLEX';
export type ExecutionStrategy = 'INTERNAL' | 'EXTERNAL' | 'KERNEL' | 'DMA_HARDWARE' | 'HYPERVISOR';

export interface ScriptParam {
  id: string;
  label: string;
  type: 'text' | 'number' | 'slider';
  value: string | number;
  min?: number;
  max?: number;
}

export interface GameScript {
  id: string;
  name: string;
  enabled: boolean;
  qolFeatures?: string[];
  params?: ScriptParam[];
}

export interface GamePack {
  id: string;
  name: string;
  processName: string;
  engine: string;
  runtime: LanguageRuntime;
  bypassMethod: string;
  scripts: GameScript[];
  installed: boolean;
  supportedPlatforms: Platform[];
}

export interface SystemAnalysis {
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  message: string;
  missingPlugin?: string;
  bridgeRequired: boolean;
}

export interface SystemStats {
  processStatus: 'INACTIVE' | 'ATTACHING' | 'ACTIVE' | 'ERROR' | 'PANIC' | 'FAIL_SILENT';
  targetProcess: string;
  detectedGame?: GamePack;
  currentPlatform: Platform;
  remoteMode: boolean;
  complexity: ComplexityMode;
  analysis: SystemAnalysis;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'CRITICAL';
  message: string;
  category: string;
}

export interface PluginModule {
  id: LanguageRuntime;
  name: string;
  description: string;
  type: 'Engine' | 'Wrapper' | 'JIT';
  enabled: boolean;
  version: string;
}

export interface DMAConfig {
  enabled: boolean;
  device: 'LeetDMA' | 'RaptorDMA' | 'Squirrel' | 'Software_Emulated';
  firmwareType: 'Custom' | 'Generic' | 'Pooled';
}

export interface NetworkConfig {
  packetEncryption: boolean;
  proxyEnabled: boolean;
  latencySimulation: number; // ms
}

export interface AppSettings {
  // General
  autoInject: boolean;
  stealthMode: boolean;
  
  // Kernel / Security
  antiOBS: boolean;
  memoryBuffer: number;
  kernelPriority: boolean;
  executionStrategy: ExecutionStrategy;
  
  // Advanced Hardware/Net
  dma: DMAConfig;
  network: NetworkConfig;
}

export interface HWIDProfile {
  smbios: string;
  diskId: string;
  mac: string;
  gpu: string;
  arp: string;
}

export interface SecurityModule {
  id: string;
  label: string;
  desc: string;
  lang: LanguageRuntime[];
  active: boolean;
  riskLevel: 'SAFE' | 'RISKY' | 'EXTREME' | 'GOD';
  category: 'MEMORY' | 'KERNEL' | 'NETWORK' | 'HARDWARE';
}
