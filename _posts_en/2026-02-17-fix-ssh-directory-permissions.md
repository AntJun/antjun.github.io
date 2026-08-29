---
title: Fix Permissions for the Current User's .ssh Directory (Linux Bash / Windows CMD / PowerShell)
date: 2026-02-17
permalink: /en/2026/02/17/fix-ssh-directory-permissions.html
key: 20260217-en
tags: ["Technology", "Tutorial", "SSH", "Linux", "Windows", "PowerShell"]
author: Akira Ant
---

On Linux, macOS, and Windows, SSH imposes basic permission requirements on the `.ssh` directory, private keys, and configuration files. If permissions are too broad, OpenSSH may refuse to read a private key or report `Bad owner or permissions`.
{:.info}

<!--more-->

This guide provides commands for repairing the current user's `.ssh` directory on:

- Linux/macOS: `~/.ssh`
- Windows: `%USERPROFILE%\.ssh`

Three execution methods are included:

- Bash: a one-liner and `fix_ssh_perms.sh`
- CMD: a one-liner and `fix_ssh_perms.bat`
- PowerShell: a one-liner and `fix_ssh_perms.ps1`

These commands only process an existing `.ssh` directory under the current user's profile. They do not create new SSH keys. The Windows versions remove inherited ACLs from the entire `.ssh` tree and retain Full Control only for the current user and `SYSTEM`. If your `.ssh` directory is subject to special sharing requirements or domain policies, review them before running the commands.
{:.warning}

---

## Linux / macOS (Bash)

### Permission Rules

The following permissions are commonly used on POSIX systems:

- Directories: `700`
- Regular files by default: `600`
- Public keys: `*.pub` -> `644`
- Known-hosts files: `known_hosts*` -> `644`

Using `600` as the default for regular files provides a secure baseline for private keys, `config`, `authorized_keys`, and similar files.

### Bash One-Liner

```bash
SSH="$HOME/.ssh"; [ -d "$SSH" ] && chmod 700 "$SSH" && find "$SSH" -type d -exec chmod 700 {} + && find "$SSH" -type f -exec chmod 600 {} + && find "$SSH" -type f \( -name "*.pub" -o -name "known_hosts" -o -name "known_hosts.old" -o -name "known_hosts2" -o -name "known_hosts2.old" \) -exec chmod 644 {} +
```

### Script: `fix_ssh_perms.sh`

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

Run it with:

```bash
bash fix_ssh_perms.sh
```

## Windows CMD (`icacls`)

### ACL Rules

For `%USERPROFILE%\.ssh` and all of its descendants:

- Remove inherited permissions: `/inheritance:r`
- Grant permissions only to:
  - Current user: Full Control
  - `SYSTEM`: Full Control

Windows OpenSSH generally requires that other users and groups cannot read the `.ssh` directory or private keys. The commands below apply this stricter ACL across the entire `.ssh` tree.

### CMD One-Liner

Run this in CMD:

```cmd
cmd /v:on /c "set ""SSH=%USERPROFILE%\.ssh"" & set ""ME=%USERDOMAIN%\%USERNAME%"" & if not exist ""!SSH!"" (echo No .ssh directory: ""!SSH!"" & exit /b 0) & takeown /f ""!SSH!"" /r /d y >nul & icacls ""!SSH!"" /reset /t /c >nul & icacls ""!SSH!"" /inheritance:r /grant:r ""!ME!:(OI)(CI)F"" ""SYSTEM:(OI)(CI)F"" /t /c >nul & for /r ""!SSH!"" %F in (*) do @icacls ""%F"" /inheritance:r /grant:r ""!ME!:F"" ""SYSTEM:F"" /c >nul & echo OK: ""!SSH!"""
```

The command uses `cmd /v:on` to enable delayed environment-variable expansion. This prevents `%SSH%` from being expanded too early when it is assigned and used on the same command line.

### Script: `fix_ssh_perms.bat`

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

Run it with:

```cmd
fix_ssh_perms.bat
```

## Windows PowerShell (`icacls`)

### PowerShell One-Liner

```powershell
$ssh=Join-Path $env:USERPROFILE ".ssh";if(!(Test-Path $ssh)){"No .ssh directory: $ssh";exit};$me=(whoami);takeown /f $ssh /r /d y|Out-Null;icacls $ssh /reset /t /c|Out-Null;icacls $ssh /inheritance:r /grant:r ($me+":(OI)(CI)F") "SYSTEM:(OI)(CI)F" /t /c|Out-Null;Get-ChildItem -LiteralPath $ssh -Recurse -File -Force|%{icacls $_.FullName /inheritance:r /grant:r ($me+":F") "SYSTEM:F" /c|Out-Null};"OK: $ssh"
```

### Script: `fix_ssh_perms.ps1`

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

If the PowerShell execution policy blocks the script, bypass it for this invocation only:

```powershell
powershell -ExecutionPolicy Bypass -File .\fix_ssh_perms.ps1
```
