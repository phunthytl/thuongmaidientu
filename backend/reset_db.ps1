# Script reset database carshop_db
# Su dung: .\reset_db.ps1
# Yeu cau: MySQL client (mysql.exe) trong PATH

$ErrorActionPreference = 'Stop'

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile    = Join-Path $scriptDir '.env'
$schemaFile = Join-Path $scriptDir 'CarShop.sql'
$seedFile   = Join-Path $scriptDir 'seed_data_lamthanhduc.sql'

function Invoke-MysqlFile {
    param(
        [string]$FilePath,
        [string]$DatabaseName
    )

    $reader = New-Object System.IO.StreamReader($FilePath, $true)
    try {
        $content = $reader.ReadToEnd()
    } finally {
        $reader.Close()
    }

    $tempFile = Join-Path $env:TEMP ("carshop-import-{0}.sql" -f ([guid]::NewGuid().ToString('N')))
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($tempFile, $content, $utf8NoBom)

    try {
        $mysqlSourcePath = $tempFile.Replace('\', '/')
        & mysql -h $dbHost -P $dbPort -u $dbUser "--password=$dbPass" --default-character-set=utf8mb4 $DatabaseName "--execute=source $mysqlSourcePath"
        if ($LASTEXITCODE -ne 0) { throw "Failed to import $FilePath" }
    } finally {
        Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
    }
}

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

# --- 2. Import schema/data with UTF-8 so Vietnamese text is preserved ---
Write-Host "==> Importing schema from CarShop.sql..." -ForegroundColor Yellow
if (-not (Test-Path $schemaFile)) { throw "Not found: $schemaFile" }
Invoke-MysqlFile -FilePath $schemaFile -DatabaseName $dbName

# --- 3. Import seed data ---
Write-Host "==> Importing seed_data_lamthanhduc.sql..." -ForegroundColor Yellow
if (-not (Test-Path $seedFile)) { throw "Not found: $seedFile" }
Invoke-MysqlFile -FilePath $seedFile -DatabaseName $dbName

Write-Host ""
Write-Host "Database '$dbName' has been reset successfully!" -ForegroundColor Green
