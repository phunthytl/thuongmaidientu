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
    if ($DatabaseName -ne 'carshop_db') {
        $content = $content.Replace('carshop_db', $DatabaseName)
    }

    $tempFile = Join-Path $env:TEMP ("carshop-import-{0}.sql" -f ([guid]::NewGuid().ToString('N')))
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($tempFile, $content, $utf8NoBom)

    try {
        $mysqlSourcePath = $tempFile.Replace('\', '/')
        & mysql -h $HostName -P $Port -u $User "--password=$Password" --default-character-set=utf8mb4 $DatabaseName "--execute=source $mysqlSourcePath"
        if ($LASTEXITCODE -ne 0) { throw "Failed to import $FilePath" }
    } finally {
        Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
    }
}

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
    Invoke-MysqlFile -FilePath $schemaFile -DatabaseName $Database

    Write-Host "==> Importing additional demo data from seed_data_lamthanhduc.sql..." -ForegroundColor Yellow
    if (-not (Test-Path $seedFile)) { throw "Not found: $seedFile" }
    Invoke-MysqlFile -FilePath $seedFile -DatabaseName $Database
}

Write-Host "Database '$Database' is ready." -ForegroundColor Green
