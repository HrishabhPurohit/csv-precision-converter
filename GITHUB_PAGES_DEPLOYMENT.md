# 🚀 GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Install gh-pages package
```bash
npm install --save-dev gh-pages
```

### Step 2: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for GitHub Pages deployment"

# Add your GitHub repository
git remote add origin https://github.com/HrishabhPurohit/csv-precision-converter.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to GitHub Pages
```bash
npm run deploy
```

That's it! Your app will be live at:
**https://HrishabhPurohit.github.io/csv-precision-converter**

---

## Alternative: Automatic Deployment with GitHub Actions

I've created a GitHub Actions workflow that automatically deploys on every push to main.

### Enable GitHub Pages:
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. Push your code to trigger the workflow

The workflow will:
- ✅ Build your React app automatically
- ✅ Deploy to GitHub Pages
- ✅ Update on every push to main branch

---

## What Changed for Web Version

### 1. File Operations
- **Before**: Used Electron file dialogs
- **After**: Uses browser file input (`<input type="file">`)
- **Works**: Drag & drop, file selection, CSV download

### 2. Storage
- **Before**: Could use Electron's file system
- **After**: Uses localStorage (already implemented)
- **Works**: Settings and templates persist in browser

### 3. Features That Work on Web:
- ✅ CSV file upload (drag & drop or click)
- ✅ Visual cell-level mapping
- ✅ Company abbreviation settings
- ✅ Template save/load (localStorage)
- ✅ Settings import/export (JSON download)
- ✅ CSV conversion and export
- ✅ All UI features and styling

### 4. Differences from Desktop:
- ❌ No native file dialogs (uses browser dialogs)
- ❌ No menu bar integration
- ✅ Everything else works the same!

---

## Testing Locally

Before deploying, test the web version:

```bash
# Build the production version
npm run build

# Serve it locally
npx serve -s build

# Open http://localhost:3000 in your browser
```

---

## Deployment Commands

### Manual Deployment
```bash
npm run deploy
```

### Build Only (no deploy)
```bash
npm run build
```

### Clean and Rebuild
```bash
rm -rf build node_modules
npm install
npm run build
npm run deploy
```

---

## Troubleshooting

### Issue: 404 Error after deployment
**Solution**: Make sure `homepage` in package.json is correct:
```json
"homepage": "https://HrishabhPurohit.github.io/csv-precision-converter"
```

### Issue: Blank page after deployment
**Solution**: Check browser console for errors. Usually a path issue.

### Issue: Files not uploading
**Solution**: Modern browsers support file input. Make sure you're not blocking file access.

### Issue: Settings not persisting
**Solution**: localStorage works in all modern browsers. Check if cookies/storage is enabled.

---

## Repository Setup Checklist

- [ ] Create repository: `csv-precision-converter`
- [ ] Push code to GitHub
- [ ] Enable GitHub Pages in Settings
- [ ] Run `npm run deploy` or wait for GitHub Actions
- [ ] Visit your live site!

---

## Updating the Site

Every time you want to update:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main

# Deploy (if using manual method)
npm run deploy
```

Or just push to main and GitHub Actions will deploy automatically!

---

## Custom Domain (Optional)

Want to use your own domain?

1. Add a `CNAME` file to the `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

---

## Performance Tips

The web version is optimized:
- ✅ Code splitting
- ✅ Minified assets
- ✅ Gzip compression
- ✅ Fast loading times
- ✅ Works offline (service worker can be added)

---

## Browser Compatibility

Works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## Next Steps

1. **Install gh-pages**: `npm install --save-dev gh-pages`
2. **Push to GitHub**: Create repo and push code
3. **Deploy**: Run `npm run deploy`
4. **Share**: Your app is live at the URL above!

Your CSV Precision Converter will work perfectly as a web app! 🎉
