# 🚀 Flux Core Nexus v4.0 - God Mode Edition

![Flux Core Banner](https://img.shields.io/badge/Flux_Core-v4.0_God_Mode-blue?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-UNDETECTED-green?style=for-the-badge) ![Platform](https://img.shields.io/badge/Platform-Windows_%7C_Linux_%7C_macOS-lightgrey?style=for-the-badge)

**Flux Core Nexus** é um ambiente de execução de scripts de última geração ("Executor") projetado para engenharia reversa, testes de penetração em jogos e modificação de comportamento em tempo real.

---

## ⚠️ AVISO LEGAL E DE RISCO

Este software é para fins **EDUCACIONAIS**. O uso em jogos online pode resultar em banimento de conta e HWID. Use por sua conta e risco.

---

## ⚡ Guia de Instalação (0% Error Rate)

Atualizamos o núcleo para usar **Koffi** em vez de FFI-NAPI, o que elimina a necessidade de compilar código C++ nativo durante a instalação. Isso corrige os erros de `node-gyp` e `MSBuild`.

### 1. Limpeza (Opcional, mas recomendado)
Se você teve erros anteriores, apague a pasta `node_modules` e o arquivo `package-lock.json`.

### 2. Instalar Dependências
Execute no terminal, na pasta raiz do projeto:

```bash
npm install
```

> **Sucesso:** O comando deve terminar sem erros vermelhos graves agora. Warnings (avisos amarelos) são normais.

### 3. Iniciar em Modo de Desenvolvimento
Para abrir a interface (UI) e conectar ao driver simulado:

```bash
npm start
```

### 4. Criar Executável (Build Final)
Para gerar o arquivo `.exe` (Windows), `.dmg` (Mac) ou `.AppImage` (Linux) automaticamente:

```bash
npm run build:auto
```

O arquivo executável será criado na pasta `dist/`.

---

## 🔧 Solução de Problemas

**Erro: `Binary not found on disk` no console**
*   Isso é normal se você não compilou a DLL C++ (`FluxCore_x64.dll`). O app entrará automaticamente em **Modo Remote Bridge**, permitindo que você use a interface e a lógica sem o driver de kernel real estar presente (seguro para desenvolvimento).

**Tela Branca ou Crash ao abrir**
*   Verifique se você está em um ambiente que suporta WebGL.
*   Tente rodar `npm run reinstall` para limpar o cache e instalar tudo do zero.

---

**Desenvolvido por Nexus Dev Team.**
