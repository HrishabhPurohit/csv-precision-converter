#!/bin/bash

echo "🚀 Building CSV Precision Converter for Windows"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Cleaning previous builds...${NC}"
rm -rf dist/

echo -e "${YELLOW}Step 2: Building React app...${NC}"
npm run build

echo -e "${YELLOW}Step 3: Building Windows installer...${NC}"
npx electron-builder --win --x64

echo -e "${GREEN}✅ Build complete!${NC}"
echo ""
echo "📦 Windows installer location:"
echo "   dist/*.exe"
echo ""
echo "📋 Next steps:"
echo "1. Test the installer on a Windows machine"
echo "2. Upload to your distribution channel"
echo "3. Share download link with users"
echo ""
echo "💡 Tip: For code signing, see DISTRIBUTION.md"
