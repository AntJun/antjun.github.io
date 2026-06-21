---
title: 修复当前用户 .ssh 目录权限（Linux Bash / Windows CMD / PowerShell）
tags: ["技术", "教程", "SSH", "Linux", "Windows", "PowerShell"]
key: 20260217
author: Akira Ant
---

在 Linux、macOS 和 Windows 上，SSH 对 `.ssh` 目录、私钥和配置文件的权限都有基本要求。权限过宽时，OpenSSH 可能会拒绝读取私钥，或者提示 `Bad owner or permissions`。
{:.info}

<!--more-->

本文整理了针对当前用户 `.ssh` 目录的一组修复命令，覆盖：

- Linux/macOS：`~/.ssh`
- Windows：`%USERPROFILE%\.ssh`

提供三种执行方式：

- Bash：one-liner 和 `fix_ssh_perms.sh`
- CMD：one-liner 和 `fix_ssh_perms.bat`
- PowerShell：one-liner 和 `fix_ssh_perms.ps1`

这些命令只处理当前用户目录下已有的 `.ssh` 目录，不会自动创建新的 SSH 密钥。Windows 版本会移除 `.ssh` 树上的继承 ACL，只保留当前用户与 `SYSTEM` 的完全控制权限；如果你的 `.ssh` 目录有特殊共享或域策略要求，执行前请先确认。
{:.warning}

---

## Linux / macOS（Bash）

### 权限规则

POSIX 系统中通常使用下面的权限：

- 目录：`700`
- 普通文件默认：`600`
- 公钥：`*.pub` -> `644`
- 已知主机文件：`known_hosts*` -> `644`

将普通文件默认设为 `600` 是安全基线，适用于私钥、`config`、`authorized_keys` 等文件。

### 单条 Bash 命令

```bash
SSH="$HOME/.ssh"; [ -d "$SSH" ] && chmod 700 "$SSH" && find "$SSH" -type d -exec chmod 700 {} + && find "$SSH" -type f -exec chmod 600 {} + && find "$SSH" -type f \( -name "*.pub" -o -name "known_hosts" -o -name "known_hosts.old" -o -name "known_hosts2" -o -name "known_hosts2.old" \) -exec chmod 644 {} +
```

### 脚本版本：`fix_ssh_perms.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

SSH_DIR="${HOME}/.ssh"

if [[ ! -d "${SSH_DIR}" ]]; then
  echo "No .ssh directory: ${SSH_DIR}"
  exit 0
fi

chmod 700 "${SSH_DIR}"

find "${SSH_DIR}" -type d -exec chmod 700 {} +
find "${SSH_DIR}" -type f -exec chmod 600 {} +
find "${SSH_DIR}" -type f \( \
  -name "*.pub" -o \
  -name "known_hosts" -o \
  -name "known_hosts.old" -o \
  -name "known_hosts2" -o \
  -name "known_hosts2.old" \
\) -exec chmod 644 {} +

echo "SSH permissions fixed under: ${SSH_DIR}"
```

运行：

```bash
bash fix_ssh_perms.sh
```

## Windows CMD（`icacls`）

### ACL 规则

对 `%USERPROFILE%\.ssh` 及其所有子项：

- 移除继承权限：`/inheritance:r`
- 仅授予：
  - 当前用户：Full Control
  - `SYSTEM`：Full Control

Windows OpenSSH 通常要求 `.ssh` 及私钥文件不能被其他用户或组读取。下面的命令会用更严格的方式覆盖整个 `.ssh` 树的 ACL。

### 单条 CMD 命令

在 CMD 中执行：

```cmd
cmd /v:on /c "set ""SSH=%USERPROFILE%\.ssh"" & set ""ME=%USERDOMAIN%\%USERNAME%"" & if not exist ""!SSH!"" (echo No .ssh directory: ""!SSH!"" & exit /b 0) & takeown /f ""!SSH!"" /r /d y >nul & icacls ""!SSH!"" /reset /t /c >nul & icacls ""!SSH!"" /inheritance:r /grant:r ""!ME!:(OI)(CI)F"" ""SYSTEM:(OI)(CI)F"" /t /c >nul & for /r ""!SSH!"" %F in (*) do @icacls ""%F"" /inheritance:r /grant:r ""!ME!:F"" ""SYSTEM:F"" /c >nul & echo OK: ""!SSH!"""
```

这里使用 `cmd /v:on` 开启延迟变量展开，避免在同一行中先 `set` 后使用 `%SSH%` 时被过早展开。

### 脚本版本：`fix_ssh_perms.bat`

```bat
@echo off
setlocal

set "SSH=%USERPROFILE%\.ssh"
set "ME=%USERDOMAIN%\%USERNAME%"

if not exist "%SSH%" (
  echo No .ssh directory: "%SSH%"
  exit /b 0
)

takeown /f "%SSH%" /r /d y >nul
icacls "%SSH%" /reset /t /c >nul

icacls "%SSH%" /inheritance:r /grant:r "%ME%:(OI)(CI)F" "SYSTEM:(OI)(CI)F" /t /c >nul

for /r "%SSH%" %%F in (*) do (
  icacls "%%F" /inheritance:r /grant:r "%ME%:F" "SYSTEM:F" /c >nul
)

echo OK: "%SSH%"
endlocal
```

运行：

```cmd
fix_ssh_perms.bat
```

## Windows PowerShell（`icacls`）

### 单条 PowerShell 命令

```powershell
$ssh=Join-Path $env:USERPROFILE ".ssh";if(!(Test-Path $ssh)){"No .ssh directory: $ssh";exit};$me=(whoami);takeown /f $ssh /r /d y|Out-Null;icacls $ssh /reset /t /c|Out-Null;icacls $ssh /inheritance:r /grant:r ($me+":(OI)(CI)F") "SYSTEM:(OI)(CI)F" /t /c|Out-Null;Get-ChildItem -LiteralPath $ssh -Recurse -File -Force|%{icacls $_.FullName /inheritance:r /grant:r ($me+":F") "SYSTEM:F" /c|Out-Null};"OK: $ssh"
```

### 脚本版本：`fix_ssh_perms.ps1`

```powershell
$ssh = Join-Path $env:USERPROFILE ".ssh"
if (!(Test-Path $ssh)) {
  "No .ssh directory: $ssh"
  exit
}

$me = whoami

takeown /f $ssh /r /d y | Out-Null
icacls $ssh /reset /t /c | Out-Null
icacls $ssh /inheritance:r /grant:r ($me + ":(OI)(CI)F") "SYSTEM:(OI)(CI)F" /t /c | Out-Null

Get-ChildItem -LiteralPath $ssh -Recurse -File -Force | ForEach-Object {
  icacls $_.FullName /inheritance:r /grant:r ($me + ":F") "SYSTEM:F" /c | Out-Null
}

"OK: $ssh"
```

如果 PowerShell 执行策略限制脚本运行，可以对本次执行临时绕过：

```powershell
powershell -ExecutionPolicy Bypass -File .\fix_ssh_perms.ps1
```
