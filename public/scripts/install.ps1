[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

$REPO_OWNER = "typst-g7-32"
$REPO_NAME = "modern-g7-32"
$GITHUB_API = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$GIT_URL = "https://github.com/$REPO_OWNER/$REPO_NAME"

Write-Host "==> Инициализация установки пакета $REPO_NAME..." -ForegroundColor Blue

try {
    $response = Invoke-RestMethod -Uri $GITHUB_API -Method Get
    $LATEST_TAG = $response.tag_name
} catch {
    Write-Host "Ошибка: Не удалось получить информацию о последнем релизе." -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($LATEST_TAG)) {
    Write-Host "Ошибка: " -NoNewline -ForegroundColor Red
    Write-Host "Не удалось получить информацию о последнем релизе."
    exit 1
}

$VERSION = $LATEST_TAG -replace '^v', ''

$INSTRUCTIONS = "Для того чтобы начать использовать шаблон, выполните команду:\ntypst init @local/modern-g7-32:$VERSION project-directory"

$TARGET_DIR = Join-Path $env:LOCALAPPDATA "typst\packages\local\$REPO_NAME\$VERSION"

Write-Host "==> " -NoNewline -ForegroundColor Blue
Write-Host "Обнаружена последняя версия: " -NoNewline
Write-Host $VERSION -ForegroundColor Green
Write-Host "==> " -NoNewline -ForegroundColor Blue
Write-Host "Целевая директория: $TARGET_DIR"

function Draw-ProgressBar {
    param(
        [System.Management.Automation.Job]$Job
    )
    
    $delay = 100
    $i = 0
    $direction = 1
    
    [Console]::CursorVisible = $false
    
    try {
        while ($Job.State -eq "Running") {
            $spaces = 30 - $i
            $bar = "[Загрузка] ["
            
            for ($j = 0; $j -lt $i; $j++) {
                $bar += " "
            }
            $bar += '<=>'
            for ($j = 0; $j -lt $spaces; $j++) {
                $bar += " "
            }
            $bar += "]"
            
            Write-Host "`r$bar" -NoNewline -ForegroundColor Yellow
            
            $i += $direction
            if ($i -ge 28 -or $i -le 0) {
                $direction = $direction * -1
            }
            
            Start-Sleep -Milliseconds $delay
        }
    } finally {
        $clearLine = "`r" + (" " * 80) + "`r"
        Write-Host $clearLine -NoNewline
        [Console]::CursorVisible = $true
    }
}

$job = Start-Job -ScriptBlock {
    param($TargetDir, $GitUrl, $Tag)
    
    function Invoke-GitOpsInternal {
        param(
            [string]$Dir,
            [string]$Url,
            [string]$Tag
        )
        
        if ((Test-Path $Dir) -and (Test-Path (Join-Path $Dir ".git"))) {
            $ErrorActionPreference = 'SilentlyContinue'
            $currentTag = git -C $Dir describe --tags --exact-match
            $ErrorActionPreference = 'Continue'
            if ($LASTEXITCODE -eq 0 -and $currentTag -eq $Tag) {
                return 0
            }
            
            try {
                $null = git -C $Dir fetch origin --tags 2>&1 | Out-Null
                $null = git -C $Dir checkout $Tag 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    return 0
                }
            } catch {
            }
            
            return 2
        }
        
        if (Test-Path $Dir) {
            Remove-Item -Path $Dir -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        $parentDir = Split-Path -Parent $Dir
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        
        try {
            $null = git clone --depth 1 --branch $Tag $Url $Dir 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                return 0
            }
            $null = git clone --depth 1 $Url $Dir 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $null = git -C $Dir fetch origin tag $Tag 2>&1 | Out-Null
                $null = git -C $Dir checkout $Tag 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    return 0
                }
            }
            return 1
        } catch {
            return 1
        }
    }
    
    $res = Invoke-GitOpsInternal -Dir $TargetDir -Url $GitUrl -Tag $Tag
    
    if ($res -eq 2) {
        if (Test-Path $TargetDir) {
            Remove-Item -Path $TargetDir -Recurse -Force -ErrorAction SilentlyContinue
        }
        $parentDir = Split-Path -Parent $TargetDir
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        
        try {
            $null = git clone --depth 1 --branch $Tag $GitUrl $TargetDir 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                return 0
            }
            $null = git clone --depth 1 $GitUrl $TargetDir 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $null = git -C $TargetDir fetch origin tag $Tag 2>&1 | Out-Null
                $null = git -C $TargetDir checkout $Tag 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    return 0
                }
            }
            return 1
        } catch {
            return 1
        }
    }
    
    return $res
} -ArgumentList $TARGET_DIR, $GIT_URL, $LATEST_TAG

Draw-ProgressBar -Job $job

$job | Wait-Job | Out-Null
$result = Receive-Job -Job $job
Remove-Job -Job $job

$EXIT_CODE = $result

if ($EXIT_CODE -eq 0) {
    Write-Host "✔ Успешно! " -NoNewline -ForegroundColor Green
    Write-Host "Пакет установлен в $TARGET_DIR.\n$INSTRUCTIONS"
} elseif ($EXIT_CODE -eq 2) {
    Write-Host "⚠ Внимание: " -NoNewline -ForegroundColor Yellow
    Write-Host "Git pull не удался, была выполнена полная переустановка."
    Write-Host "✔ Успешно! " -NoNewline -ForegroundColor Green
    Write-Host "Репозиторий перезаписан.\n$INSTRUCTIONS"
} else {
    Write-Host "✖ Ошибка: " -NoNewline -ForegroundColor Red
    Write-Host "Не удалось скачать или обновить репозиторий."
    exit 1
}