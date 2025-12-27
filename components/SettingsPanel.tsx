
import React from 'react';
import { 
  Settings, 
  Cloud, 
  Globe, 
  Cpu, 
  Zap, 
  Bell, 
  ShieldCheck,
  History
} from 'lucide-react';

const SettingsPanel: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">Configuration</h2>
        <p className="text-zinc-500">Adjust the environment behavior and integration parameters.</p>
      </div>

      <div className="space-y-6">
        <SettingsSection title="Execution Core" icon={<Cpu size={20} className="text-blue-500" />}>
           <SettingItem 
              label="Automatic Injection" 
              desc="Inject immediately when target process is discovered." 
              type="toggle"
           />
           <SettingItem 
              label="Bypass Mode" 
              desc="Choose detection avoidance complexity level." 
              type="select"
              options={['STEALTH', 'AGGRESSIVE', 'CUSTOM']}
           />
           <SettingItem 
              label="Memory Buffer Size" 
              desc="Allocation size for internal script buffers (MB)." 
              type="range"
              value="512"
           />
        </SettingsSection>

        <SettingsSection title="Cloud & API" icon={<Cloud size={20} className="text-purple-500" />}>
           <SettingItem 
              label="AI Script Assistance" 
              desc="Enable Gemini-powered debugging features." 
              type="toggle"
              enabled={true}
           />
           <SettingItem 
              label="Sync Profiles" 
              desc="Maintain script libraries across devices." 
              type="toggle"
           />
        </SettingsSection>

        <SettingsSection title="Interface" icon={<Zap size={20} className="text-orange-500" />}>
           <SettingItem 
              label="Dark Mode Persistence" 
              desc="Force elite dark theme globally." 
              type="toggle"
              enabled={true}
           />
           <SettingItem 
              label="Terminal Animation" 
              desc="Enable high-tech visual transitions." 
              type="toggle"
              enabled={true}
           />
        </SettingsSection>
      </div>

      <div className="pt-8 border-t border-white/5 flex items-center justify-between text-zinc-600 text-[10px] font-mono">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck size={12}/> ENCRYPTED STORAGE</span>
            <span className="flex items-center gap-1"><History size={12}/> LAST BACKUP: 2 HOURS AGO</span>
         </div>
         <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-all">
            RESTORE DEFAULTS
         </button>
      </div>
    </div>
  );
};

const SettingsSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden">
    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
       {icon}
       <h3 className="font-bold text-white text-sm uppercase tracking-widest">{title}</h3>
    </div>
    <div className="divide-y divide-white/[0.03]">
      {children}
    </div>
  </div>
);

const SettingItem: React.FC<{ label: string, desc: string, type: 'toggle' | 'select' | 'range', options?: string[], value?: string, enabled?: boolean }> = ({ label, desc, type, options, value, enabled }) => {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
       <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-200">{label}</h4>
          <p className="text-xs text-zinc-500">{desc}</p>
       </div>

       <div className="shrink-0 ml-8">
          {type === 'toggle' && (
            <div className={`w-10 h-5 rounded-full relative cursor-pointer ${enabled ? 'bg-blue-600 shadow-[0_0_10px_#3b82f644]' : 'bg-zinc-800'}`}>
               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
            </div>
          )}
          {type === 'select' && (
            <select className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-300 outline-none focus:border-blue-500">
               {options?.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          )}
          {type === 'range' && (
            <input type="range" className="w-32 accent-blue-500 h-1 bg-zinc-800 rounded-full appearance-none" />
          )}
       </div>
    </div>
  );
};

export default SettingsPanel;
