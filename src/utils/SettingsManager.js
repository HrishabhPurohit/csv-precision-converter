class SettingsManager {
  constructor() {
    this.STORAGE_KEY = 'csv_converter_settings';
    this.DEFAULT_ABBREVIATIONS = {
      'intas': 'IPL',
      'reddy': 'DRL',
      'reddys': 'DRL',
      'dr reddy': 'DRL',
      'cipla': 'CPL',
      'sun pharma': 'SUN',
      'sun': 'SUN',
      'alkem': 'ALK',
      'lupin': 'LUP',
      'torrent': 'TOR',
      'abbott': 'ABT',
      'cadila': 'CDL',
      'zydus': 'ZYD',
      'mankind': 'MKD',
      'glenmark': 'GLN',
      'ajanta': 'AJT',
      'macleods': 'MCL',
      'ipca': 'IPC',
      'micro labs': 'MCR',
      'usp': 'USP',
      'hetero': 'HTR'
    };
    
    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS, ...settings.companyAbbreviations };
        this.templates = settings.templates || {};
      } else {
        this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS };
        this.templates = {};
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS };
      this.templates = {};
    }
  }

  saveSettings() {
    try {
      const settings = {
        companyAbbreviations: this.companyAbbreviations,
        templates: this.templates
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Company Abbreviation Methods
  getCompanyAbbreviations() {
    return { ...this.companyAbbreviations };
  }

  addCompanyAbbreviation(companyName, abbreviation) {
    if (!companyName || !abbreviation) return false;
    
    const key = companyName.toLowerCase().trim();
    const abbr = abbreviation.toUpperCase().trim();
    
    if (abbr.length > 5) {
      throw new Error('Abbreviation must be 5 characters or less');
    }
    
    this.companyAbbreviations[key] = abbr;
    return this.saveSettings();
  }

  updateCompanyAbbreviation(oldName, newName, newAbbreviation) {
    const oldKey = oldName.toLowerCase().trim();
    const newKey = newName.toLowerCase().trim();
    const abbr = newAbbreviation.toUpperCase().trim();
    
    if (abbr.length > 5) {
      throw new Error('Abbreviation must be 5 characters or less');
    }
    
    // Remove old key if it's different from new key
    if (oldKey !== newKey) {
      delete this.companyAbbreviations[oldKey];
    }
    
    this.companyAbbreviations[newKey] = abbr;
    return this.saveSettings();
  }

  deleteCompanyAbbreviation(companyName) {
    const key = companyName.toLowerCase().trim();
    delete this.companyAbbreviations[key];
    return this.saveSettings();
  }

  getCompanyAbbreviation(companyName) {
    if (!companyName) return 'UNK';
    const name = companyName.toLowerCase();
    
    // First try exact match
    if (this.companyAbbreviations[name]) {
      return this.companyAbbreviations[name];
    }
    
    // Then try partial match
    for (const [key, abbr] of Object.entries(this.companyAbbreviations)) {
      if (name.includes(key) || key.includes(name)) {
        return abbr;
      }
    }
    
    return 'UNK';
  }

  resetToDefaults() {
    this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS };
    return this.saveSettings();
  }

  // Template Methods
  saveCompanyTemplate(companyName, template) {
    if (!companyName || !template) return false;
    
    const companyKey = companyName.toLowerCase().trim();
    
    if (!this.templates[companyKey]) {
      this.templates[companyKey] = [];
    }
    
    const templateWithMetadata = {
      ...template,
      id: Date.now().toString(),
      companyName: companyName,
      createdAt: new Date().toISOString(),
      name: template.name || `Template ${this.templates[companyKey].length + 1}`
    };
    
    this.templates[companyKey].push(templateWithMetadata);
    return this.saveSettings();
  }

  getCompanyTemplates(companyName) {
    if (!companyName) return [];
    const companyKey = companyName.toLowerCase().trim();
    return this.templates[companyKey] || [];
  }

  getAllTemplates() {
    const allTemplates = [];
    for (const [company, templates] of Object.entries(this.templates)) {
      templates.forEach(template => {
        allTemplates.push({
          ...template,
          company: company
        });
      });
    }
    return allTemplates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getTemplateById(templateId) {
    for (const templates of Object.values(this.templates)) {
      const template = templates.find(t => t.id === templateId);
      if (template) return template;
    }
    return null;
  }

  updateTemplate(templateId, updates) {
    for (const templates of Object.values(this.templates)) {
      const index = templates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        templates[index] = { ...templates[index], ...updates, updatedAt: new Date().toISOString() };
        return this.saveSettings();
      }
    }
    return false;
  }

  deleteTemplate(templateId) {
    for (const [company, templates] of Object.entries(this.templates)) {
      const index = templates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        templates.splice(index, 1);
        if (templates.length === 0) {
          delete this.templates[company];
        }
        return this.saveSettings();
      }
    }
    return false;
  }

  // Export/Import Settings
  exportSettings() {
    return {
      companyAbbreviations: this.companyAbbreviations,
      templates: this.templates,
      exportedAt: new Date().toISOString()
    };
  }

  importSettings(settings) {
    try {
      if (settings.companyAbbreviations) {
        this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS, ...settings.companyAbbreviations };
      }
      if (settings.templates) {
        this.templates = { ...this.templates, ...settings.templates };
      }
      return this.saveSettings();
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

// Create singleton instance
const settingsManager = new SettingsManager();
export default settingsManager;
