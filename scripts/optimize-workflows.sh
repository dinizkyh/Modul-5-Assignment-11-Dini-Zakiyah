#!/bin/bash

# Script to optimize GitHub Actions workflows
# This will generate package-lock.json and update workflows for better performance

echo "🔧 Optimizing GitHub Actions Workflows..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

# Generate package-lock.json
echo "📦 Generating package-lock.json..."
npm install

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json created successfully!"
    
    echo "🚀 You can now optimize your workflows by:"
    echo "   1. Adding 'cache: npm' back to setup-node steps"
    echo "   2. Changing 'npm install' back to 'npm ci'"
    echo "   3. This will improve build performance significantly"
    
    echo ""
    echo "📝 Example optimized setup-node step:"
    echo "   - name: Setup Node.js"
    echo "     uses: actions/setup-node@v4"
    echo "     with:"
    echo "       node-version: '20'"
    echo "       cache: 'npm'"
    echo ""
    echo "   - name: Install dependencies"
    echo "     run: npm ci"
else
    echo "❌ Failed to create package-lock.json"
    echo "   Workflows will continue to work with 'npm install'"
fi

echo ""
echo "✅ GitHub Actions optimization complete!"
