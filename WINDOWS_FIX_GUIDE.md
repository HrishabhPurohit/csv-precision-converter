# 🔧 Windows ICU Error Fix Guide

## Quick Fix for "Invalid file descriptor to ICU data received"

This error happens when the app files aren't properly packaged. Here are 3 solutions:

## Solution 1: Use the Fixed Version (Building Now)

I'm creating a fixed version: `CSV-Converter-Windows-Fixed.zip`
This will be ready in ~2 minutes in your `dist/` folder.

## Solution 2: Quick Manual Fix (Do this on Windows)

If you need it working immediately on Windows:

1. **Extract the current ZIP file**
2. **Create this folder structure:**
   ```
   CSV-Precision-Converter/
   ├── electron.exe (or CSV Precision Converter.exe)
   ├── resources/
   │   └── app/
   │       ├── electron/
   │       ├── build/
   │       └── package.json
   └── (other dll files...)
   ```

3. **Copy these from your Mac to Windows:**
   - Copy entire `electron` folder → `resources/app/electron/`
   - Copy entire `build` folder → `resources/app/build/`  
   - Copy `package.json` → `resources/app/package.json`

4. **On Windows, install dependencies:**
   ```cmd
   cd resources\app
   npm install --production
   ```

5. **Run the app:**
   Double-click `electron.exe`

## Solution 3: Build Properly on Windows (Best)

Build directly on Windows for best results:

```cmd
# On Windows machine
git clone <your-repo>
cd csv-precision-converter
npm install
npm run dist:win
```

This creates a proper installer with all files included.

## Why This Error Happens

The Electron app needs this structure:
```
electron.exe
└── resources/
    └── app/         ← Your app files (was missing!)
        ├── electron/    (main process)
        ├── build/       (React app)
        ├── node_modules/ (dependencies)
        └── package.json
```

The original build was missing the `resources/app` folder with your actual application code.

## Testing the Fix

After applying any solution above:
1. Double-click `electron.exe` 
2. App should launch without errors
3. All features (Settings, Templates) should work

## Still Having Issues?

Try these:
- Run as Administrator
- Check Windows Defender isn't blocking
- Install Visual C++ Redistributables
- Make sure all files extracted properly (no corruption)
