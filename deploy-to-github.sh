#!/bin/bash

echo "🚀 CSV Precision Converter - GitHub Pages Deployment"
echo "===================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing gh-pages...${NC}"
    npm install --save-dev gh-pages
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit for GitHub Pages deployment"
fi

# Check if remote is set
if ! git remote | grep -q origin; then
    echo -e "${YELLOW}Setting up GitHub remote...${NC}"
    echo "Enter your GitHub repository URL (e.g., https://github.com/HrishabhPurohit/csv-precision-converter.git):"
    read REPO_URL
    git remote add origin "$REPO_URL"
fi

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

# Deploy to GitHub Pages
echo -e "${YELLOW}Deploying to GitHub Pages...${NC}"
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo "Your app is live at:"
    echo -e "${GREEN}https://HrishabhPurohit.github.io/csv-precision-converter${NC}"
    echo ""
    echo "It may take a few minutes for changes to appear."
else
    echo -e "${RED}❌ Deployment failed. Check the errors above.${NC}"
    exit 1
fi
