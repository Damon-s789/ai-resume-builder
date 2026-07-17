$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$deployDir = Join-Path $projectRoot '.deploy-gh-pages'
$distDir = Join-Path $projectRoot 'dist'

Set-Location $projectRoot

$remoteUrl = (git config --get remote.origin.url).Trim()
if (-not $remoteUrl) {
  throw 'No git remote named origin found. Add origin before running deploy.'
}

$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne 'main') {
  throw "Run deploy from the main branch. Current branch: $currentBranch"
}

npm run build

if (Test-Path $deployDir) {
  $resolvedDeployDir = (Resolve-Path $deployDir).Path
  if (-not $resolvedDeployDir.StartsWith($projectRoot)) {
    throw "Refusing to remove unexpected path: $resolvedDeployDir"
  }
  Remove-Item -LiteralPath $resolvedDeployDir -Recurse -Force
}

New-Item -ItemType Directory -Path $deployDir | Out-Null
Copy-Item -Path (Join-Path $distDir '*') -Destination $deployDir -Recurse -Force

Set-Location $deployDir
git init
git checkout -b gh-pages
git remote add origin $remoteUrl
git add .
git commit -m 'Deploy GitHub Pages'
git push -f origin gh-pages

Set-Location $projectRoot
Write-Host ''
Write-Host 'Deployment pushed to gh-pages branch.'
Write-Host 'Now set GitHub Pages source to: Deploy from a branch -> gh-pages -> / (root).'
