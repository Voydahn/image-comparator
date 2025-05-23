@echo off
start npm run dev
timeout /t 5 > nul
start http://localhost:5173