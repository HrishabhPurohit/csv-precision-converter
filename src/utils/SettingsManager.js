import indexedDBManager from './IndexedDBManager';

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
    
    this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS };
    this.initialized = false;
    this.initPromise = this.init();
  }

  async init() {
    try {
      await indexedDBManager.init();
      
      // Try to migrate from localStorage if this is first time
      const hasData = await indexedDBManager.getSetting('companyAbbreviations');
      if (!hasData) {
        await indexedDBManager.migrateFromLocalStorage();
      }
      
      // Load settings from IndexedDB
      await this.loadSettings();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing IndexedDB, falling back to localStorage:', error);
      this.loadSettingsFromLocalStorage();
      this.initialized = true;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
    }
  }

  async loadSettings() {
    try {
      const abbreviations = await indexedDBManager.getSetting('companyAbbreviations');
      if (abbreviations) {
        this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS, ...abbreviations };
      }
    } catch (error) {
      console.error('Error loading settings from IndexedDB:', error);
      this.loadSettingsFromLocalStorage();
    }
  }

  loadSettingsFromLocalStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        this.companyAbbreviations = { ...this.DEFAULT_ABBREVIATIONS, ...settings.companyAbbreviations };
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }

  async saveSettings() {
    try {
      await indexedDBManager.saveSetting('companyAbbreviations', this.companyAbbreviations);
      return true;
    } catch (error) {
      console.error('Error saving settings to IndexedDB:', error);
      // Fallback to localStorage
      try {
        const settings = { companyAbbreviations: this.companyAbbreviations };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        return true;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        return false;
      }
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

  // Template Methods (using IndexedDB)
  async saveCompanyTemplate(companyName, template) {
    if (!companyName || !template) return false;
    
    try {
      const templateWithMetadata = {
        ...template,
        company: companyName.toLowerCase().trim(),
        companyName: companyName,
        name: template.name || `Template ${Date.now()}`
      };
      
      await indexedDBManager.saveTemplate(templateWithMetadata);
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    }
  }

  async getCompanyTemplates(companyName) {
    if (!companyName) return [];
    try {
      const companyKey = companyName.toLowerCase().trim();
      return await indexedDBManager.getTemplatesByCompany(companyKey);
    } catch (error) {
      console.error('Error getting company templates:', error);
      return [];
    }
  }

  async getAllTemplates() {
    try {
      return await indexedDBManager.getAllTemplates();
    } catch (error) {
      console.error('Error getting all templates:', error);
      return [];
    }
  }

  async getTemplateById(templateId) {
    try {
      return await indexedDBManager.getTemplate(templateId);
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }

  async updateTemplate(templateId, updates) {
    try {
      const template = await indexedDBManager.getTemplate(templateId);
      if (template) {
        const updated = { ...template, ...updates };
        await indexedDBManager.saveTemplate(updated);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating template:', error);
      return false;
    }
  }

  async deleteTemplate(templateId) {
    try {
      await indexedDBManager.deleteTemplate(templateId);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  // Export/Import Settings
  async exportSettings() {
    try {
      return await indexedDBManager.exportAllData();
    } catch (error) {
      console.error('Error exporting settings:', error);
      return {
        companyAbbreviations: this.companyAbbreviations,
        templates: [],
        exportedAt: new Date().toISOString()
      };
    }
  }

  async importSettings(data) {
    try {
      await indexedDBManager.importData(data);
      // Reload settings after import
      await this.loadSettings();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

// Create singleton instance
const settingsManager = new SettingsManager();
export default settingsManager;
