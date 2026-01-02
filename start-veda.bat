@echo off
echo 🚀 Starting Veda Real-Time Financial Engine...
echo.
echo Backend API: http://localhost:3001
echo Frontend dApp: http://localhost:3000
echo.
echo Opening Veda dApp in your browser...
start http://localhost:3000
echo.
echo ✅ Veda dApp is now running!
echo.
echo 📊 Available endpoints:
echo   - Health Check: http://localhost:3001/health
echo   - Envio Health: http://localhost:3001/api/envio/health
echo   - Protocol Stats: http://localhost:3001/api/envio/protocol/stats
echo   - Recent Payments: http://localhost:3001/api/envio/payments/recent
echo.
echo Press any key to exit...
pause > nul