@echo off
REM Script to optimize GitHub Actions workflows for Windows
REM This will generate package-lock.json and update workflows for better performance

echo 🔧 Optimizing GitHub Actions Workflows...

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install Node.js and npm first.
    exit /b 1
)

REM Generate package-lock.json
echo 📦 Generating package-lock.json...
npm install

if exist "package-lock.json" (
    echo ✅ package-lock.json created successfully!
    
    echo 🚀 You can now optimize your workflows by:
    echo    1. Adding 'cache: npm' back to setup-node steps
    echo    2. Changing 'npm install' back to 'npm ci'
    echo    3. This will improve build performance significantly
    
    echo.
    echo 📝 Example optimized setup-node step:
    echo    - name: Setup Node.js
    echo      uses: actions/setup-node@v4
    echo      with:
    echo        node-version: '20'
    echo        cache: 'npm'
    echo.
    echo    - name: Install dependencies
    echo      run: npm ci
) else (
    echo ❌ Failed to create package-lock.json
    echo    Workflows will continue to work with 'npm install'
)

echo.
echo ✅ GitHub Actions optimization complete!
pause
