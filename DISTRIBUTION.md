# Distribution Guide for CSV Precision Converter

## 📦 Windows Distribution

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Code signing certificate (optional, for trusted installations)

### Building for Windows

#### From Windows Machine
```bash
# Clone the repository
git clone <your-repo-url>
cd csv-precision-converter

# Install dependencies
npm install

# Build for Windows
npm run dist:win
```

#### From Mac/Linux (Cross-compilation)
```bash
# Build for Windows from Mac/Linux
npm run dist:win
```

### Output Files

After building, you'll find these files in the `dist` folder:

1. **`CSV Precision Converter Setup X.X.X.exe`**
   - NSIS installer (recommended)
   - Includes auto-update support
   - Creates Start Menu shortcuts
   - Size: ~80-100 MB

2. **`CSV Precision Converter-X.X.X-win.zip`**
   - Portable version
   - No installation required
   - Extract and run
   - Size: ~80-100 MB

3. **`.nupkg` files**
   - For Squirrel.Windows auto-updates
   - Not for direct distribution

## 🚀 Distribution Methods

### Method 1: Direct Download
1. Upload the `.exe` installer to your server
2. Share the download link
3. Users download and install

### Method 2: GitHub Releases
1. Create a new release on GitHub
2. Upload the installer files
3. Users download from releases page

### Method 3: Microsoft Store (Optional)
1. Convert to MSIX package
2. Submit to Microsoft Store
3. Users install from Store

### Method 4: Corporate Deployment
For enterprise deployment:
```powershell
# Silent installation
"CSV Precision Converter Setup.exe" /S

# With custom directory
"CSV Precision Converter Setup.exe" /S /D=C:\CustomPath
```

## 📝 Installation Instructions for End Users

### Windows Installation

1. **Download** the installer (`CSV Precision Converter Setup X.X.X.exe`)

2. **Run the installer**
   - You may see a Windows SmartScreen warning
   - Click "More info" → "Run anyway"
   - This happens with unsigned apps

3. **Follow installation wizard**
   - Choose installation directory
   - Create desktop shortcut (optional)
   - Create Start Menu entry

4. **Launch the application**
   - From Desktop shortcut
   - From Start Menu
   - From installation directory

### Portable Version (No Installation)

1. **Download** the ZIP file
2. **Extract** to any location
3. **Run** `CSV Precision Converter.exe`
4. **Create shortcut** (optional)

## 🔐 Code Signing (Recommended)

To avoid security warnings, sign your Windows executable:

### Option 1: Self-Signed Certificate (Testing)
```powershell
# Create certificate
New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=Your Company" -CertStoreLocation Cert:\CurrentUser\My

# Sign the executable
Set-AuthenticodeSignature "dist\CSV Precision Converter Setup.exe" -Certificate (Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert)
```

### Option 2: Commercial Certificate
1. Purchase from DigiCert, Sectigo, etc. (~$200-500/year)
2. Configure in `electron-builder`:
```json
{
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "your-password"
  }
}
```

## 📊 System Requirements

### Minimum Requirements
- **OS**: Windows 7 SP1 or later (64-bit)
- **RAM**: 2 GB
- **Storage**: 200 MB
- **Display**: 1280x720 resolution

### Recommended Requirements
- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4 GB+
- **Storage**: 500 MB
- **Display**: 1920x1080 resolution

## 🔄 Auto-Update Setup

### For Windows (Using electron-updater)

1. **Configure update server** in `package.json`:
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "csv-precision-converter"
    }
  }
}
```

2. **Enable auto-updates** in `electron/main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## 🛠️ Troubleshooting

### Common Issues

#### Windows Defender SmartScreen
- **Issue**: "Windows protected your PC" warning
- **Solution**: Sign your app or instruct users to click "More info" → "Run anyway"

#### Missing Dependencies
- **Issue**: App won't start, shows DLL errors
- **Solution**: Install Visual C++ Redistributables

#### Antivirus False Positives
- **Issue**: Antivirus blocks the app
- **Solution**: Submit for whitelisting to major AV vendors

### Build Errors

#### "Cannot create symbolic link"
- Run build command as Administrator
- Or disable symlinks in electron-builder config

#### "ENOENT: no such file"
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📈 Distribution Checklist

- [ ] Test on Windows 7, 10, 11
- [ ] Test both 32-bit and 64-bit versions
- [ ] Verify all features work
- [ ] Check file associations (if any)
- [ ] Test auto-updater
- [ ] Sign the executable
- [ ] Create installer graphics/icons
- [ ] Write user documentation
- [ ] Prepare support channels
- [ ] Set up crash reporting (optional)

## 📞 Support Information

Include this in your distribution:

```
CSV Precision Converter v1.0.0
Support: support@yourcompany.com
Documentation: https://yoursite.com/docs
License: Proprietary

System Information:
- Windows 7 SP1 or later required
- 64-bit processor recommended
- Internet connection for updates
```

## 🌐 Multi-Language Support

For international distribution:

1. Add language files in `src/locales/`
2. Use i18n library (react-i18next)
3. Build separate installers per language
4. Or include all languages in one installer

## 📦 Sample PowerShell Deployment Script

For IT administrators deploying to multiple machines:

```powershell
# Deploy CSV Precision Converter
$InstallerUrl = "https://yourserver.com/CSV-Precision-Setup.exe"
$InstallerPath = "$env:TEMP\CSV-Precision-Setup.exe"

# Download installer
Invoke-WebRequest -Uri $InstallerUrl -OutFile $InstallerPath

# Silent install
Start-Process -FilePath $InstallerPath -ArgumentList "/S" -Wait

# Create desktop shortcut for all users
$ShortcutPath = "C:\Users\Public\Desktop\CSV Converter.lnk"
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "C:\Program Files\CSV Precision Converter\CSV Precision Converter.exe"
$Shortcut.Save()

# Clean up
Remove-Item $InstallerPath
```

## 🎯 Marketing Distribution

### Feature Highlights for Users
- ✅ No internet required (works offline)
- ✅ Fast and lightweight
- ✅ Saves templates locally
- ✅ Handles large CSV files
- ✅ Professional interface
- ✅ Regular updates

### Pricing Models
1. **Free with limitations**: Limited rows/templates
2. **One-time purchase**: Full version for ₹4,999
3. **Subscription**: ₹499/month with cloud sync
4. **Enterprise**: Custom pricing with support

---

For more information or support, contact the development team.
