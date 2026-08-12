$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

$required = @(
  'index.html',
  'src/app.js',
  'config/story-config.js',
  'styles/base.css',
  'styles/visual-polish.css',
  'styles/ui-overrides.css',
  'assets/backgrounds/qingyun-first-act.jpg',
  'assets/backgrounds/taixu-mountains.png',
  'assets/artifacts/renyuan-book-cover.jpg'
)

foreach ($relativePath in $required) {
  $absolutePath = Join-Path $root $relativePath
  if (-not (Test-Path -LiteralPath $absolutePath -PathType Leaf)) {
    throw "Missing resource: $relativePath"
  }
}

Push-Location $root
try {
  & node --check src/app.js
  if ($LASTEXITCODE -ne 0) { throw 'src/app.js syntax check failed' }
  & node --check config/story-config.js
  if ($LASTEXITCODE -ne 0) { throw 'config/story-config.js syntax check failed' }
} finally {
  Pop-Location
}

$html = Get-Content (Join-Path $root 'index.html') -Raw -Encoding UTF8
$markers = @(
  'styles/base.css',
  'styles/visual-polish.css',
  'styles/ui-overrides.css',
  'config/story-config.js',
  'src/app.js',
  'id="artifactRack"',
  'id="relationModal"',
  'id="musicToggle"'
)
foreach ($marker in $markers) {
  if ($html.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing page marker: $marker"
  }
}

foreach ($relativePath in @('styles/base.css', 'styles/visual-polish.css', 'styles/ui-overrides.css')) {
  $css = Get-Content (Join-Path $root $relativePath) -Raw -Encoding UTF8
  $open = ([regex]::Matches($css, '{')).Count
  $close = ([regex]::Matches($css, '}')).Count
  if ($open -ne $close) { throw "Unbalanced CSS braces: $relativePath ($open / $close)" }
}

Write-Output "Smoke check passed: $($required.Count) files, 2 scripts, 3 stylesheets."
