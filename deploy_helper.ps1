# Aranyam Matrimony - Deployment Automation Helper
# ATTNAM Labs

Write-Host "=========================================================" -ForegroundColor Gold
Write-Host "🚀 Aranyam Matrimony - Automatic Git & Cloud Push Helper" -ForegroundColor Gold
Write-Host "=========================================================" -ForegroundColor Gold
Write-Host ""

# 1. Verify Git status
if (!(Test-Path .git)) {
    Write-Host "📦 Initializing local Git repository..." -ForegroundColor Cyan
    git init -b main
}

# 2. Add and commit all files
Write-Host "📝 Staging and committing all system-ready code..." -ForegroundColor Cyan
git add .
git commit -m "feat: implement dynamic system dashboard and resilience simulation guides"

# 3. Prompt for GitHub repository URL
Write-Host ""
Write-Host "🔑 Please enter your GitHub Repository HTTPS URL" -ForegroundColor Gold
Write-Host "Example: https://github.com/your-username/aranyam-matrimony.git" -ForegroundColor Gray
$repoUrl = Read-Host "URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Error: Repository URL cannot be empty. Deployment halted." -ForegroundColor Red
    Exit
}

# Remove existing remote if present
git remote remove origin 2>$null

# Add new remote
Write-Host ""
Write-Host "🔗 Connecting remote repository..." -ForegroundColor Cyan
git remote add origin $repoUrl

# Push code to GitHub
Write-Host "🚀 Pushing codebase to GitHub (main branch)..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Opening Railway Dashboard in your browser..." -ForegroundColor Green
    Start-Process "https://railway.app/"
    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Gold
    Write-Host "Next simple steps on Railway:" -ForegroundColor Gold
    Write-Host "1. Click 'New Project' -> 'Deploy from GitHub repo'." -ForegroundColor Gold
    Write-Host "2. Select this repository." -ForegroundColor Gold
    Write-Host "3. Add PostgreSQL and Redis plugins in the same canvas." -ForegroundColor Gold
    Write-Host "4. Change the service Start Command to:" -ForegroundColor Gold
    Write-Host "   npm run prisma:migrate && npm run start" -ForegroundColor Gold
    Write-Host "=========================================================" -ForegroundColor Gold
} else {
    Write-Host "❌ Error: Failed to push code to GitHub. Please check your credentials or URL and try again." -ForegroundColor Red
}
