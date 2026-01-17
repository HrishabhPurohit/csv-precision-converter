import React, { useState, useEffect } from 'react';
import settingsManager from '../utils/SettingsManager';
import './TemplateManager.css';

const TemplateManager = ({ 
  currentCompany, 
  currentMappings, 
  itemRowsPattern,
  onLoadTemplate, 
  onClose 
}) => {
  const [templates, setTemplates] = useState([]);
  const [filterCompany, setFilterCompany] = useState('all');
  const [templateName, setTemplateName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadTemplates();
    loadCompanies();
  }, []);

  const loadTemplates = () => {
    const allTemplates = settingsManager.getAllTemplates();
    setTemplates(allTemplates);
  };

  const loadCompanies = () => {
    const uniqueCompanies = new Set();
    const allTemplates = settingsManager.getAllTemplates();
    allTemplates.forEach(t => {
      if (t.companyName) {
        uniqueCompanies.add(t.companyName);
      }
    });
    setCompanies(Array.from(uniqueCompanies));
  };

  const handleSaveTemplate = () => {
    setError('');
    setSuccess('');

    if (!currentCompany) {
      setError('Please map company name first');
      return;
    }

    if (!templateName) {
      setError('Please enter a template name');
      return;
    }

    const template = {
      name: templateName,
      mappings: currentMappings,
      itemRowsPattern: itemRowsPattern,
      companyName: currentCompany,
      createdAt: new Date().toISOString()
    };

    const success = settingsManager.saveCompanyTemplate(currentCompany, template);
    if (success) {
      loadTemplates();
      loadCompanies();
      setTemplateName('');
      setShowSave(false);
      setSuccess(`Template "${templateName}" saved for ${currentCompany}`);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to save template');
    }
  };

  const handleLoadTemplate = (template) => {
    if (onLoadTemplate) {
      onLoadTemplate(template);
      setSuccess(`Loaded template: ${template.name}`);
      setTimeout(() => {
        setSuccess('');
        onClose && onClose();
      }, 1500);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (window.confirm(`Delete template "${template.name}"?`)) {
      const success = settingsManager.deleteTemplate(templateId);
      if (success) {
        loadTemplates();
        loadCompanies();
        setSuccess('Template deleted');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  const filteredTemplates = filterCompany === 'all' 
    ? templates 
    : templates.filter(t => t.companyName === filterCompany);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="template-overlay">
      <div className="template-manager">
        <div className="template-header">
          <h2>Template Manager</h2>
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

        <div className="template-actions">
          {!showSave ? (
            <button 
              className="btn-save-new"
              onClick={() => setShowSave(true)}
              disabled={!currentCompany || Object.keys(currentMappings || {}).length === 0}
            >
              💾 Save Current Mapping as Template
            </button>
          ) : (
            <div className="save-template-form">
              <input
                type="text"
                placeholder="Template name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveTemplate()}
                autoFocus
              />
              <span className="company-label">for {currentCompany}</span>
              <button onClick={handleSaveTemplate} className="btn-save">
                Save
              </button>
              <button onClick={() => { setShowSave(false); setTemplateName(''); }} className="btn-cancel">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="template-filter">
          <label>Filter by Company:</label>
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
            <option value="all">All Companies</option>
            {currentCompany && (
              <option value={currentCompany}>Current: {currentCompany}</option>
            )}
            {companies.filter(c => c !== currentCompany).map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        <div className="templates-grid">
          {filteredTemplates.length === 0 ? (
            <div className="no-templates">
              {filterCompany === 'all' 
                ? 'No templates saved yet. Create your first template!'
                : `No templates for ${filterCompany}`}
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-card-header">
                  <h3>{template.name}</h3>
                  <span className="company-badge">
                    {settingsManager.getCompanyAbbreviation(template.companyName)}
                  </span>
                </div>
                <div className="template-info">
                  <div className="info-row">
                    <span className="label">Company:</span>
                    <span className="value">{template.companyName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Created:</span>
                    <span className="value">{formatDate(template.createdAt)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Mappings:</span>
                    <span className="value">
                      {Object.keys(template.mappings || {}).length} fields
                    </span>
                  </div>
                </div>
                <div className="template-actions">
                  <button 
                    className="btn-load"
                    onClick={() => handleLoadTemplate(template)}
                  >
                    📂 Load
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="template-tips">
          <h4>💡 Tips</h4>
          <ul>
            <li>Templates save all your field mappings for a specific company</li>
            <li>Each company can have multiple templates for different invoice formats</li>
            <li>Load a template to quickly apply saved mappings</li>
            <li>Templates are stored locally in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
