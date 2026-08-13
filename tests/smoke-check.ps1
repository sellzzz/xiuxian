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
  'styles/ui-overrides.css?v=28',
  'config/story-config.js',
  'src/app.js',
  'config/story-config.js?v=5',
  'src/app.js?v=105',
  'id="artifactRack"',
  'id="relationModal"',
  'id="musicToggle"',
  'id="exportSave"',
  'id="importSaveButton"',
  'id="importSaveInput"',
  'id="artifactInspector"',
  'role="progressbar"',
  'id="removeArtifactButton"',
  'id="useArtifactButton"',
  'event-condition'
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
foreach ($marker in @('relationshipEvents:', 'influenceRules:', 'eventConditions:', 'eventContent:', 'legacyBoons:', 'artifactRewards:', 'resonances:', 'artifacts:', 'moonLamp:', 'beastHorn:', 'heartMirror:', 'heartMoon:', 'breakthroughBonus:', 'meditationScale:', 'active:', 'cooldown:')) {
  if ($storyConfig.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing story config marker: $marker"
  }
}
$appSource = Get-Content (Join-Path $root 'src/app.js') -Raw -Encoding UTF8
foreach ($marker in @("requiresConfiguredArtifact:'heartMirror'", 'grantArtifact', 'setArtifactReward', 'artifactBonus', 'artifactEffectSummary', 'artifactRewards', 'artifactRewardText', 'configuredArtifactMarkup', 'artifactCollectionMarkup', 'artifactResonanceMarkup', 'artifactCatalogMarkup', 'artifact-catalog-item', 'artifact-resonance-requirements', 'artifactResonanceText', 'artifactActiveAffordable', 'activeArtifactResonances', 'artifactCatalog()', 'artifactCollector', 'requiresConfiguredArtifact', 'eventConditionOverrides', 'cleanEventCondition', 'artifactOverrides[value]', 'setEventCondition', 'setEventContent', 'removeEventContent', 'eventContentOverrides', 'applyEventContentOverride', 'removeEventCondition', 'configuredCondition', 'Object.keys(configuredCondition).length', 'queuedEvent', 'nextEventIndex', 'eventConditionOverrides[eventType]=cleanEventCondition(condition)', 'eventConditionHint', 'conditionHint', 'const condition={...event,...(eventConditionOverrides[event.type]||{})}', 'clampStateValue', 'claimQuestBase', 'hp:clampStateValue', 'state.realmLevel>=3', 'artifact-resonance-badge', 'artifact-cooldown', 'artifact-collection-summary', 'questStreak', 'questKeeper', 'nextStreakReward', 'currentEventConditions', 'eventConditionElement', 'renderJourney', 'journeyProgressBar', 'renderActionBudget', 'actionBudget', 'toggleLog', 'aptitudePurity', 'updateBreakthroughUIBase', 'renderSwipeAffordance', 'aria-roledescription', 'targetYears', 'journeyYears', 'renderChronicleLog' , 'worldCycleCatalog.find', 'requiresMaster', 'requiresEstate', 'requiresDemonVictory', 'diagnostics=function', 'showQuestReward', 'quest-reward-toast', 'refreshArtifactInspector', 'announceArtifactResonances', 'announceArtifactResonanceLoss', 'cleanArtifactResonance', 'setArtifactResonance', 'removeArtifactResonance', 'resonances:artifactResonanceOverrides', 'resonances:activeArtifactResonances', 'removed={[id]:artifactResonanceOverrides[id]}', 'grantArtifact(id,refresh=true)', 'setArtifactResonance(id,resonance)', 'removeArtifactResonance(id)', 'QingyunStoryAPI.useArtifact=function', 'migrateSave', 'rawState', 'Array.isArray(rawState)', 'forEach(key=>{if(!Array.isArray(saved[key]))saved[key]=[]})', 'exportSave', 'importSaveFile', 'importSaveInput', 'artifact-activation-toast', 'artifact-collection-summary', 'inspectArtifact', 'removeInspectedArtifact', 'useInspectedArtifact', 'showArtifactActivation', 'showArtifactAcquisition', 'achievement-toast', 'meditation-toast', 'showMeditationAnimation(gain=0,recovery=0)', 'resourceLabel(key)', 'resourceMeterMax', 'resourceMeterText', 'wuxingRelations', 'protectInvalidSave', 'notifySaveRecovery', 'showQuestReward', 'quest-reward-toast', 'aria-live', 'aria-valuetext', 'aria-valuenow', 'leftPreview', 'rightPreview', 'showActionResult', 'action-result-toast', 'showRewindAnimation', 'rewind-toast', 'event.ctrlKey||event.metaKey', 'aria-disabled', 'formatChanges', 'projected===null', 'tickArtifactCooldowns', 'cooldownText', 'artifactCooldowns?.[id]', 'active.label', 'setDragPreview', 'resetCard', 'Math.abs(dy)>=Math.abs(dx)', 'swipeHint.textContent=state.scene', 'realmLevel,realm:state?realms[realmLevel]', 'onpointerenter=show', 'onfocus=show', 'SAVE_VERSION=5', 'LEGACY_MUSIC_VOLUME_KEY', 'music-volume-v2', 'realmLevel||0,realms.length-1')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing extensibility marker: $marker"
  }
}

$appSource = Get-Content (Join-Path $root 'src/app.js') -Raw -Encoding UTF8
foreach ($marker in @('eventCategory', 'event-codex-category', 'ensureEventCodexCategoryStyles')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing event codex category marker: $marker"
  }
}
foreach ($marker in @('enhanceEventCodexFilters', 'event-codex-filter', 'event-codex-filter-count', 'dataset.category')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing event codex filter marker: $marker"
  }
}
foreach ($marker in @('renderEventRouteBadge', 'event-route-badge', 'eventRouteBadge')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing event route badge marker: $marker"
  }
}
foreach ($marker in @('actualTurnChangeText', 'action-result-detail', 'action-result-preview', 'ensureActionResultDetailStyles')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing action result detail marker: $marker"
  }
}
foreach ($marker in @('aptitudeStrategy', 'renderAptitudeDetail')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing aptitude strategy marker: $marker"
  }
}
foreach ($marker in @('showBlockedWithToast', 'blocked-choice-toast', 'aria-live')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing blocked choice feedback marker: $marker"
  }
}
foreach ($marker in @('renderMissionFeedback', 'mission-ready', 'missionReadyStyles', 'data-mission-state')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing mission feedback marker: $marker"
  }
}
foreach ($marker in @('repairSceneConsistency', 'sceneConsistencyRepaired', "state.scene==='main'", "state.scene==='prologue'")) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing save consistency marker: $marker"
  }
}
foreach ($marker in @('ensureLifePillState', 'useLifePill', 'buyShopItemWithLifePill', 'enhanceLifePillPanel', 'life-pill-item', 'buyLifePill')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing life pill marker: $marker"
  }
}
foreach ($marker in @('cultivationStageInfo', 'renderCultivationStage', 'cultivationStage', 'cultivation-stage-toast')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing cultivation stage marker: $marker"
  }
}
foreach ($marker in @('legacyBoonDefaults', 'legacyBoons=Object.fromEntries', 'causal:{name:', 'legacyBoonUnlocked', 'legacy-causal-boon', 'meta.endings.length>=5', 'applyLegacyBoon')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing legacy boon marker: $marker"
  }
}
foreach ($marker in @('formatChangeRisk', 'formatChangesBase', 'choiceLifeCost()', 'projected<=0')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing choice risk marker: $marker"
  }
}
foreach ($marker in @('lifeCostPreview(){', 'choicePreviewWithLifeForecast', 'setDragPreviewWithLifeForecast', 'formatYears(remaining)')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing life forecast marker: $marker"
  }
}
foreach ($marker in @('markChoiceRisk', 'choice-risk', 'choiceRiskStyles', 'data-risk')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing choice risk style marker: $marker"
  }
}
foreach ($marker in @('ensureEndingCollectionStyles', 'data-stat="artifacts"', 'data-stat="causal"', 'endWithCollectionStats')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing ending collection marker: $marker"
  }
}
foreach ($marker in @('markChoiceRiskBase', 'aria-describedby', 'eventRouteBadge', 'leftPreview', 'rightPreview')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing choice accessibility marker: $marker"
  }
}

foreach ($marker in @('renderEventCodex', 'markEventSeen', 'seenEvents', 'event-codex-sheet', 'renderQuickGuide', 'quick-guide', 'renderLegacyProgressChip', 'legacyRunChip', 'endWithExplorationStats', 'data-stat="explored"')) {
  if ($appSource.IndexOf($marker, [StringComparison]::Ordinal) -lt 0) {
    throw "Missing card codex marker: $marker"
  }
}

if ($appSource.IndexOf('availableEventCount', [StringComparison]::Ordinal) -lt 0) {
  throw 'Missing diagnostics event pool marker'
}

foreach ($relativePath in @('styles/base.css', 'styles/visual-polish.css', 'styles/ui-overrides.css')) {
  $css = Get-Content (Join-Path $root $relativePath) -Raw -Encoding UTF8
  $open = ([regex]::Matches($css, '{')).Count
  $close = ([regex]::Matches($css, '}')).Count
  if ($open -ne $close) { throw "Unbalanced CSS braces: $relativePath ($open / $close)" }
}

Write-Output "Smoke check passed: $($required.Count) files, 3 scripts, 3 stylesheets."
