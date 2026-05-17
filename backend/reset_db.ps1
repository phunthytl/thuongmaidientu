# Script reset database carshop_db
# Su dung: .\reset_db.ps1
# Yeu cau: MySQL client (mysql.exe) trong PATH

$ErrorActionPreference = 'Stop'

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile    = Join-Path $scriptDir '.env'
$schemaFile = Join-Path $scriptDir 'CarShop.sql'
$seedFile   = Join-Path $scriptDir 'seed_data_lamthanhduc.sql'

# --- Parse .env ---
$envVars = @{}
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#=\s][^=]*)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$dbUser = if ($envVars['DB_USERNAME']) { $envVars['DB_USERNAME'] } else { 'root' }
$dbPass = if ($envVars['DB_PASSWORD']) { $envVars['DB_PASSWORD'] } else { '123456' }
$dbHost = 'localhost'
$dbPort = '3306'
$dbName = 'carshop_db'

Write-Host "==> DB: $dbName @ $dbHost`:$dbPort (user=$dbUser)" -ForegroundColor Cyan

# --- 1. Drop + recreate database ---
Write-Host "==> Dropping & recreating database '$dbName'..." -ForegroundColor Yellow
$dropSql = "DROP DATABASE IF EXISTS ``$dbName``; CREATE DATABASE ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$dropSql | & mysql -h $dbHost -P $dbPort -u $dbUser "--password=$dbPass"
if ($LASTEXITCODE -ne 0) { throw "Failed to drop/create database" }

# --- 2. Import schema (CarShop.sql la UTF-16 LE, can convert sang UTF-8) ---
Write-Host "==> Importing schema from CarShop.sql..." -ForegroundColor Yellow
if (-not (Test-Path $schemaFile)) { throw "Not found: $schemaFile" }
$schemaContent = Get-Content -Path $schemaFile -Encoding Unicode -Raw
$schemaContent | & mysql -h $dbHost -P $dbPort -u $dbUser "--password=$dbPass" --default-character-set=utf8mb4 $dbName
if ($LASTEXITCODE -ne 0) { throw "Failed to import schema" }

# --- 3. Import seed data ---
Write-Host "==> Importing seed_data_lamthanhduc.sql..." -ForegroundColor Yellow
if (-not (Test-Path $seedFile)) { throw "Not found: $seedFile" }
$seedContent = Get-Content -Path $seedFile -Encoding UTF8 -Raw
$seedContent | & mysql -h $dbHost -P $dbPort -u $dbUser "--password=$dbPass" --default-character-set=utf8mb4 $dbName
if ($LASTEXITCODE -ne 0) { throw "Failed to import seed data" }

Write-Host ""
Write-Host "Database '$dbName' has been reset successfully!" -ForegroundColor Green
