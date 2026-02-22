import settingsManager from './SettingsManager';

class ConversionEngine {
  constructor() {
    // Company abbreviations now managed by SettingsManager
  }

  getCompanyAbbreviation(companyName) {
    return settingsManager.getCompanyAbbreviation(companyName);
  }

  formatDate(dateStr) {
    if (!dateStr || dateStr === '') {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      return dd + mm + yyyy;
    }

    // Convert to string and remove any whitespace
    const cleaned = dateStr.toString().trim().replace(/\s+/g, '');
    
    // Try DDMMYYYY (already in correct format - 8 digits, no separators)
    if (/^\d{8}$/.test(cleaned)) {
      const dd = cleaned.substring(0, 2);
      const mm = cleaned.substring(2, 4);
      const yyyy = cleaned.substring(4, 8);
      
      // Validate it's a reasonable date
      const day = parseInt(dd);
      const month = parseInt(mm);
      const year = parseInt(yyyy);
      
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2099) {
        return dd + mm + yyyy;
      }
    }
    
    // Remove non-digit characters for other formats
    const digitsOnly = cleaned.replace(/[^\d]/g, '');
    
    // Try DD/MM/YYYY or DD-MM-YYYY
    let match = cleaned.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (match) {
      const dd = match[1].padStart(2, '0');
      const mm = match[2].padStart(2, '0');
      const yyyy = match[3];
      return dd + mm + yyyy;
    }

    // Try YYYY-MM-DD or YYYY/MM/DD
    match = cleaned.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (match) {
      const yyyy = match[1];
      const mm = match[2].padStart(2, '0');
      const dd = match[3].padStart(2, '0');
      return dd + mm + yyyy;
    }

    // Try YYYYMMDD (convert to DDMMYYYY)
    if (/^\d{8}$/.test(digitsOnly)) {
      const yyyy = digitsOnly.substring(0, 4);
      const mm = digitsOnly.substring(4, 6);
      const dd = digitsOnly.substring(6, 8);
      
      const year = parseInt(yyyy);
      if (year >= 1900 && year <= 2099) {
        return dd + mm + yyyy;
      }
    }

    // Fallback to today's date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + mm + yyyy;
  }

  parseNumber(value) {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  formatNumber(value, decimals = 2) {
    const num = this.parseNumber(value);
    return num.toFixed(decimals);
  }

  calculateTax(totalAmount, rate = 2.5) {
    const amount = this.parseNumber(totalAmount);
    return (amount * rate / 100).toFixed(2);
  }

  convertToTargetFormat(sourceData, cellMappings, itemRows, itemRowsPattern) {
    const outputRows = [];
    
    // Extract header information
    const companyName = cellMappings.COMPANY_NAME?.value || '';
    const companyAbbr = this.getCompanyAbbreviation(companyName);
    const gstNumber = cellMappings.GST_NUMBER?.value || '';
    const invoiceDate = this.formatDate(cellMappings.INVOICE_DATE?.value);
    
    // Create Header row (H)
    const headerRow = [
      'H',                    // Column A: Always "H"
      '1.0',                  // Column B: Always "1.0"
      gstNumber,              // Column C: GST Number
      invoiceDate,            // Column D: Invoice Date (DDMMYYYY)
      '',                     // Column E: Blank
      '',                     // Column F: Blank
      'Bank',                 // Column G: Always "Bank"
      '1',                    // Column H: Always "1"
      '',                     // Column I: Blank
      '',                     // Column J: Blank
      '',                     // Column K: Blank
      '',                     // Column L: Blank
      '',                     // Column M: Blank
      'BHILAI (CG)',         // Column N: Always "BHILAI (CG)"
      '',                     // Column O: Blank
      '0'                     // Column P: Always "0"
    ];
    outputRows.push(headerRow.join(','));

    // Process item rows
    let grandTotal = 0;
    let totalIGST = 0;
    let totalCGST = 0;

    itemRows.forEach(rowIndex => {
      const row = sourceData[rowIndex];
      if (!row) return;

      // Extract item details based on column mappings with safe defaults
      const itemName = cellMappings.ITEM_NAME && row[cellMappings.ITEM_NAME.col] ? 
        String(row[cellMappings.ITEM_NAME.col]).trim() : '';
      
      const batchNumber = cellMappings.BATCH_NUMBER && row[cellMappings.BATCH_NUMBER.col] ? 
        String(row[cellMappings.BATCH_NUMBER.col]).trim() : '';
      
      const mrp = cellMappings.MRP && row[cellMappings.MRP.col] !== undefined && row[cellMappings.MRP.col] !== '' ? 
        this.parseNumber(row[cellMappings.MRP.col]) : 0;
      
      const ptr = cellMappings.PTR && row[cellMappings.PTR.col] !== undefined && row[cellMappings.PTR.col] !== '' ? 
        this.parseNumber(row[cellMappings.PTR.col]) : (mrp > 0 ? mrp * 0.6 : 0);
      
      const pts = cellMappings.PTS && row[cellMappings.PTS.col] !== undefined && row[cellMappings.PTS.col] !== '' ? 
        this.parseNumber(row[cellMappings.PTS.col]) : (mrp > 0 ? mrp * 0.55 : 0);
      
      const quantity = cellMappings.QUANTITY && row[cellMappings.QUANTITY.col] !== undefined && row[cellMappings.QUANTITY.col] !== '' ? 
        this.parseNumber(row[cellMappings.QUANTITY.col]) : 1;
      
      const totalAmount = cellMappings.TOTAL_AMOUNT && row[cellMappings.TOTAL_AMOUNT.col] !== undefined && row[cellMappings.TOTAL_AMOUNT.col] !== '' ? 
        this.parseNumber(row[cellMappings.TOTAL_AMOUNT.col]) : (ptr > 0 ? ptr * quantity : 0);
      
      // Get IGST - use mapped amount if available, otherwise calculate at 2.5%
      let igst;
      if (cellMappings.IGST && row[cellMappings.IGST.col] !== undefined && row[cellMappings.IGST.col] !== '') {
        // Use the mapped tax amount directly
        igst = this.formatNumber(this.parseNumber(row[cellMappings.IGST.col]));
      } else {
        // No mapping - calculate at 2.5% rate
        igst = this.calculateTax(totalAmount, 2.5);
      }
      
      // Get CGST - use mapped amount if available, otherwise calculate at 2.5%
      let cgst;
      if (cellMappings.CGST && row[cellMappings.CGST.col] !== undefined && row[cellMappings.CGST.col] !== '') {
        // Use the mapped tax amount directly
        cgst = this.formatNumber(this.parseNumber(row[cellMappings.CGST.col]));
      } else {
        // No mapping - calculate at 2.5% rate
        cgst = this.calculateTax(totalAmount, 2.5);
      }
      
      grandTotal += totalAmount;
      totalIGST += parseFloat(igst);
      totalCGST += parseFloat(cgst);

      // Get expiry date if available (format DDMMYYYY) with validation
      let expiryDate = '31122025'; // Default expiry date
      if (cellMappings.EXPIRY_DATE && row[cellMappings.EXPIRY_DATE.col] !== undefined && row[cellMappings.EXPIRY_DATE.col] !== '') {
        const formattedDate = this.formatDate(row[cellMappings.EXPIRY_DATE.col]);
        // Ensure it's 8 digits
        expiryDate = /^\d{8}$/.test(formattedDate) ? formattedDate : '31122025';
      }

      // Get HSN code if available with validation
      let hsnCode = '30049099'; // Default HSN for medicines
      if (cellMappings.HSN_CODE && row[cellMappings.HSN_CODE.col] !== undefined && row[cellMappings.HSN_CODE.col] !== '') {
        const rawHsn = String(row[cellMappings.HSN_CODE.col]).trim();
        // Ensure HSN is valid (numeric, typically 4-8 digits)
        hsnCode = /^\d{4,8}$/.test(rawHsn) ? rawHsn : '30049099';
      }

      // Create Transaction row (T)
      const transactionRow = [
        'T',                              // Column A: Always "T" for item rows
        companyAbbr,                      // Column B: Company abbreviation
        companyName,                      // Column C: Company full name
        '',                               // Column D: Empty for item rows
        '',                               // Column E: Blank
        itemName,                         // Column F: Item name
        '',                               // Column G: Blank
        '',                               // Column H: Blank
        batchNumber,                      // Column I: Batch number
        expiryDate,                       // Column J: Expiry date
        this.formatNumber(ptr),           // Column K: PTR
        this.formatNumber(pts),           // Column L: PTS
        this.formatNumber(mrp),           // Column M: MRP
        '0',                              // Column N: Always "0"
        '',                               // Column O: Blank
        quantity.toString(),              // Column P: Quantity
        '0',                              // Column Q: Always "0"
        '',                               // Column R: Blank
        '',                               // Column S: Blank
        '',                               // Column T: Blank
        '',                               // Column U: Blank
        this.formatNumber(totalAmount),   // Column V: Total bill amount
        '2.5',                            // Column W: Always "2.5"
        igst,                             // Column X: IGST (2.5% of total)
        '0',                              // Column Y: Always "0"
        '0',                              // Column Z: Always "0"
        '2.5',                            // Column AA: Always "2.5"
        cgst,                             // Column AB: CGST (2.5% of total)
        '',                               // Column AC: Blank
        '',                               // Column AD: Blank
        hsnCode                           // Column AE: HSN Code
      ];
      outputRows.push(transactionRow.join(','));
    });

    // Create Footer row (F)
    const footerRow = [
      'F',                                    // Column A: Always "F"
      this.formatNumber(grandTotal),          // Column B: Grand total
      '',                                     // Column C: Blank
      '',                                     // Column D: Blank
      this.formatNumber(totalIGST + totalCGST), // Column E: Total tax
      '0',                                    // Column F: Always "0"
      this.formatNumber(totalIGST + totalCGST), // Column G: Total tax again
      '0',                                    // Column H: Always "0"
      '',                                     // Column I-N: Blank
      '',
      '',
      '',
      '',
      '',
      '',                                     // Column O: Blank
      '',                                     // Column P: Blank
      '',                                     // Column Q: Blank
      '',                                     // Column R: Blank
      '',                                     // Column S: Blank
      '',                                     // Column T: Blank
      '0.32',                                 // Column U: Fixed value
      this.formatNumber(grandTotal * 1.05)    // Column V: Grand total with tax
    ];
    outputRows.push(footerRow.join(','));

    return outputRows;
  }
}

export default ConversionEngine;
