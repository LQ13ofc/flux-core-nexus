import { GamePack, PluginModule } from '../../types';

export const INITIAL_RUNTIMES: PluginModule[] = [
  { id: 'lua', name: 'Luau (Roblox/FiveM)', description: 'JIT-compilado Lua 5.1 com suporte a Task Scheduler customizado.', enabled: true, version: '5.1-Hyperion', type: 'Scripting' },
  { id: 'c', name: 'C Native (TCC)', description: 'Compilação em tempo real (TinyCC) para manipulação direta de memória.', enabled: true, version: '0.9.27', type: 'Low Level' },
  { id: 'cpp', name: 'C++ (Clang JIT)', description: 'Execução de código C++ moderno com acesso a ponteiros e VMT.', enabled: true, version: 'LLVM 16', type: 'Native' },
  { id: 'csharp', name: 'C# (Mono/CLR)', description: 'Injeção de Assembly .NET para jogos Unity (Mono/Il2Cpp).', enabled: true, version: '.NET 8.0', type: 'Managed' },
  { id: 'js', name: 'JavaScript (V8)', description: 'Engine V8 isolada para lógica de automação e macros externas.', enabled: true, version: 'V8 11.4', type: 'Scripting' },
  { id: 'java', name: 'Java (JNI Bridge)', description: 'Ponte JNI para Minecraft e jogos baseados em JVM.', enabled: false, version: 'JDK 21', type: 'VM' },
  { id: 'asm', name: 'x64 Assembly', description: 'Execução direta de mnemonics via Flat Assembler (FASM).', enabled: true, version: '1.73', type: 'Machine Code' },
];

export const INITIAL_GAME_LIBRARY: GamePack[] = [
  { 
      id: 'roblox', 
      name: 'Roblox (Hyperion)', 
      processName: 'RobloxPlayerBeta.exe', 
      installed: true,
      engine: 'Luau (Hyperion V4 Bypass)',
      bypassMethod: 'Indirect Syscalls + Thread Hijacking',
      scripts: [
          { id: 'r1', name: 'Dex Explorer V4', enabled: false, code: '-- Dex Explorer Loadstring' },
          { id: 'r2', name: 'Remote Spy', enabled: false, code: '-- Remote Spy Logic' },
          { id: 'r3', name: 'Infinite Yield', enabled: true, code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()' }
      ]
  },
  {
      id: 'gta5',
      name: 'GTA V Singleplayer',
      processName: 'GTA5.exe',
      installed: true,
      engine: 'RAGE Engine (Native Hook)',
      bypassMethod: 'Scripthook Pattern Bypass',
      scripts: [
          { id: 'g1', name: 'Invisibility', enabled: false, code: 'PLAYER::SET_ENTITY_VISIBLE(PLAYER::PLAYER_PED_ID(), false, false);' },
          { id: 'g2', name: 'God Mode', enabled: false, code: 'PLAYER::SET_PLAYER_INVINCIBLE(PLAYER::PLAYER_ID(), true);' },
          { id: 'g3', name: 'Super Jump', enabled: false, code: 'GAMEPLAY::SET_SUPER_JUMP_THIS_FRAME(PLAYER::PLAYER_ID());' },
          { id: 'g4', name: 'Explosive Ammo', enabled: false, code: 'GAMEPLAY::SET_EXPLOSIVE_AMMO_THIS_FRAME(PLAYER::PLAYER_ID());' },
          { id: 'g5', name: 'Wanted Level 0', enabled: true, code: 'PLAYER::SET_PLAYER_WANTED_LEVEL(PLAYER::PLAYER_ID(), 0, false); PLAYER::SET_PLAYER_WANTED_LEVEL_NOW(PLAYER::PLAYER_ID(), false);' },
          { id: 'g6', name: 'Teleport to Waypoint', enabled: false, code: 'local blip = UI::GET_FIRST_BLIP_INFO_ID(8); if (UI::DOES_BLIP_EXIST(blip)) { local coord = UI::GET_BLIP_COORDS(blip); ENTITY::SET_ENTITY_COORDS(PLAYER::PLAYER_PED_ID(), coord.x, coord.y, coord.z + 1.0, 0, 0, 0, 1); }' },
          { id: 'g7', name: 'Max Health & Armor', enabled: false, code: 'ENTITY::SET_ENTITY_HEALTH(PLAYER::PLAYER_PED_ID(), 200); PED::SET_PED_ARMOUR(PLAYER::PLAYER_PED_ID(), 100);' }
      ]
  },
  {
      id: 'rdr2',
      name: 'RDR 2 Singleplayer',
      processName: 'RDR2.exe',
      installed: true,
      engine: 'RAGE Engine (Native Hook)',
      bypassMethod: 'VMT Shadow Hook',
      scripts: [
          { id: 'rd1', name: 'Infinite Ammo', enabled: false, code: 'WEAPON::SET_PED_INFINITE_AMMO(PLAYER::PLAYER_PED_ID(), true, 0);' },
          { id: 'rd2', name: 'Infinite Dead Eye', enabled: false, code: 'PLAYER::_SET_PLAYER_DEAD_EYE_REGEN_ENABLED(PLAYER::PLAYER_ID(), true); PLAYER::RESTORE_PLAYER_DEAD_EYE(PLAYER::PLAYER_ID(), 100.0);' },
          { id: 'rd3', name: 'Horse Stamina', enabled: true, code: 'PED::_SET_PED_STAMINA(PLAYER::GET_MOUNT(PLAYER::PLAYER_PED_ID()), 100.0);' },
          { id: 'rd4', name: 'Never Wanted', enabled: false, code: 'PLAYER::SET_WANTED_LEVEL_MULTIPLIER(0.0);' },
          { id: 'rd5', name: 'Teleport to Waypoint', enabled: false, code: 'local blip = MAP::GET_WAYPOINT_BLIP_ENUM_ID(); -- Internal TP Logic' },
          { id: 'rd6', name: 'Reveal Map', enabled: false, code: 'MAP::SET_MINIMAP_REVEAL_LOCKED(false); MAP::REVEAL_MINIMAP_FOW(0);' },
          { id: 'rd7', name: 'Add $1000', enabled: false, code: 'MONEY::_MONEY_ADD_CASH(100000);' }
      ]
  }
];