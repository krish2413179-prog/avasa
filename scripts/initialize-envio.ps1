# 🚀 Initialize Envio Real-Time Financial Engine
# This script sets up the Envio indexer for zero-latency financial data

Write-Host "🚀 Initializing Envio Real-Time Financial Engine..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "envio")) {
    Write-Host "❌ Error: envio directory not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Set-Location envio

Write-Host "📦 Installing Envio dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Generating TypeScript types from schema..." -ForegroundColor Yellow
npx envio codegen

Write-Host "🏗️ Building the indexer..." -ForegroundColor Yellow
npx envio build

Write-Host ""
Write-Host "🚀 Envio Real-Time Financial Engine Setup Complete!" -ForegroundColor Green
Write-Host "📊 GraphQL endpoint will be available at: http://localhost:8080/v1/graphql" -ForegroundColor Cyan
Write-Host "🎯 This will index all AutoRecurringPayments events and transform them into financial intelligence" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚡ Features enabled:" -ForegroundColor Yellow
Write-Host "  • Zero-latency payment schedule queries"
Write-Host "  • Real-time credit score tracking"
Write-Host "  • Property performance analytics"
Write-Host "  • User portfolio intelligence"
Write-Host "  • Global protocol statistics"
Write-Host ""
Write-Host "🎮 To start the indexer, run:" -ForegroundColor Yellow
Write-Host "  npx envio dev" -ForegroundColor White
Write-Host ""
Write-Host "🔗 To start the backend with Envio integration:" -ForegroundColor Yellow
Write-Host "  cd ../backend && npm run dev-engine" -ForegroundColor White
Write-Host ""
Write-Host "✅ Envio Real-Time Financial Engine is ready!" -ForegroundColor Green
Write-Host "🎯 This transforms your backend from a 'transaction pusher' to a high-performance financial intelligence system" -ForegroundColor Magenta

Set-Location ..