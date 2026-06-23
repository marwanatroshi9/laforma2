# Builds a clean delivery ZIP for a buyer.
# Strips secrets, dev databases, uploaded media, and all build/dependency
# folders so the buyer gets pristine source they can build themselves.
#
# Usage (from the project root):
#   powershell -ExecutionPolicy Bypass -File scripts\package.ps1

$ErrorActionPreference = "Stop"

$root    = Split-Path -Parent $PSScriptRoot
$name    = "archipelago-platform"
$stamp   = Get-Date -Format "yyyy-MM-dd"
$time    = Get-Date -Format 'yyyyMMddHHmmss'
$staging = Join-Path $env:TEMP "$name-build-$time"
$zip     = Join-Path $root "$name-$stamp-$time.zip"

Write-Host "Exporting clean copy..." -ForegroundColor Cyan

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
if (Test-Path $zip)     { Remove-Item $zip -Force }

# Copy everything except dev/build artifacts and secrets.
# Bare names so robocopy excludes them anywhere in the tree (e.g. backend\.venv).
$excludeDirs  = @("node_modules", ".venv", "venv", ".next", ".git", "__pycache__", ".claude", "media")
$excludeFiles = @("*.db", ".env", "*.pyc", "*.log", "*.zip", "big_test.*")

robocopy $root $staging /E /XD $excludeDirs /XF $excludeFiles | Out-Null

# Recreate an empty media folder so uploads have a home.
New-Item -ItemType Directory -Force -Path (Join-Path $staging "backend\media") | Out-Null
New-Item -ItemType File -Force -Path (Join-Path $staging "backend\media\.gitkeep") | Out-Null

# Safety: ensure no .env or database slipped through.
Get-ChildItem $staging -Recurse -Include ".env","*.db" -Force | Remove-Item -Force -ErrorAction SilentlyContinue

Compress-Archive -Path "$staging\*" -DestinationPath $zip
Remove-Item $staging -Recurse -Force

$sizeMB = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host "Created $zip ($sizeMB MB)" -ForegroundColor Green
Write-Host "This is the file to hand to the buyer." -ForegroundColor Green
