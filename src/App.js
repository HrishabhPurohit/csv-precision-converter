import React, { useState, useEffect } from 'react';
import './App.css';
import CSVGrid from './components/CSVGrid';
import MappingPanel from './components/MappingPanel';
import ConversionEngine from './utils/ConversionEngine';
import { parseCSV } from './utils/csvParser';
import OutputPreview from './components/OutputPreview';
import SettingsPanel from './components/SettingsPanel';
import TemplateManager from './components/TemplateManager';
import settingsManager from './utils/SettingsManager';

function App() {
  const [sourceData, setSourceData] = useState(null);
  const [cellMappings, setCellMappings] = useState({});
  const [itemRowsPattern, setItemRowsPattern] = useState(null);
  const [detectedItemRows, setDetectedItemRows] = useState([]);
  const [convertedData, setConvertedData] = useState(null);
  const [activeTab, setActiveTab] = useState('mapping');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    // Set up menu event listeners
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((event, action) => {
        if (action === 'menu-open-csv') {
          handleOpenCSV();
        } else if (action === 'menu-save-template') {
          handleSaveTemplate();
        } else if (action === 'menu-load-template') {
          handleLoadTemplate();
        } else if (action === 'menu-export') {
          handleExport();
        }
      });

      return () => {
        window.electronAPI.removeAllListeners();
      };
    }
  }, [cellMappings, convertedData]);

  const handleOpenCSV = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const parsed = parseCSV(event.target.result);
          setSourceData(parsed);
          setSuccess('CSV file loaded successfully!');
          setTimeout(() => setSuccess(null), 3000);
        };
        reader.onerror = () => {
          setError('Failed to read file');
        };
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      setError('Failed to open file: ' + error.message);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setError(null);
      const text = await file.text();
      const parsed = parseCSV(text);
      setSourceData(parsed);
      setSuccess('CSV file loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Error loading file: ${err.message}`);
    }
  };

  const handleCellSelect = (row, col, value, fieldType) => {
    const newMappings = { ...cellMappings };
    
    if (fieldType === 'ITEM_ROW') {
      // This is the first item row - detect pattern
      detectItemRowPattern(row, sourceData);
    } else {
      newMappings[fieldType] = { row, col, value };
    }
    
    setCellMappings(newMappings);
  };

  const detectItemRowPattern = (startRow, data) => {
    // Analyze the row to understand the pattern
    const itemRows = [];
    const firstRowData = data[startRow];
    
    // Look for similar rows below
    for (let i = startRow; i < data.length; i++) {
      const currentRow = data[i];
      // Check if row has similar structure (non-empty cells in similar positions)
      if (isItemRow(currentRow, firstRowData)) {
        itemRows.push(i);
      }
    }
    
    setDetectedItemRows(itemRows);
    setItemRowsPattern({
      startRow,
      columnMapping: analyzeItemColumns(firstRowData)
    });
  };

  const isItemRow = (row, pattern) => {
    // Simple heuristic: check if row has data in similar positions
    if (!row || row.length === 0) return false;
    
    // Count non-empty cells
    const nonEmptyCount = row.filter(cell => cell && cell.toString().trim() !== '').length;
    const patternNonEmpty = pattern.filter(cell => cell && cell.toString().trim() !== '').length;
    
    // If similar number of non-empty cells, likely an item row
    return nonEmptyCount >= patternNonEmpty - 2 && nonEmptyCount <= patternNonEmpty + 2;
  };

  const analyzeItemColumns = (row) => {
    // Try to auto-detect what each column might be
    const mapping = {};
    row.forEach((cell, index) => {
      const value = cell ? cell.toString().trim() : '';
      if (value) {
        // Simple heuristics for column detection
        if (value.match(/^\d+(\.\d{1,2})?$/) && parseFloat(value) > 100) {
          mapping[`col_${index}`] = 'MRP';
        } else if (value.match(/^[A-Z0-9-]+$/) && value.length > 4) {
          mapping[`col_${index}`] = 'BATCH';
        } else if (value.match(/^\d+$/)) {
          mapping[`col_${index}`] = 'QUANTITY';
        } else {
          mapping[`col_${index}`] = 'ITEM_NAME';
        }
      }
    });
    return mapping;
  };

  const handleConvert = () => {
    try {
      setError(null);
      
      if (!cellMappings.COMPANY_NAME) {
        setError('Please select company name cell');
        return;
      }
      
      if (!cellMappings.GST_NUMBER) {
        setError('Please select GST number cell');
        return;
      }
      
      if (detectedItemRows.length === 0) {
        setError('Please click on a row containing item details');
        return;
      }
      
      const engine = new ConversionEngine();
      const converted = engine.convertToTargetFormat(
        sourceData,
        cellMappings,
        detectedItemRows,
        itemRowsPattern
      );
      
      setConvertedData(converted);
      setActiveTab('preview');
      setSuccess('Data converted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Error converting data: ${err.message}`);
    }
  };

  const handleExport = async () => {
    if (!convertedData) {
      setError('No data to export. Please convert first.');
      return;
    }

    const csvContent = convertedData.join('\n');
    
    if (window.electronAPI) {
      const filePath = await window.electronAPI.saveFileDialog('converted_invoice.csv', csvContent);
      if (filePath) {
        setSuccess('File exported successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } else {
      // Fallback for browser
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_invoice.csv';
      a.click();
      URL.revokeObjectURL(url);
      setSuccess('File downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSaveTemplate = async () => {
    // Open Template Manager in save mode
    setShowTemplates(true);
  };

  const handleLoadTemplate = async () => {
    // Open Template Manager in load mode
    setShowTemplates(true);
  };
  
  const applyTemplate = (template) => {
    if (template) {
      setCellMappings(template.mappings || {});
      setItemRowsPattern(template.itemRowsPattern);
      if (template.detectedItemRows) {
        setDetectedItemRows(template.detectedItemRows);
      }
      setSuccess(`Template "${template.name}" loaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-text">
            <h1>CSV Precision Converter</h1>
            <p>Visual cell-level mapping for medical invoice conversion</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-header-action" 
              onClick={() => setShowTemplates(true)}
              title="Manage Templates"
            >
              📁 Templates
            </button>
            <button 
              className="btn-header-action" 
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'mapping' ? 'active' : ''}
          onClick={() => setActiveTab('mapping')}
        >
          Cell Mapping
        </button>
        <button 
          className={activeTab === 'preview' ? 'active' : ''}
          onClick={() => setActiveTab('preview')}
          disabled={!convertedData}
        >
          Preview Output
        </button>
      </div>

      <div className="main-container">
        {activeTab === 'mapping' && (
          <div className="mapping-view">
            <div className="left-panel">
              <CSVGrid 
                data={sourceData}
                onCellSelect={handleCellSelect}
                detectedItemRows={detectedItemRows}
                cellMappings={cellMappings}
                onFileUpload={handleFileUpload}
              />
            </div>
            <div className="right-panel">
              <MappingPanel 
                mappings={cellMappings}
                itemRows={detectedItemRows}
                onConvert={handleConvert}
                onClearMapping={(fieldType) => {
                  const newMappings = { ...cellMappings };
                  delete newMappings[fieldType];
                  setCellMappings(newMappings);
                  if (fieldType === 'ITEM_ROW') {
                    setDetectedItemRows([]);
                    setItemRowsPattern(null);
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'preview' && convertedData && (
          <OutputPreview 
            data={convertedData}
            onExport={handleExport}
          />
        )}
      </div>

      {showSettings && (
        <SettingsPanel 
          onClose={() => setShowSettings(false)}
        />
      )}

      {showTemplates && (
        <TemplateManager
          currentCompany={cellMappings.COMPANY_NAME?.value || null}
          currentMappings={cellMappings}
          itemRowsPattern={itemRowsPattern}
          onLoadTemplate={applyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default App;
