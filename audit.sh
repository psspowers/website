#!/bin/bash

echo "🔍 Starting comprehensive site audit..."

# 1. TypeScript Check
echo "\n📝 Running TypeScript checks..."
npm run check

# 2. Build Check
echo "\n🏗️ Testing build process..."
npm run build

# 3. Security Audit
echo "\n🔒 Running security audit..."
npm audit

# 4. Lint Check
echo "\n🧹 Running linter..."
npm run lint

# 5. Bundle Analysis
echo "\n📦 Analyzing bundle size..."
npm run build -- --analyze

# 6. Type Coverage
echo "\n✓ Checking type coverage..."
npm run type-check

# Final Report
echo "\n📋 Audit complete! Please review the results above."