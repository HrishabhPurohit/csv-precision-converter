import React, { useState, useEffect } from 'react';
import settingsManager from '../utils/SettingsManager';
import './SettingsPanel.css';

const SettingsPanel = ({ onClose }) => {
  const [abbreviations, setAbbreviations] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [newCompany, setNewCompany] = useState({ name: '', abbr: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('abbreviations');

  useEffect(() => {
    loadAbbreviations();
  }, []);

  const loadAbbreviations = () => {
    const abbrs = settingsManager.getCompanyAbbreviations();
    setAbbreviations(abbrs);
  };

  const handleAdd = () => {
    setError('');
    setSuccess('');
    
    if (!newCompany.name || !newCompany.abbr) {
      setError('Both company name and abbreviation are required');
      return;
    }
    
    if (newCompany.abbr.length > 5) {
      setError('Abbreviation must be 5 characters or less');
      return;
    }
    
    try {
      const success = settingsManager.addCompanyAbbreviation(newCompany.name, newCompany.abbr);
      if (success) {
        loadAbbreviations();
        setNewCompany({ name: '', abbr: '' });
        setSuccess(`Added: ${newCompany.name} → ${newCompany.abbr.toUpperCase()}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = (oldName, newName, newAbbr) => {
    setError('');
    try {
      const success = settingsManager.updateCompanyAbbreviation(oldName, newName, newAbbr);
      if (success) {
        loadAbbreviations();
        setEditingKey(null);
        setSuccess('Updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (companyName) => {
    if (window.confirm(`Delete abbreviation for "${companyName}"?`)) {
      settingsManager.deleteCompanyAbbreviation(companyName);
      loadAbbreviations();
      setSuccess('Deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all company abbreviations to defaults? This will remove any custom entries.')) {
      settingsManager.resetToDefaults();
      loadAbbreviations();
      setSuccess('Reset to defaults');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleExport = () => {
    const settings = settingsManager.exportSettings();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csv_converter_settings_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess('Settings exported');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        const success = settingsManager.importSettings(settings);
        if (success) {
          loadAbbreviations();
          setSuccess('Settings imported successfully');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="settings-tabs">
          <button 
            className={activeTab === 'abbreviations' ? 'active' : ''}
            onClick={() => setActiveTab('abbreviations')}
          >
            Company Abbreviations
          </button>
          <button 
            className={activeTab === 'import-export' ? 'active' : ''}
            onClick={() => setActiveTab('import-export')}
          >
            Import/Export
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'abbreviations' && (
            <>
              <div className="add-abbreviation">
                <h3>Add New Company</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Company name (e.g., 'cipla')"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value.toLowerCase() })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                  />
                  <input
                    type="text"
                    placeholder="Code (max 5 chars)"
                    value={newCompany.abbr}
                    onChange={(e) => setNewCompany({ ...newCompany, abbr: e.target.value.toUpperCase().slice(0, 5) })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    maxLength="5"
                  />
                  <button className="btn-add" onClick={handleAdd}>
                    Add
                  </button>
                </div>
              </div>

              <div className="abbreviations-list">
                <h3>Company Abbreviations</h3>
                <div className="list-header">
                  <span>Company Name</span>
                  <span>Code</span>
                  <span>Actions</span>
                </div>
                <div className="list-items">
                  {Object.entries(abbreviations).sort().map(([key, value]) => (
                    <div key={key} className="abbreviation-item">
                      {editingKey === key ? (
                        <>
                          <input
                            type="text"
                            defaultValue={key}
                            id={`name-${key}`}
                            className="edit-input"
                          />
                          <input
                            type="text"
                            defaultValue={value}
                            id={`abbr-${key}`}
                            className="edit-input abbr"
                            maxLength="5"
                          />
                          <div className="actions">
                            <button
                              className="btn-save"
                              onClick={() => {
                                const newName = document.getElementById(`name-${key}`).value;
                                const newAbbr = document.getElementById(`abbr-${key}`).value;
                                handleUpdate(key, newName, newAbbr);
                              }}
                            >
                              ✓
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setEditingKey(null)}
                            >
                              ✗
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="company-name">{key}</span>
                          <span className="company-abbr">{value}</span>
                          <div className="actions">
                            <button
                              className="btn-edit"
                              onClick={() => setEditingKey(key)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(key)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-reset" onClick={handleReset}>
                  Reset to Defaults
                </button>
              </div>
            </>
          )}

          {activeTab === 'import-export' && (
            <div className="import-export-section">
              <h3>Export Settings</h3>
              <p>Export all your company abbreviations and templates to a file.</p>
              <button className="btn-export" onClick={handleExport}>
                📥 Export Settings
              </button>

              <hr />

              <h3>Import Settings</h3>
              <p>Import company abbreviations and templates from a previously exported file.</p>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
                id="import-file"
              />
              <button 
                className="btn-import"
                onClick={() => document.getElementById('import-file').click()}
              >
                📤 Import Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
