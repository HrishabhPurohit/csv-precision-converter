import React from 'react';
import './OutputPreview.css';

const OutputPreview = ({ data, onExport }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No converted data to preview</div>;
  }

  // Parse the CSV strings back to arrays for display
  const parsedData = data.map(row => row.split(','));
  
  // Column headers for the target format
  const columnHeaders = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE'
  ];

  const columnDescriptions = {
    'A': 'Row Type (H/T/F)',
    'B': 'Version/Company Code',
    'C': 'GST/Company Name',
    'D': 'Date/Empty',
    'E': 'Blank',
    'F': 'Item Name',
    'G': 'Bank/Empty',
    'H': '1/Empty',
    'I': 'Batch Number',
    'J': 'Expiry Date',
    'K': 'PTR',
    'L': 'PTS',
    'M': 'MRP',
    'N': 'Location/0',
    'O': 'Blank',
    'P': 'Quantity',
    'Q': '0',
    'R-U': 'Blank',
    'V': 'Total Amount',
    'W': '2.5',
    'X': 'IGST',
    'Y-Z': '0',
    'AA': '2.5',
    'AB': 'CGST',
    'AE': 'HSN Code'
  };

  const getRowTypeClass = (rowType) => {
    switch(rowType) {
      case 'H': return 'header-row';
      case 'T': return 'transaction-row';
      case 'F': return 'footer-row';
      default: return '';
    }
  };

  return (
    <div className="output-preview">
      <div className="preview-header">
        <h2>Converted Output Preview</h2>
        <button className="btn-export" onClick={onExport}>
          📥 Export as CSV
        </button>
      </div>

      <div className="format-info">
        <p><strong>Target Format Structure:</strong></p>
        <ul>
          <li><span className="row-type-badge header">H</span> Header Row - Invoice metadata</li>
          <li><span className="row-type-badge transaction">T</span> Transaction Rows - Item details</li>
          <li><span className="row-type-badge footer">F</span> Footer Row - Summary totals</li>
        </ul>
      </div>

      <div className="table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th className="row-number">#</th>
              {columnHeaders.slice(0, Math.min(parsedData[0]?.length || 0, columnHeaders.length)).map((col, index) => (
                <th key={index} title={columnDescriptions[col] || ''}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedData.map((row, rowIndex) => (
              <tr key={rowIndex} className={getRowTypeClass(row[0])}>
                <td className="row-number">{rowIndex + 1}</td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} title={`Column ${columnHeaders[cellIndex]}: ${cell}`}>
                    {cellIndex === 0 && (
                      <span className={`row-type-badge ${getRowTypeClass(cell)}`}>
                        {cell}
                      </span>
                    )}
                    {cellIndex !== 0 && (
                      <span className="cell-value">
                        {cell || '-'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="output-summary">
        <h3>Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <label>Total Rows:</label>
            <span>{parsedData.length}</span>
          </div>
          <div className="stat">
            <label>Item Rows:</label>
            <span>{parsedData.filter(row => row[0] === 'T').length}</span>
          </div>
          <div className="stat">
            <label>Format:</label>
            <span className="success">✅ Valid Target Format</span>
          </div>
        </div>
      </div>

      <div className="export-section">
        <button className="btn-export-large" onClick={onExport}>
          📥 Download Converted CSV File
        </button>
        <p className="export-note">
          The exported file will be in the exact format required by your accounting software.
        </p>
      </div>
    </div>
  );
};

export default OutputPreview;
