# Building the Installer on Windows

## Quick Steps (5 minutes on Windows)

1. **Transfer your code to Windows**
   - ZIP this entire folder
   - Transfer via USB/Cloud/Email

2. **On Windows machine, run:**
```cmd
# Extract the ZIP
# Open Command Prompt in the folder
cd csv-precision-converter

# Install dependencies
npm install

# Build the installer
npm run dist:win
```

3. **Find the installer:**
   - Location: `dist\CSV Precision Converter Setup 1.0.0.exe`
   - This is your distributable installer!

## Alternative: Use Windows in Cloud

Use a Windows VM or cloud service:
- **GitHub Codespaces** with Windows
- **Azure Virtual Desktop**
- **AWS WorkSpaces**
- **Parallels/VMware on your Mac**

## Why is Mac → Windows build slow?

- Cross-platform compilation overhead
- Architecture translation (ARM → x64)
- Wine emulation for NSIS installer
- Large node_modules packaging

Building natively on Windows is 10x faster!
