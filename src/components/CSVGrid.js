import React, { useState } from 'react';
import './CSVGrid.css';

const CSVGrid = ({ data, onCellSelect, detectedItemRows, cellMappings, onFileUpload }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const handleCellClick = (rowIndex, colIndex, value) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setContextMenu({
      x: window.event.clientX,
      y: window.event.clientY,
      row: rowIndex,
      col: colIndex,
      value: value
    });
  };

  const handleContextMenuSelect = (fieldType) => {
    if (contextMenu) {
      onCellSelect(contextMenu.row, contextMenu.col, contextMenu.value, fieldType);
    }
    setContextMenu(null);
  };

  const getCellClass = (rowIndex, colIndex) => {
    let classes = ['grid-cell'];
    
    // Check if cell is selected
    if (selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex) {
      classes.push('selected');
    }
    
    // Check if row is detected as item row
    if (detectedItemRows.includes(rowIndex)) {
      classes.push('item-row');
    }
    
    // Check if cell is mapped
    Object.entries(cellMappings).forEach(([fieldType, mapping]) => {
      if (mapping && mapping.row === rowIndex && mapping.col === colIndex) {
        classes.push('mapped');
        classes.push(`mapped-${fieldType.toLowerCase().replace(/_/g, '-')}`);
      }
    });
    
    return classes.join(' ');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!data || data.length === 0) {
    return (
      <div 
        className="empty-grid"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-area">
          <h3>📁 Load CSV File</h3>
          <p>Drag and drop your CSV file here or use File → Open CSV</p>
          <input
            type="file"
            accept=".csv,.CSV"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileUpload(e.target.files[0]);
              }
            }}
            style={{ display: 'none' }}
            id="file-input"
          />
          <button 
            className="btn-primary"
            onClick={() => document.getElementById('file-input').click()}
          >
            Browse Files
          </button>
        </div>
      </div>
    );
  }

  // Generate column headers (A, B, C, ...)
  const maxCols = Math.max(...data.map(row => row ? row.length : 0));
  const columnHeaders = Array.from({ length: maxCols }, (_, i) => 
    String.fromCharCode(65 + (i % 26)) + (Math.floor(i / 26) > 0 ? Math.floor(i / 26) : '')
  );

  return (
    <div className="csv-grid-container">
      <h3>Source CSV - Click cells to map them</h3>
      <div className="grid-wrapper">
        <table className="csv-grid">
          <thead>
            <tr>
              <th className="row-header"></th>
              {columnHeaders.map((col, index) => (
                <th key={index} className="col-header">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="row-header">{rowIndex + 1}</td>
                {Array.from({ length: maxCols }, (_, colIndex) => {
                  const value = row && row[colIndex] !== undefined ? row[colIndex] : '';
                  return (
                    <td
                      key={colIndex}
                      className={getCellClass(rowIndex, colIndex)}
                      onClick={() => handleCellClick(rowIndex, colIndex, value)}
                      title={value ? value.toString() : ''}
                    >
                      <div className="cell-content">
                        {value ? value.toString() : ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <>
          <div className="context-menu-backdrop" onClick={() => setContextMenu(null)} />
          <div 
            className="context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div className="menu-header">Map this cell as:</div>
            <button onClick={() => handleContextMenuSelect('COMPANY_NAME')}>
              🏢 Company Name
            </button>
            <button onClick={() => handleContextMenuSelect('GST_NUMBER')}>
              📋 GST Number
            </button>
            <button onClick={() => handleContextMenuSelect('INVOICE_DATE')}>
              📅 Invoice Date
            </button>
            <button onClick={() => handleContextMenuSelect('INVOICE_NUMBER')}>
              🔢 Invoice Number
            </button>
            <div className="menu-divider"></div>
            <button onClick={() => handleContextMenuSelect('ITEM_ROW')}>
              📦 Item Row (auto-detect similar rows)
            </button>
            <button onClick={() => handleContextMenuSelect('ITEM_NAME')}>
              💊 Item Name
            </button>
            <button onClick={() => handleContextMenuSelect('BATCH_NUMBER')}>
              🏷️ Batch Number
            </button>
            <button onClick={() => handleContextMenuSelect('MRP')}>
              💰 MRP
            </button>
            <button onClick={() => handleContextMenuSelect('PTR')}>
              💵 PTR (Price to Retailer)
            </button>
            <button onClick={() => handleContextMenuSelect('PTS')}>
              💴 PTS (Price to Stockist)
            </button>
            <button onClick={() => handleContextMenuSelect('QUANTITY')}>
              📊 Quantity
            </button>
            <button onClick={() => handleContextMenuSelect('TOTAL_AMOUNT')}>
              💲 Total Bill Amount
            </button>
            <button onClick={() => handleContextMenuSelect('EXPIRY_DATE')}>
              📅 Expiry Date
            </button>
            <button onClick={() => handleContextMenuSelect('HSN_CODE')}>
              🔢 HSN Code
            </button>
            <div className="menu-divider"></div>
            <button onClick={() => setContextMenu(null)}>❌ Cancel</button>
          </div>
        </>
      )}

      <div className="grid-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <span className="legend-item">
            <span className="legend-color mapped-company-name"></span> Company Info
          </span>
          <span className="legend-item">
            <span className="legend-color mapped-gst-number"></span> GST Number
          </span>
          <span className="legend-item">
            <span className="legend-color mapped-invoice-date"></span> Date
          </span>
          <span className="legend-item">
            <span className="legend-color item-row"></span> Item Rows
          </span>
        </div>
      </div>
    </div>
  );
};

export default CSVGrid;
