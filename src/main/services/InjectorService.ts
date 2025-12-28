

import { InjectionConfig, InjectionResult, InjectionMethod } from '../../types';
// We import the same injector wrapper used in main (conceptual)
// In a real TS setup, we'd structure this better, but here we interface with the global/singleton injector logic
declare const require: any;
const RobloxInjector = require('../../injector.js'); 

export class InjectorService {
  private static instance: InjectorService;

  private constructor() {}

  static getInstance(): InjectorService {
    if (!InjectorService.instance) {
      InjectorService.instance = new InjectorService();
    }
    return InjectorService.instance;
  }

  async findProcess(processName: string): Promise<number> {
    // Utilize the robust list fetcher from injector.js which handles multiple OS and filtering
    const processes = await RobloxInjector.getProcessList();
    const target = processes.find((p: any) => p.name.toLowerCase() === processName.toLowerCase());
    return target ? target.pid : 0;
  }

  async inject(config: InjectionConfig): Promise<InjectionResult> {
    try {
      // 1. Strict Validation
      const pid = await this.findProcess(config.processName);
      
      if (pid === 0) {
        throw new Error(`Target '${config.processName}' is not running.`);
      }

      // 2. Real Injection Execution
      // We pass the method to the low-level injector (ManualMap, ThreadHijack, etc)
      const result = await RobloxInjector.inject(pid, config.dllPath);

      if (result.success) {
          return { success: true, pid };
      } else {
          throw new Error(result.error || "Unknown Low-Level Injection Failure");
      }

    } catch (error: any) {
      console.error("[INJECTOR-CORE] Failure:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}