import React from 'react';
import './MappingPanel.css';
import settingsManager from '../utils/SettingsManager';

const MappingPanel = ({ mappings, itemRows, onConvert, onClearMapping }) => {
  const formatCellReference = (mapping) => {
    if (!mapping) return 'Not mapped';
    const col = String.fromCharCode(65 + (mapping.col % 26));
    const row = mapping.row + 1;
    return `Cell ${col}${row}: "${mapping.value}"`;
  };

  const companyAbbr = mappings.COMPANY_NAME ? 
    settingsManager.getCompanyAbbreviation(mappings.COMPANY_NAME.value) : '';

  return (
    <div className="mapping-panel">
      <h3>Cell Mappings</h3>
      
      <div className="mapping-section">
        <h4>Invoice Header Information</h4>
        
        <div className="mapping-item">
          <label>🏢 Company Name:</label>
          <div className="mapping-value">
            {mappings.COMPANY_NAME ? (
              <>
                <span>{formatCellReference(mappings.COMPANY_NAME)}</span>
                <span className="abbr-badge">{companyAbbr}</span>
                <button 
                  className="btn-clear"
                  onClick={() => onClearMapping('COMPANY_NAME')}
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="unmapped">Click a cell to map</span>
            )}
          </div>
        </div>

        <div className="mapping-item">
          <label>📋 GST Number:</label>
          <div className="mapping-value">
            {mappings.GST_NUMBER ? (
              <>
                <span>{formatCellReference(mappings.GST_NUMBER)}</span>
                <button 
                  className="btn-clear"
                  onClick={() => onClearMapping('GST_NUMBER')}
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="unmapped">Click a cell to map</span>
            )}
          </div>
        </div>

        <div className="mapping-item">
          <label>📅 Invoice Date:</label>
          <div className="mapping-value">
            {mappings.INVOICE_DATE ? (
              <>
                <span>{formatCellReference(mappings.INVOICE_DATE)}</span>
                <button 
                  className="btn-clear"
                  onClick={() => onClearMapping('INVOICE_DATE')}
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="unmapped">Click a cell to map (Optional)</span>
            )}
          </div>
        </div>

        <div className="mapping-item">
          <label>🔢 Invoice Number:</label>
          <div className="mapping-value">
            {mappings.INVOICE_NUMBER ? (
              <>
                <span>{formatCellReference(mappings.INVOICE_NUMBER)}</span>
                <button 
                  className="btn-clear"
                  onClick={() => onClearMapping('INVOICE_NUMBER')}
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="unmapped">Click a cell to map (Optional)</span>
            )}
          </div>
        </div>
      </div>

      <div className="mapping-section">
        <h4>Item Details</h4>
        
        <div className="mapping-item">
          <label>📦 Item Rows Detected:</label>
          <div className="mapping-value">
            {itemRows.length > 0 ? (
              <>
                <span className="success">{itemRows.length} rows found</span>
                <span className="row-list">Rows: {itemRows.slice(0, 5).map(r => r + 1).join(', ')}{itemRows.length > 5 && '...'}</span>
                <button 
                  className="btn-clear"
                  onClick={() => onClearMapping('ITEM_ROW')}
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="unmapped">Click on any item row to auto-detect</span>
            )}
          </div>
        </div>

        {itemRows.length > 0 && (
          <div className="item-column-mappings">
            <p className="hint">
              Now click on specific cells in the item rows to map:
            </p>
            
            <div className="mapping-item">
              <label>💊 Item Name:</label>
              <div className="mapping-value">
                {mappings.ITEM_NAME ? (
                  <>
                    <span>{formatCellReference(mappings.ITEM_NAME)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('ITEM_NAME')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click item name cell</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>🏷️ Batch Number:</label>
              <div className="mapping-value">
                {mappings.BATCH_NUMBER ? (
                  <>
                    <span>{formatCellReference(mappings.BATCH_NUMBER)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('BATCH_NUMBER')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click batch number cell</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>💰 MRP:</label>
              <div className="mapping-value">
                {mappings.MRP ? (
                  <>
                    <span>{formatCellReference(mappings.MRP)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('MRP')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click MRP cell</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>💵 PTR:</label>
              <div className="mapping-value">
                {mappings.PTR ? (
                  <>
                    <span>{formatCellReference(mappings.PTR)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('PTR')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click PTR cell (Optional)</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>💴 PTS:</label>
              <div className="mapping-value">
                {mappings.PTS ? (
                  <>
                    <span>{formatCellReference(mappings.PTS)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('PTS')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click PTS cell (Optional)</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>📊 Quantity:</label>
              <div className="mapping-value">
                {mappings.QUANTITY ? (
                  <>
                    <span>{formatCellReference(mappings.QUANTITY)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('QUANTITY')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click quantity cell</span>
                )}
              </div>
            </div>

            <div className="mapping-item">
              <label>💲 Total Bill Amount:</label>
              <div className="mapping-value">
                {mappings.TOTAL_AMOUNT ? (
                  <>
                    <span>{formatCellReference(mappings.TOTAL_AMOUNT)}</span>
                    <button 
                      className="btn-clear"
                      onClick={() => onClearMapping('TOTAL_AMOUNT')}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="unmapped">Click total amount cell</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="conversion-section">
        <h4>Conversion Status</h4>
        <div className="status-checks">
          <div className={`check-item ${mappings.COMPANY_NAME ? 'done' : ''}`}>
            {mappings.COMPANY_NAME ? '✅' : '⭕'} Company Name
          </div>
          <div className={`check-item ${mappings.GST_NUMBER ? 'done' : ''}`}>
            {mappings.GST_NUMBER ? '✅' : '⭕'} GST Number
          </div>
          <div className={`check-item ${itemRows.length > 0 ? 'done' : ''}`}>
            {itemRows.length > 0 ? '✅' : '⭕'} Item Rows Detected
          </div>
        </div>

        {itemRows.length > 0 && (
          <div className="info-box">
            <p><strong>Tax Calculation:</strong></p>
            <p>IGST: 2.5% of Total Bill Amount</p>
            <p>CGST: 2.5% of Total Bill Amount</p>
            <p>Total GST: 5%</p>
          </div>
        )}

        <button 
          className="btn-convert"
          onClick={onConvert}
          disabled={!mappings.COMPANY_NAME || !mappings.GST_NUMBER || itemRows.length === 0}
        >
          Convert to Target Format
        </button>
      </div>
    </div>
  );
};

export default MappingPanel;
