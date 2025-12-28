
import React, { createContext, useContext, useState } from 'react';

interface Log {
    msg: string;
    type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN';
    time: string;
}

interface InjectionContextType {
    logs: Log[];
    addLog: (msg: string, type?: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN') => void;
    processName: string;
    setProcessName: (name: string) => void;
    dllPath: string;
    setDllPath: (path: string) => void;
    method: number;
    setMethod: (m: number) => void;
    status: string;
    setStatus: (s: string) => void;
    isInjecting: boolean;
    setIsInjecting: (b: boolean) => void;
}

const InjectionContext = createContext<InjectionContextType | undefined>(undefined);

export const InjectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [processName, setProcessName] = useState('RobloxPlayerBeta.exe');
    const [dllPath, setDllPath] = useState('');
    const [method, setMethod] = useState(0);
    const [status, setStatus] = useState('Ready');
    const [isInjecting, setIsInjecting] = useState(false);

    const addLog = (msg: string, type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN' = 'INFO') => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { msg, type, time }]);
    };

    return (
        <InjectionContext.Provider value={{ 
            logs, addLog, 
            processName, setProcessName, 
            dllPath, setDllPath,
            method, setMethod,
            status, setStatus,
            isInjecting, setIsInjecting
        }}>
            {children}
        </InjectionContext.Provider>
    );
};

export const useInjection = () => {
    const context = useContext(InjectionContext);
    if (!context) throw new Error("useInjection must be used within InjectionProvider");
    return context;
};
