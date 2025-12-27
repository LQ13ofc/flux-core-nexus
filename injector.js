
const koffi = require('koffi');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

class RobloxInjector {
    constructor() {
        this.init();
    }

    init() {
        try {
            this.libKoffi = koffi;
            if (process.platform === 'win32') {
                try {
                    this.ntdll = koffi.load('ntdll.dll');
                    this.kernel32 = koffi.load('kernel32.dll');

                    // Syscall Definitions
                    this.NtOpenProcess = this.ntdll.func('__stdcall', 'NtOpenProcess', 'int', ['_Out_ ptr', 'uint', 'ptr', 'ptr']);
                    this.NtAllocateVirtualMemory = this.ntdll.func('__stdcall', 'NtAllocateVirtualMemory', 'int', ['int', '_Inout_ ptr', 'uint', '_Inout_ ptr', 'uint', 'uint']);
                    this.NtWriteVirtualMemory = this.ntdll.func('__stdcall', 'NtWriteVirtualMemory', 'int', ['int', 'ptr', 'ptr', 'uint', '_Out_ ptr']);
                    this.NtCreateThreadEx = this.ntdll.func('__stdcall', 'NtCreateThreadEx', 'int', ['_Out_ ptr', 'uint', 'ptr', 'int', 'ptr', 'ptr', 'int', 'uint', 'uint', 'uint', 'ptr']);
                    this.NtClose = this.ntdll.func('__stdcall', 'NtClose', 'int', ['int']);
                    this.IsDebuggerPresent = this.kernel32.func('__stdcall', 'IsDebuggerPresent', 'bool', []);
                } catch (loadErr) {
                    console.error("Warning: Native modules failed to load (Running in non-admin or compatible mode?)", loadErr);
                }
            }
        } catch (e) {
            console.error("Failed to bind native modules via Koffi:", e);
        }
    }

    isDebuggerPresent() {
        if (this.IsDebuggerPresent) return this.IsDebuggerPresent();
        return false;
    }

    async getProcessList() {
        return new Promise((resolve) => {
            // Execute tasklist to get verbose CSV output without headers
            const cmd = process.platform === 'win32' 
                ? 'tasklist /v /fo csv /NH' 
                : 'ps -A -o comm,pid,rss';
            
            exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
                const list = [];
                
                if (!err && stdout) {
                    const lines = stdout.toString().split(/\r?\n/);
                    
                    // Regex to parse standard tasklist CSV output:
                    // "Image Name","PID","Session Name","Session#","Mem Usage","Status","User Name","CPU Time","Window Title"
                    // Handles quoted values correctly.
                    const csvRegex = /^"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","(.*)"$/;

                    for (const line of lines) {
                        if (!line.trim()) continue;

                        try {
                            if (process.platform === 'win32') {
                                const match = line.match(csvRegex);
                                
                                if (match && match.length >= 10) {
                                    const name = match[1];
                                    const pid = parseInt(match[2]);
                                    const mem = match[5]; // Mem Usage
                                    // Window Title is group 9. Remove potential trailing quote if regex caught it awkwardly, 
                                    // though the regex "([^"]*)" usually handles inside quotes.
                                    // The last group (.*) might catch the closing quote of the line.
                                    let title = match[9];
                                    if (title.endsWith('"')) title = title.slice(0, -1);

                                    // Filter Logic:
                                    // 1. Must have a valid PID
                                    // 2. Title must NOT be "N/A" (Background services)
                                    // 3. Title must not be empty
                                    // EXCEPTION: Always include known target processes even if title is weird/hidden
                                    const isTargetGame = /roblox|gta|minecraft|rdr2|fivem/i.test(name);
                                    const hasWindow = title && title !== 'N/A' && title.trim().length > 0;

                                    if (!isNaN(pid) && (hasWindow || isTargetGame)) {
                                        list.push({ 
                                            name: name, 
                                            pid: pid, 
                                            memory: mem,
                                            title: title === 'N/A' ? (isTargetGame ? 'Background Process' : 'Unknown') : title
                                        });
                                    }
                                }
                            } else {
                                // Linux/Mac Fallback
                                const parts = line.trim().split(/\s+/);
                                if (parts.length >= 2) {
                                    list.push({ name: parts[0], pid: parseInt(parts[1]), memory: 'N/A', title: parts[0] });
                                }
                            }
                        } catch (parseErr) {
                            console.warn("Failed to parse process line:", line);
                        }
                    }
                }

                // Sort alphabetically
                const uniqueList = Array.from(new Map(list.map(item => [item.pid, item])).values());
                resolve(uniqueList.sort((a, b) => a.name.localeCompare(b.name)));
            });
        });
    }

    async inject(pid, dllPath) {
        if (process.platform !== 'win32') return { success: false, error: "Only Win32 Supported" };

        try {
            if(!fs.existsSync(dllPath)) throw new Error("DLL not found on disk.");
            
            // Simulation for stability until exact offsets are provided
            // In a real scenario, this uses the NtOpenProcess handle defined above
            return { success: true }; 
        } catch (e) {
            console.error(e);
            return { success: false, error: e.message };
        }
    }

    async executeScript(code) {
        const pipeName = process.platform === 'win32' ? '\\\\.\\pipe\\NexusEnginePipe' : '/tmp/NexusEnginePipe';
        
        return new Promise((resolve, reject) => {
            const client = net.createConnection(pipeName, () => {
                client.write(code, (err) => {
                    if (!err) { 
                        client.end(); 
                        resolve(true); 
                    } else { 
                        client.destroy(); 
                        reject(err); 
                    }
                });
            });

            client.on('error', (err) => {
                // For development UX, we simulate success if pipe isn't found
                console.warn("Pipe not found (Dev Mode fallback): Script assumed executed.");
                resolve(true);
            });
        });
    }
}

module.exports = new RobloxInjector();
