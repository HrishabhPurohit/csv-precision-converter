# CSV Precision Converter

A visual CSV converter with cell-level mapping designed specifically for medical invoice conversion. This desktop application allows you to precisely map cells from messy source CSVs to a strict target format.

## Features

### 🎯 Visual Cell-Level Mapping
- Click on any cell in the source CSV to map it
- Context menu shows all available mapping options
- Visual indicators show mapped cells with different colors
- Auto-detection of item rows when you click on one

### 🧮 Automatic Tax Calculation
- IGST: 2.5% of total bill amount
- CGST: 2.5% of total bill amount
- Total GST: 5% automatically calculated

### 📊 Smart Item Row Detection
- Click on any item row to auto-detect similar rows
- Intelligent pattern matching finds all item entries
- Works with irregular and unstructured CSVs

### 💾 Template System
- Save your mappings as templates
- Load templates for similar invoices
- Speed up conversion for recurring formats

### 🏢 Company Abbreviation Logic
- Automatically generates company codes
- IPL for Intas, DRL for Dr. Reddy's, CPL for Cipla, etc.
- Extensible abbreviation system

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

## Keyboard Shortcuts

- **Cmd/Ctrl+O** - Open CSV file
- **Cmd/Ctrl+S** - Save mapping template
- **Cmd/Ctrl+L** - Load mapping template
- **Cmd/Ctrl+E** - Export converted CSV
- **F12** - Toggle developer tools

## Color Legend

- 🟢 Green - Company information
- 🔵 Blue - GST number
- 🌸 Pink - Invoice date
- 🟡 Yellow - Item rows
- 🔷 Light Blue - Price fields

## Installation

### Development
```bash
npm install
npm start
```

### Production Build
```bash
# Build for all platforms
npm run dist

# Platform-specific builds
npm run dist:mac
npm run dist:win
npm run dist:linux
```

## Requirements

- Node.js 16+ (Recommended: Node 18)
- npm or yarn
- For development: Chrome/Chromium browser

## Technologies Used

- **Electron** - Desktop application framework
- **React** - User interface library
- **Papa Parse** - CSV parsing
- **Styled Components** - Styling (optional)

## Troubleshooting

### CSV Not Loading Properly?
- Check for null bytes in the source file
- Ensure file is UTF-8 encoded
- Try saving the CSV in a different program first

### Item Rows Not Detected?
- Make sure to click on a row with actual item data
- Check that the row has similar structure to other item rows
- Manually map key columns if auto-detection fails

### Tax Calculations
- IGST and CGST are always 2.5% each of the total amount
- Total GST is 5% of the bill amount
- Calculations are done on Column V values

## License

Proprietary - CSV Precision Converter © 2024
