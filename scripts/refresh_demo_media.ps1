$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repoRoot = Split-Path -Parent $PSScriptRoot
$imageRoot = Join-Path $repoRoot 'frontend\public\demo-images'
$mysqlArgs = @('-uroot', '-p123456', '-D', 'carshop_db', '--default-character-set=utf8mb4', '-N', '-B')

$categories = @(
    @{
        Name = 'cars'
        DbType = 'OTO'
        Table = 'oto'
        IdColumn = 'id'
        NameColumn = 'ten_xe'
        Dir = Join-Path $imageRoot 'cars'
        HostAllowPattern = 'amazon|honda|toyota|ford|hyundai|kia|mazda|vinfast|mitsubishi|mercedes|benz|car|motor|auto|wapcar|topgear|carscoops|edmunds|caranddriver|autodeal|autofun|otodriver|oto'
        QueryBuilder = {
            param($item)
            Get-CarQuery -Name $item.Name
        }
    },
    @{
        Name = 'accessories'
        DbType = 'PHU_KIEN'
        Table = 'phu_kien'
        IdColumn = 'id'
        NameColumn = 'ten_phu_kien'
        Dir = Join-Path $imageRoot 'accessories'
        HostAllowPattern = 'amazon|70mai|vietmap|zestech|gotech|elliview|icar|michelin|bridgestone|baseus|bosch|xiaomi|philips|jbl|thule|3m|walmart|ebayimg|shopify|aliexpress|aliimg|taobao|tmall|car'
        QueryBuilder = {
            param($item)
            Get-AccessoryQuery -Item $item
        }
    },
    @{
        Name = 'services'
        DbType = 'DICH_VU'
        Table = 'dich_vu'
        IdColumn = 'id'
        NameColumn = 'ten_dich_vu'
        Dir = Join-Path $imageRoot 'services'
        HostAllowPattern = 'pexels|unsplash|istockphoto|shutterstock|freepik|detailing|service|auto|car|wash'
        QueryBuilder = {
            param($item)
            switch ($item.Id) {
                1 { 'car maintenance service workshop' }
                2 { '10,000 km car maintenance service' }
                3 { 'synthetic engine oil change service car' }
                4 { 'car interior cleaning service' }
                5 { 'car engine bay cleaning service' }
                6 { 'ceramic coating service car' }
                7 { 'premium ceramic coating car service' }
                8 { 'wheel balancing service car' }
                9 { 'car brake inspection service' }
                10 { 'car paint polishing service' }
                11 { 'car ozone odor removal service' }
                12 { 'car air conditioning maintenance service' }
                13 { 'pre trip car inspection service' }
                14 { 'wheel alignment service car' }
                15 { 'fuel injector cleaning service car' }
                16 { 'tire rotation service car' }
                17 { 'automatic transmission maintenance service' }
                18 { 'car windshield nano coating service' }
                19 { 'car underbody cleaning service' }
                20 { 'headlight restoration service car' }
                21 { 'car electrical system inspection service' }
                22 { 'cabin air filter replacement service car' }
                23 { 'engine bay detailing service car' }
                24 { 'brake caliper cleaning service car' }
                25 { 'full car detailing service' }
                default { "$($item.Name) car service" }
            }
        }
    }
)

function Invoke-MySqlQuery {
    param(
        [string]$Query
    )

    & mysql @mysqlArgs -e $Query
}

function Get-CarQuery {
    param(
        [string]$Name
    )

    $trimTokens = @('RS', 'L', 'G', 'E', 'V', 'Q', 'Premium', 'Signature', 'Luxury', 'Calligraphy', 'Wildtrak', 'Titanium', 'Titanium+', 'X', 'GT-Line', 'Plus', 'CVT', 'AT', 'AWD', 'Dac', 'biet', 'Sport')
    $tokens = $Name -split '\s+'
    if ($tokens.Count -lt 2) {
        return "$Name car official photo"
    }

    $brand = $tokens[0]
    $modelParts = @()
    for ($i = 1; $i -lt $tokens.Count; $i++) {
        $token = $tokens[$i]
        if ($token -match '^\d' -and ($modelParts -join ' ') -notmatch '^VF$') {
            break
        }
        if ($token -in $trimTokens -and $modelParts.Count -gt 0 -and ($modelParts -join ' ') -notmatch '^VF$') {
            break
        }
        if ($token -match '^[a-zA-Z]+:\w+$' -and $modelParts.Count -gt 0) {
            break
        }
        $modelParts += $token
        if (($brand -eq 'Toyota' -or $brand -eq 'Honda' -or $brand -eq 'Mazda' -or $brand -eq 'Hyundai' -or $brand -eq 'Kia' -or $brand -eq 'Ford' -or $brand -eq 'Mitsubishi' -or $brand -eq 'Mercedes' -or $brand -eq 'VinFast') -and $modelParts.Count -ge 2) {
            if ($modelParts[-1] -notmatch '^(Cross|VF|CR-V|CX-\d+|BR-V|HR-V)$') {
                break
            }
        }
    }

    $model = ($modelParts -join ' ').Trim()
    if ([string]::IsNullOrWhiteSpace($model)) {
        $model = $tokens[1]
    }

    switch -Regex ($brand) {
        '^Honda$' { return "$brand $model 2024 car official photo" }
        '^Toyota$' { return "$brand $model 2024 car official photo" }
        '^Mazda$' { return "$brand $model 2024 car official photo" }
        '^Hyundai$' { return "$brand $model 2024 car official photo" }
        '^Kia$' { return "$brand $model 2024 car official photo" }
        '^Ford$' { return "$brand $model 2024 car official photo" }
        '^Mitsubishi$' { return "$brand $model 2024 car official photo" }
        '^Mercedes$' { return "Mercedes Benz $model 2024 car official photo" }
        '^VinFast$' { return "$brand $model 2024 car official photo" }
        default { return "$brand $model car official photo" }
    }
}

function Get-AccessoryQuery {
    param(
        [hashtable]$Item
    )

    switch ($Item.Id) {
        1 { return 'Michelin 215 60R16 tire product photo' }
        2 { return 'Toyota engine air filter product photo' }
        3 { return 'Castrol 5W-30 4L engine oil product photo' }
        4 { return 'HD rear view camera car product photo' }
        5 { return 'TPMS tire pressure sensor product photo' }
        6 { return 'Toyota Camry 3D floor mat product photo' }
        7 { return 'power folding side mirror car product photo' }
        8 { return '12V interior LED light kit car product photo' }
        9 { return 'GS 55Ah 12V car battery product photo' }
        10 { return 'Stanley jumper cable product photo' }
        17 { return 'Michelin Primacy 4 215/55R17 tire product photo' }
        18 { return 'Bridgestone Turanza T005A 225/50R18 tire product photo' }
        31 { return 'GS MF DIN45L 12V car battery product photo' }
        43 { return 'white interior LED light kit car product photo' }
        60 { return 'automatic tailgate lift kit car product photo' }
        62 { return 'center armrest organizer tray car product photo' }
        default { return "$($Item.Name) product photo" }
    }
}

function ConvertTo-Slug {
    param(
        [string]$Text
    )

    $normalized = $Text.Normalize([Text.NormalizationForm]::FormD)
    $chars = foreach ($ch in $normalized.ToCharArray()) {
        if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            $ch
        }
    }

    $ascii = -join $chars
    $ascii = $ascii -replace '[^a-zA-Z0-9]+', '-'
    $ascii = $ascii.Trim('-').ToLowerInvariant()

    if ([string]::IsNullOrWhiteSpace($ascii)) {
        return "item"
    }

    return $ascii
}

function Get-ImageCandidates {
    param(
        [string]$Query,
        [string]$HostAllowPattern
    )

    $encoded = [Uri]::EscapeDataString($Query)
    $searchUrl = "https://www.bing.com/images/search?q=$encoded"
    $html = (Invoke-WebRequest -UseBasicParsing -Headers @{ 'User-Agent' = 'Mozilla/5.0' } -Uri $searchUrl).Content

    $urls = [regex]::Matches($html, 'murl&quot;:&quot;(.*?)&quot;') |
        ForEach-Object { [System.Net.WebUtility]::HtmlDecode($_.Groups[1].Value) } |
        Where-Object { $_ -match '^https?://' } |
        Where-Object { $_ -notmatch '\.svg($|\?)' } |
        Where-Object { $_ -match $HostAllowPattern } |
        Select-Object -Unique

    return $urls
}

function Get-ExtensionFromResponse {
    param(
        [string]$Url,
        [string]$ContentType
    )

    $cleanUrl = $Url.Split('?')[0]
    $fromUrl = [IO.Path]::GetExtension($cleanUrl)
    if ($fromUrl -match '^\.(jpg|jpeg|png|webp)$') {
        return $fromUrl.ToLowerInvariant()
    }

    switch -Regex ($ContentType) {
        'image/jpeg' { return '.jpg' }
        'image/png' { return '.png' }
        'image/webp' { return '.webp' }
        default { return '.jpg' }
    }
}

function Download-BestImage {
    param(
        [string]$Query,
        [string]$DestinationBase,
        [hashtable]$UsedSourceUrls,
        [string]$HostAllowPattern
    )

    $candidates = Get-ImageCandidates -Query $Query -HostAllowPattern $HostAllowPattern

    foreach ($candidate in $candidates) {
        if ($UsedSourceUrls.ContainsKey($candidate)) {
            continue
        }

        try {
            $response = Invoke-WebRequest -UseBasicParsing -Headers @{ 'User-Agent' = 'Mozilla/5.0' } -Uri $candidate -MaximumRedirection 8
            if (-not $response.Content) {
                continue
            }

            $contentType = $response.Headers['Content-Type']
            if ($contentType -notmatch '^image/') {
                continue
            }

            $ext = Get-ExtensionFromResponse -Url $candidate -ContentType $contentType
            $destination = "$DestinationBase$ext"
            [IO.File]::WriteAllBytes($destination, $response.Content)

            $fileInfo = Get-Item $destination
            if ($fileInfo.Length -lt 12000) {
                Remove-Item $destination -Force
                continue
            }

            $UsedSourceUrls[$candidate] = $true
            return @{
                LocalPath = $destination
                SourceUrl = $candidate
                Extension = $ext
            }
        }
        catch {
            continue
        }
    }

    throw "No usable image found for query: $Query"
}

function Get-DbItems {
    param(
        [hashtable]$Category
    )

    $query = "SELECT $($Category.IdColumn), $($Category.NameColumn) FROM $($Category.Table) ORDER BY $($Category.IdColumn);"
    $rows = Invoke-MySqlQuery -Query $query
    $items = @()

    foreach ($row in $rows) {
        if ([string]::IsNullOrWhiteSpace($row)) {
            continue
        }

        $parts = $row -split "`t", 2
        if ($parts.Count -lt 2) {
            continue
        }

        $items += @{
            Id = [int]$parts[0]
            Name = $parts[1]
        }
    }

    return $items
}

foreach ($category in $categories) {
    New-Item -ItemType Directory -Force -Path $category.Dir | Out-Null
    Get-ChildItem -Path $category.Dir -File | Remove-Item -Force
}

$usedSourceUrls = @{}
$manifest = @()
$failures = @()

foreach ($category in $categories) {
    $items = Get-DbItems -Category $category
    foreach ($item in $items) {
        $slug = "{0:D3}-{1}" -f $item.Id, (ConvertTo-Slug -Text $item.Name)
        $destinationBase = Join-Path $category.Dir $slug
        $query = & $category.QueryBuilder $item
        try {
            $download = Download-BestImage -Query $query -DestinationBase $destinationBase -UsedSourceUrls $usedSourceUrls -HostAllowPattern $category.HostAllowPattern
            $localRelativeUrl = "/demo-images/$($category.Name)/$slug$($download.Extension)"

            $manifest += [PSCustomObject]@{
                dbType = $category.DbType
                objectId = $item.Id
                objectName = $item.Name
                sourceUrl = $download.SourceUrl
                localUrl = $localRelativeUrl
            }

            Write-Host ("[{0}] {1}" -f $category.DbType, $item.Name)
        }
        catch {
            $failures += [PSCustomObject]@{
                dbType = $category.DbType
                objectId = $item.Id
                objectName = $item.Name
                query = $query
                error = $_.Exception.Message
            }
            Write-Warning ("Skipped {0} #{1}: {2}" -f $category.DbType, $item.Id, $item.Name)
        }
    }
}

Invoke-MySqlQuery -Query "DELETE FROM media;"

foreach ($entry in $manifest) {
    $safeName = $entry.objectName.Replace('\', '\\').Replace("'", "''")
    $safeLocal = $entry.localUrl.Replace('\', '\\').Replace("'", "''")
    $safePublicId = ("demo/{0}/{1}" -f $entry.dbType.ToLowerInvariant(), $entry.objectId).Replace("'", "''")
    $safeSource = $entry.sourceUrl.Replace('\', '\\').Replace("'", "''")
    $safeMoTa = ("Demo image | source: $safeSource")
    if ($safeMoTa.Length -gt 250) {
        $safeMoTa = $safeMoTa.Substring(0, 250)
    }

    $insert = @"
INSERT INTO media (
    ngay_cap_nhat, ngay_tao, doi_tuong_id, loai_doi_tuong, loai_media,
    mo_ta, public_id, thu_tu, url
) VALUES (
    NOW(), NOW(), $($entry.objectId), '$($entry.dbType)', 'IMAGE',
    '$safeMoTa', '$safePublicId', 1, '$safeLocal'
);
"@
    Invoke-MySqlQuery -Query $insert
}

$manifestPath = Join-Path $repoRoot 'backend\demo-image-manifest.json'
$manifest | ConvertTo-Json -Depth 4 | Set-Content -Path $manifestPath -Encoding UTF8

$failurePath = Join-Path $repoRoot 'backend\demo-image-failures.json'
$failures | ConvertTo-Json -Depth 4 | Set-Content -Path $failurePath -Encoding UTF8

Write-Host "Downloaded $($manifest.Count) images and refreshed media. Failures: $($failures.Count)"
