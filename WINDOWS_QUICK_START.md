# 🚀 Windows Distribution Quick Start

## Build the Windows Installer (2 minutes)

```bash
# Simple one-command build
npm run dist:win

# Or use our build script
./build-windows.sh
```

## 📦 Output Files

After building, you'll find in `dist/` folder:
- **`CSV Precision Converter Setup 1.0.0.exe`** - Windows installer

## 🎯 3 Ways to Distribute

### 1️⃣ Direct Sharing (Easiest)
- Upload to Google Drive/Dropbox
- Share the download link
- Users download and install

### 2️⃣ Email Distribution
```
Subject: CSV Precision Converter - Installation File

Dear User,

Please find attached the CSV Precision Converter installer.

Installation steps:
1. Download the attached file
2. Double-click to install
3. If Windows shows a security warning, click "More info" → "Run anyway"

Best regards,
Your Team
```

### 3️⃣ WhatsApp/Teams Distribution
- Compress to ZIP if file is large
- Share via WhatsApp Web or Microsoft Teams
- Include installation instructions

## 📝 User Installation Guide

Share this with your users:

---

### Installing CSV Precision Converter

1. **Download** the installer file
2. **Double-click** the `.exe` file
3. **Security Warning?**
   - Click "More info"
   - Click "Run anyway"
   (This is normal for new software)
4. **Follow** the installation wizard
5. **Done!** Find it in Start Menu

### System Requirements
- Windows 7 or later
- 2GB RAM minimum
- 200MB disk space

---

## 💡 Pro Tips

### For Faster Distribution
- Use a URL shortener (bit.ly, tinyurl)
- Create a simple landing page
- Include screenshots

### For Corporate Users
```powershell
# Silent installation command
"CSV Precision Converter Setup.exe" /S
```

### Test Before Distributing
1. Test on Windows 10/11
2. Check all features work
3. Verify CSV conversion works

## 🆘 Troubleshooting

**"Windows protected your PC"**
→ This is normal. Click "More info" then "Run anyway"

**"Cannot start application"**
→ Install Visual C++ Redistributables from Microsoft

**Antivirus blocks the app**
→ Add exception in antivirus settings

## 📧 Support Template

```
CSV Precision Converter Support
Version: 1.0.0
Email: your-email@domain.com

Common Solutions:
- Run as Administrator if needed
- Check Windows is updated
- Disable antivirus temporarily for installation
```

## 🎉 Ready to Distribute!

Your app is ready for Windows users. Just:
1. Run `npm run dist:win`
2. Get the `.exe` from `dist/`
3. Share with your users!

---
*For advanced options, see DISTRIBUTION.md*
