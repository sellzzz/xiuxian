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
  & node tests/validate-config.js
  if ($LASTEXITCODE -ne 0) { throw 'story configuration validation failed' }
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
  'id="musicToggle"',
  'id="exportSave"',
  'id="importSaveButton"',
  'id="importSaveInput"',
  'aria-disabled',
  'id="artifactInspector"',
  'id="removeArtifactButton"',
  'id="useArtifactButton"'
)
foreach ($marker in $markers) {
  if ($html.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing page marker: $marker"
  }
}

$readme = Get-Content (Join-Path $root 'README.md') -Raw -Encoding UTF8
foreach ($marker in @('active:', 'cost:{qi:12}', 'cooldown:3')) {
  if ($readme.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing active artifact documentation marker: $marker"
  }
}

$storyConfig = Get-Content (Join-Path $root 'config/story-config.js') -Raw -Encoding UTF8
foreach ($marker in @('relationshipEvents:', 'influenceRules:', 'artifactRewards:', 'resonances:', 'artifacts:', 'moonLamp:', 'beastHorn:', 'breakthroughBonus:', 'meditationScale:', 'active:', 'cooldown:')) {
  if ($storyConfig.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing story config marker: $marker"
  }
}
$appSource = Get-Content (Join-Path $root 'src/app.js') -Raw -Encoding UTF8
foreach ($marker in @('grantArtifact', 'setArtifactReward', 'artifactBonus', 'artifactEffectSummary', 'artifactRewards', 'artifactRewardText', 'configuredArtifactMarkup', 'artifactCollectionMarkup', 'artifactResonanceMarkup', 'artifactResonanceText', 'artifactActiveAffordable', 'activeArtifactResonances', 'artifactCatalog()', 'artifactCollector', 'artifact-resonance-badge', 'artifact-cooldown', 'artifact-collection-summary', 'refreshArtifactInspector', 'announceArtifactResonances', 'announceArtifactResonanceLoss', 'cleanArtifactResonance', 'setArtifactResonance', 'removeArtifactResonance', 'resonances:artifactResonanceOverrides', 'resonances:activeArtifactResonances', 'removed={[id]:artifactResonanceOverrides[id]}', 'grantArtifact(id,refresh=true)', 'setArtifactResonance(id,resonance)', 'removeArtifactResonance(id)', 'migrateSave', 'rawState', 'Array.isArray(rawState)', 'exportSave', 'importSaveFile', 'importSaveInput', 'artifact-activation-toast', 'artifact-collection-summary', 'inspectArtifact', 'removeInspectedArtifact', 'useInspectedArtifact', 'showArtifactActivation', 'showArtifactAcquisition', 'achievement-toast', 'meditation-toast', 'aria-live', 'event.ctrlKey||event.metaKey', 'tickArtifactCooldowns', 'useArtifact(id)', 'artifactCooldowns?.[id]', 'active.label', 'setDragPreview', 'onpointerenter=show', 'onfocus=show', 'SAVE_VERSION=5', 'LEGACY_MUSIC_VOLUME_KEY', 'music-volume-v2')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing extensibility marker: $marker"
  }
}

foreach ($relativePath in @('styles/base.css', 'styles/visual-polish.css', 'styles/ui-overrides.css')) {
  $css = Get-Content (Join-Path $root $relativePath) -Raw -Encoding UTF8
  $open = ([regex]::Matches($css, '{')).Count
  $close = ([regex]::Matches($css, '}')).Count
  if ($open -ne $close) { throw "Unbalanced CSS braces: $relativePath ($open / $close)" }
}

Write-Output "Smoke check passed: $($required.Count) files, 3 scripts, 3 stylesheets."
