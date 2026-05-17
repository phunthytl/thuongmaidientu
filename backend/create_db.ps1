param(
    [string]$User,
    [string]$Password,
    [string]$HostName = 'localhost',
    [string]$Port = '3306',
    [string]$Database = 'carshop_db',
    [switch]$ImportDemoData
)

$ErrorActionPreference = 'Stop'

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile    = Join-Path $scriptDir '.env'
$schemaFile = Join-Path $scriptDir 'CarShop.sql'
$seedFile   = Join-Path $scriptDir 'seed_data_lamthanhduc.sql'

$envVars = @{}
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#=\s][^=]*)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

if (-not $User) {
    $User = if ($envVars['DB_USERNAME']) { $envVars['DB_USERNAME'] } else { 'root' }
}

if (-not $Password) {
    $Password = if ($envVars['DB_PASSWORD']) { $envVars['DB_PASSWORD'] } else { Read-Host 'MySQL password' }
}

Write-Host "==> Creating database '$Database' on $HostName`:$Port (user=$User)..." -ForegroundColor Cyan

$createSql = "CREATE DATABASE IF NOT EXISTS ``$Database`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$createSql | & mysql -h $HostName -P $Port -u $User "--password=$Password" --default-character-set=utf8mb4
if ($LASTEXITCODE -ne 0) { throw "Failed to create database '$Database'" }

if ($ImportDemoData) {
    Write-Host "==> Importing demo schema/data from CarShop.sql..." -ForegroundColor Yellow
    if (-not (Test-Path $schemaFile)) { throw "Not found: $schemaFile" }
    Get-Content -Path $schemaFile -Raw | & mysql -h $HostName -P $Port -u $User "--password=$Password" --default-character-set=utf8mb4 $Database
    if ($LASTEXITCODE -ne 0) { throw "Failed to import CarShop.sql" }

    Write-Host "==> Importing additional demo data from seed_data_lamthanhduc.sql..." -ForegroundColor Yellow
    if (-not (Test-Path $seedFile)) { throw "Not found: $seedFile" }
    Get-Content -Path $seedFile -Encoding UTF8 -Raw | & mysql -h $HostName -P $Port -u $User "--password=$Password" --default-character-set=utf8mb4 $Database
    if ($LASTEXITCODE -ne 0) { throw "Failed to import seed_data_lamthanhduc.sql" }
}

Write-Host "Database '$Database' is ready." -ForegroundColor Green
