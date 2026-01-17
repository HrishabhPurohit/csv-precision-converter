import Papa from 'papaparse';

export const parseCSV = (csvText) => {
  // Clean the text first - remove null bytes and carriage returns
  const cleanedText = csvText
    .replace(/\0/g, '')  // Remove null bytes
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\r/g, '\n');

  // First, try to parse with Papa Parse
  const result = Papa.parse(cleanedText, {
    header: false,  // Don't treat first row as headers
    skipEmptyLines: false,  // Keep empty lines to maintain structure
    delimiter: '',  // Auto-detect delimiter
    transformHeader: undefined,
    transform: (value) => {
      // Trim whitespace but preserve the value
      return value ? value.trim() : value;
    }
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors);
    
    // If Papa Parse fails, try manual parsing
    return manualParse(cleanedText);
  }

  return result.data;
};

const manualParse = (csvText) => {
  const lines = csvText.split('\n');
  const data = [];
  
  for (let line of lines) {
    // Skip completely empty lines
    if (!line || line.trim() === '') {
      data.push([]);
      continue;
    }
    
    // Try to detect the delimiter
    const delimiter = detectDelimiter(line);
    
    // Parse the line
    const row = parseCSVLine(line, delimiter);
    data.push(row);
  }
  
  return data;
};

const detectDelimiter = (line) => {
  const delimiters = [',', '\t', ';', '|'];
  let maxCount = 0;
  let bestDelimiter = ',';
  
  for (let delimiter of delimiters) {
    const count = (line.match(new RegExp(delimiter, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  }
  
  return bestDelimiter;
};

const parseCSVLine = (line, delimiter = ',') => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
};

export const generateCSV = (rows) => {
  return rows.join('\n');
};
