# CSV Precision Converter

A professional web application for converting medical invoice CSV files to standardized formats. Built with React, featuring visual cell-level mapping and intelligent pattern detection.

🌐 **Live Demo**: https://HrishabhPurohit.github.io/csv-precision-converter

## Features

### Visual CSV Mapping
- **Interactive Grid View**: See your CSV data in a spreadsheet-like interface
- **Cell-Level Mapping**: Click any cell to map it to output fields
- **Pattern Detection**: Automatically detect and map similar item rows
- **Real-time Preview**: See the converted output before exporting

### Smart Conversion
- **Company Recognition**: Automatically abbreviate company names (Intas → IPL, Dr. Reddy's → DRL, etc.)
- **Flexible Date Formats**: Handles DD/MM/YYYY, YYYY-MM-DD, DDMMYYYY, and more
- **Tax Mapping**: Map IGST/CGST from source or auto-calculate at 2.5%
- **HSN Code Support**: Map or use default HSN codes for medicines
- **Safe Defaults**: Robust validation prevents corrupted CSV output

### Template System
- **Save Mappings**: Save your column mappings as templates
- **Company-Specific**: Organize templates by company
- **Quick Load**: Reuse templates for similar invoices
- **Browser Storage**: Templates persist in your browser

### User-Configurable Settings
- **Custom Company Codes**: Add, edit, or remove company abbreviations
- **Persistent Storage**: Settings saved in browser localStorage
- **Import/Export**: Backup and restore your settings as JSON

## Target CSV Structure

The application converts to a strict 3-part structure:

1. **Header Row (H)** - Invoice metadata
   - Row Type: "H"
   - GST Number
   - Invoice Date (DDMMYYYY)
   - Fixed values for system fields

2. **Transaction Rows (T)** - Item details
   - Row Type: "T"
   - Company abbreviation and name
   - Item details (name, batch, expiry)
   - Pricing (MRP, PTR, PTS)
   - Quantity
   - Total amount (Column V)
   - Tax calculations (IGST, CGST at 2.5% each)

3. **Footer Row (F)** - Summary totals
   - Row Type: "F"
   - Grand total
   - Total taxes
   - Final amount with taxes

## How to Use

### 1. Load Source CSV
- Drag and drop your CSV file onto the upload area
- Or use File → Open CSV (Cmd/Ctrl+O)
- Or click "Browse Files" button

### 2. Map Header Information
Click on cells containing:
- 🏢 Company Name (Required)
- 📋 GST Number (Required)
- 📅 Invoice Date (Optional - uses today if not mapped)
- 🔢 Invoice Number (Optional)

### 3. Map Item Rows
- Click on any row containing item details
- Select "📦 Item Row" from the context menu
- The app will auto-detect all similar rows

### 4. Map Item Columns
After detecting item rows, click on specific cells to map:
- 💊 Item Name
- 🏷️ Batch Number
- 💰 MRP
- 💵 PTR (Price to Retailer)
- 💴 PTS (Price to Stockist)
- 📊 Quantity
- 💲 Total Bill Amount

### 5. Convert
- Click "Convert to Target Format" button
- Review the preview
- Export as CSV

## Color Legend

- 🟢 Green - Company information
- 🔵 Blue - GST number
- 🌸 Pink - Invoice date
- 🟡 Yellow - Item rows
- 🔷 Light Blue - Price fields

## Development

### Run Locally
```bash
npm install
npm start
# Opens at http://localhost:3000
```

### Build for Production
```bash
npm run build
# Creates optimized build in /build folder
```

### Deploy to GitHub Pages
```bash
npm run deploy
# Deploys to https://HrishabhPurohit.github.io/csv-precision-converter
```

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- For development: Node.js 16+ (Recommended: Node 18)

## Technologies Used

- **React** - User interface library
- **Papa Parse** - CSV parsing and generation
- **Browser APIs** - File handling and localStorage

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### CSV Not Loading Properly?
- Check for null bytes in the source file
- Ensure file is UTF-8 encoded
- Try saving the CSV in a different program first
- Check browser console for errors (F12)

### Item Rows Not Detected?
- Make sure to click on a row with actual item data
- Check that the row has similar structure to other item rows
- Manually map key columns if auto-detection fails

### Tax Calculations
- IGST and CGST can be mapped from source CSV
- If not mapped, defaults to 2.5% each of the total amount
- Total GST is 5% of the bill amount
- Calculations are done on Column V values

### Settings Not Persisting?
- Ensure browser cookies/localStorage is enabled
- Check browser privacy settings
- Try a different browser

## Privacy & Security

- ✅ All processing happens in your browser
- ✅ No data sent to servers
- ✅ Files stay on your device
- ✅ Settings stored locally only
- ✅ Works completely offline after first load

## License

Proprietary - CSV Precision Converter © 2024
