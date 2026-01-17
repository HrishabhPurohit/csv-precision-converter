# 🔧 Fixing Blank Screen on Windows

## Quick Diagnosis Steps

I've created **diagnostic tools** in the new version to help identify the issue:

### 1. Use Debug Mode (Recommended)

Extract `CSV-Converter-Windows-Fixed-v2.zip` and:

1. **Run `debug-mode.bat`**
   - This will open the app with diagnostics
   - Shows a test page first
   - Opens DevTools automatically
   - Shows file paths and errors

2. **What you should see:**
   - A purple test page saying "Electron is Working!"
   - System information
   - Debug information in DevTools console

3. **Report back:**
   - What appears on screen?
   - Any errors in the console (F12)?
   - Does the test page load?

### 2. Manual Check

If debug mode doesn't work:

1. **Open the folder** where you extracted the app
2. **Check this structure exists:**
   ```
   CSV-Precision-Converter/
   ├── electron.exe
   ├── resources/
   │   └── app/
   │       ├── electron/
   │       │   └── main.js
   │       ├── build/
   │       │   ├── index.html
   │       │   └── static/
   │       │       ├── css/
   │       │       └── js/
   │       └── package.json
   ```

3. **Verify files exist:**
   - `resources/app/build/index.html` - Must exist!
   - `resources/app/build/static/js/main.*.js` - Must exist!
   - `resources/app/build/static/css/main.*.css` - Must exist!

### 3. Common Fixes

#### Fix A: Security Software
Windows Defender or antivirus might be blocking:
1. Right-click `electron.exe`
2. Select "Properties"
3. Check "Unblock" if present
4. Apply to all files in folder

#### Fix B: Missing Visual C++ Redistributables
1. Download from Microsoft: [VC++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe)
2. Install and restart
3. Try the app again

#### Fix C: Run with Console
Open Command Prompt in the app folder:
```cmd
electron.exe --enable-logging --log-level=0
```
This shows detailed errors in the console.

### 4. Alternative Solutions

#### Solution 1: Use Developer Mode
1. Press `Windows + I`
2. Go to "Update & Security" → "For developers"
3. Enable "Developer mode"
4. Try running the app again

#### Solution 2: Run as Administrator
1. Right-click `electron.exe`
2. Select "Run as administrator"
3. Allow if prompted

#### Solution 3: Check WebView2
The app might need Edge WebView2:
1. Download: [Edge WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
2. Install the Evergreen Runtime
3. Restart and try again

### 5. What's in the New Version (v2)

The `CSV-Converter-Windows-Fixed-v2.zip` includes:
- ✅ Fixed path handling for Windows
- ✅ Debug mode batch file
- ✅ Test HTML page for diagnosis
- ✅ Better error reporting
- ✅ DevTools enabled for debugging
- ✅ Console logging for troubleshooting

### 6. If Nothing Works

Create a simple test:

1. In the app folder, create `test-direct.bat`:
```batch
@echo off
cd resources\app\build
start index.html
```

2. Run it - this opens the app in your browser
3. If it works in browser but not Electron, it's a path issue

### 7. Information to Share

Please share:
1. **Windows version** (Win 10/11, 32/64-bit)
2. **Error messages** from console or DevTools
3. **What debug-mode.bat shows**
4. **Antivirus software** you're using
5. **Screenshot** of the app window (even if blank)

## Emergency Workaround

If urgent, use the web version:
1. Install Node.js on Windows
2. Extract the source code
3. Run:
```cmd
npm install
npm start
```
4. Opens in browser at http://localhost:3000

## File Structure Verification

Run this PowerShell command in the app folder:
```powershell
Get-ChildItem -Recurse | Where-Object {$_.Name -match "index.html|main.js"} | Select FullName
```

This shows if files are in the right places.

---

The v2 version should work, but if not, the debug tools will help us identify the exact issue!
