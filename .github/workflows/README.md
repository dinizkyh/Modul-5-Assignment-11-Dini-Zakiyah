# GitHub Actions Workflows

This project includes several GitHub Actions workflows for continuous integration and testing.

## Workflows Overview

### 1. `tests.yml` - Basic Test Runner
**Trigger:** Every push and pull request to any branch
**Purpose:** Quick feedback for developers

- ✅ Runs unit tests with Jest
- ✅ Uses Node.js 20
- ✅ Fast execution for immediate feedback

### 2. `test.yml` - Multi-Version Testing
**Trigger:** Every push and pull request to any branch  
**Purpose:** Comprehensive testing across Node.js versions

- ✅ Tests on Node.js 18.x and 20.x
- ✅ Runs linting checks
- ✅ Generates and uploads coverage reports
- ✅ Uploads coverage to Codecov

### 3. `ci.yml` - Complete CI/CD Pipeline
**Trigger:** Pull requests and pushes to main branch
**Purpose:** Full validation pipeline

#### Jobs:
- **Quick Test:** Fast unit tests for immediate feedback
- **Comprehensive Test:** 
  - Multi-version Node.js testing
  - Linting and build verification
  - Coverage threshold enforcement (90%)
  - Coverage reporting on PRs
- **Security Check:**
  - NPM audit for vulnerabilities
  - Dependency update checks

## Coverage Requirements

All workflows enforce minimum coverage thresholds:
- **Statements:** 90%
- **Branches:** 90% 
- **Functions:** 90%
- **Lines:** 90%

## Badges

The README includes status badges showing:
- [![Tests](https://github.com/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah/actions/workflows/tests.yml/badge.svg)](https://github.com/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah/actions/workflows/tests.yml) - Current test status
- [![CI/CD Pipeline](https://github.com/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah/actions/workflows/ci.yml/badge.svg)](https://github.com/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah/actions/workflows/ci.yml) - Full pipeline status
[![codecov](https://codecov.io/gh/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah/branch/main/graph/badge.svg)](https://codecov.io/gh/dinizkyh/Modul-5-Assignment-11-Dini-Zakiyah) - CodeCov report

## How It Works

1. **On every push** to any branch → `run_test.yml` runs basic tests
2. **On pull requests** → All workflows run for comprehensive validation
3. **Coverage reports** are automatically commented on PRs
4. **Security checks** run to identify vulnerabilities
5. **Multiple Node.js versions** ensure compatibility

## Running Tests Locally

```bash
# Run tests in watch mode (development)
npm test

# Run tests once with coverage (CI mode)
npm run test:ci

# Run linting
npm run lint

# Build the project
npm run build
```

## Features

- 🚀 **Fast Feedback**: Quick tests run on every push
- 🔍 **Comprehensive Testing**: Multi-version and security checks
- 📊 **Coverage Reporting**: Automatic coverage reports and thresholds
- 🛡️ **Security**: Automated vulnerability scanning
- 🏷️ **Status Badges**: Visual indicators of project health
- 💬 **PR Comments**: Coverage reports automatically posted to PRs
