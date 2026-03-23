param(
    [string]$TargetPath = ".",
    [string]$SourceTemplatePath = "C:\Users\elidy\Downloads\GENIA - SQUAD - OS\packages\create-genia-os\template",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Resolve-AbsolutePath {
    param([string]$PathValue)

    if (Test-Path -Path $PathValue) {
        return (Resolve-Path -Path $PathValue).Path
    }

    throw "Path not found: $PathValue"
}

function Copy-DirectoryFromTemplate {
    param(
        [string]$Name,
        [string]$SourceRoot,
        [string]$TargetRoot,
        [switch]$Overwrite
    )

    $sourceDir = Join-Path $SourceRoot $Name
    $targetDir = Join-Path $TargetRoot $Name

    if (-not (Test-Path -Path $sourceDir)) {
        throw "Template folder missing: $sourceDir"
    }

    if (-not (Test-Path -Path $targetDir)) {
        Copy-Item -Path $sourceDir -Destination $targetDir -Recurse -Force
        Write-Host "[installed] $Name"
        return
    }

    if ($Overwrite) {
        Copy-Item -Path (Join-Path $sourceDir "*") -Destination $targetDir -Recurse -Force
        Write-Host "[updated] $Name"
    } else {
        Write-Host "[ok] $Name already exists"
    }
}

function Ensure-Directory {
    param([string]$FullPath, [string]$Label)

    if (-not (Test-Path -Path $FullPath)) {
        New-Item -ItemType Directory -Path $FullPath -Force | Out-Null
        Write-Host "[created] $Label"
    } else {
        Write-Host "[ok] $Label"
    }
}

function Ensure-File {
    param([string]$FullPath, [string]$Content, [switch]$Overwrite)

    if (-not (Test-Path -Path $FullPath) -or $Overwrite) {
        Set-Content -Path $FullPath -Value $Content -Encoding Ascii
        Write-Host "[installed] $([System.IO.Path]::GetFileName($FullPath))"
    } else {
        Write-Host "[ok] $([System.IO.Path]::GetFileName($FullPath)) already exists"
    }
}

$targetRoot = Resolve-AbsolutePath -PathValue $TargetPath
$sourceRoot = Resolve-AbsolutePath -PathValue $SourceTemplatePath

$requiredDirs = @(".genia", ".claude", ".synapse")
$requiredFiles = @("AGENTS.md")
$missing = @()

foreach ($entry in $requiredDirs + $requiredFiles) {
    $entryPath = Join-Path $targetRoot $entry
    if (-not (Test-Path -Path $entryPath)) {
        $missing += $entry
    }
}

if ($missing.Count -eq 0 -and -not $Force) {
    Write-Host "GENIA OS already active in: $targetRoot"
    exit 0
}

Write-Host "Ensuring GENIA OS baseline in: $targetRoot"

foreach ($dirName in $requiredDirs) {
    Copy-DirectoryFromTemplate -Name $dirName -SourceRoot $sourceRoot -TargetRoot $targetRoot -Overwrite:$Force
}

$dirsToEnsure = @(
    @{ Rel = "docs\stories"; Label = "docs/stories" },
    @{ Rel = ".genia\session"; Label = ".genia/session" },
    @{ Rel = ".genia\session-digests"; Label = ".genia/session-digests" }
)

foreach ($item in $dirsToEnsure) {
    $fullPath = Join-Path $targetRoot $item.Rel
    Ensure-Directory -FullPath $fullPath -Label $item.Label
}

$gitkeepTargets = @(
    "docs\stories\.gitkeep",
    ".genia\session\.gitkeep",
    ".genia\session-digests\.gitkeep"
)

foreach ($relPath in $gitkeepTargets) {
    $fullPath = Join-Path $targetRoot $relPath
    if (-not (Test-Path -Path $fullPath)) {
        Set-Content -Path $fullPath -Value "" -Encoding Ascii
        Write-Host "[created] $relPath"
    } else {
        Write-Host "[ok] $relPath"
    }
}

$agentsPath = Join-Path $targetRoot "AGENTS.md"
$agentsLines = @(
    "# AGENTS.md - GEN.IA OS (Codex CLI)",
    "",
    "This project must always run with GEN.IA OS orchestration.",
    "",
    "## Mandatory Rules",
    "1. Source of truth: https://github.com/elidyizzy/GENIA-SQUAD-OS",
    "2. Before starting any task, verify .genia/, .claude/, and .synapse/.",
    "3. If anything is missing, run:",
    '   powershell -ExecutionPolicy Bypass -File "C:\Users\elidy\Downloads\GENIA - SQUAD - OS\scripts\ensure-genia-os.ps1" -TargetPath "<project-root>"',
    "",
    "## Workflow",
    "- CLI first",
    "- Story-driven in docs/stories/",
    "- No requirements invented outside approved artifacts",
    "",
    "## Quality Gates",
    "- Run lint/typecheck/tests for the project stack before delivery",
    "- Update story checklist and touched file list before conclusion"
)
$agentsContent = ($agentsLines -join [Environment]::NewLine)

Ensure-File -FullPath $agentsPath -Content $agentsContent -Overwrite:$Force

$requiredMarkers = @(
    ".genia\CONSTITUTION.md",
    ".claude\CLAUDE.md",
    ".synapse\constitution",
    "AGENTS.md"
)

$postMissing = @()
foreach ($marker in $requiredMarkers) {
    $markerPath = Join-Path $targetRoot $marker
    if (-not (Test-Path -Path $markerPath)) {
        $postMissing += $marker
    }
}

if ($postMissing.Count -gt 0) {
    throw "GENIA OS install incomplete. Missing: $($postMissing -join ', ')"
}

Write-Host "GENIA OS baseline ready in: $targetRoot"
