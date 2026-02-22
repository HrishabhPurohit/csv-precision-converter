class IndexedDBManager {
  constructor() {
    this.dbName = 'CSVConverterDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create templates store if it doesn't exist
        if (!db.objectStoreNames.contains('templates')) {
          const templatesStore = db.createObjectStore('templates', { keyPath: 'id', autoIncrement: true });
          templatesStore.createIndex('company', 'company', { unique: false });
          templatesStore.createIndex('name', 'name', { unique: false });
          templatesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create settings store if it doesn't exist
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async ensureDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // Template operations
  async saveTemplate(template) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      const templateData = {
        ...template,
        createdAt: template.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const request = store.put(templateData);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllTemplates() {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getTemplatesByCompany(company) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const index = store.index('company');
      const request = index.getAll(company);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getTemplate(id) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteTemplate(id) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Settings operations
  async saveSetting(key, value) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getSetting(key) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllSettings() {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.getAll();

      request.onsuccess = () => {
        const settings = {};
        request.result.forEach(item => {
          settings[item.key] = item.value;
        });
        resolve(settings);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Migration from localStorage
  async migrateFromLocalStorage() {
    try {
      // Migrate templates
      const oldTemplatesData = localStorage.getItem('csv_converter_settings');
      if (oldTemplatesData) {
        const parsed = JSON.parse(oldTemplatesData);
        if (parsed.templates) {
          const companies = Object.keys(parsed.templates);
          for (const company of companies) {
            const companyTemplates = parsed.templates[company];
            for (const templateName in companyTemplates) {
              await this.saveTemplate({
                company,
                name: templateName,
                ...companyTemplates[templateName]
              });
            }
          }
        }

        // Migrate company abbreviations
        if (parsed.companyAbbreviations) {
          await this.saveSetting('companyAbbreviations', parsed.companyAbbreviations);
        }
      }

      console.log('Migration from localStorage completed');
    } catch (error) {
      console.error('Migration error:', error);
    }
  }

  // Export all data
  async exportAllData() {
    const templates = await this.getAllTemplates();
    const settings = await this.getAllSettings();
    return {
      templates,
      settings,
      exportedAt: new Date().toISOString()
    };
  }

  // Import data
  async importData(data) {
    if (data.templates) {
      for (const template of data.templates) {
        await this.saveTemplate(template);
      }
    }
    if (data.settings) {
      for (const key in data.settings) {
        await this.saveSetting(key, data.settings[key]);
      }
    }
  }
}

// Singleton instance
const indexedDBManager = new IndexedDBManager();

export default indexedDBManager;
