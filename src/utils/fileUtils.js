// File utilities for web version (replacing Electron file dialogs)

export const openCSVFile = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({
          content: event.target.result,
          fileName: file.name
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
};

export const saveCSVFile = (content, defaultFileName = 'converted.csv') => {
  return new Promise((resolve) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFileName;
    link.click();
    URL.revokeObjectURL(url);
    resolve(defaultFileName);
  });
};

export const saveTemplateFile = (template) => {
  return new Promise((resolve) => {
    const content = JSON.stringify(template, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    resolve(true);
  });
};

export const loadTemplateFile = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target.result);
          resolve(template);
        } catch (error) {
          reject(new Error('Invalid template file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
};

// Check if running in Electron
export const isElectron = () => {
  return window.electronAPI !== undefined;
};

// Unified file operations that work in both web and Electron
export const fileOperations = {
  openCSV: async () => {
    if (isElectron()) {
      return await window.electronAPI.openFile();
    }
    return await openCSVFile();
  },
  
  saveCSV: async (content, fileName) => {
    if (isElectron()) {
      return await window.electronAPI.saveFile(content, fileName);
    }
    return await saveCSVFile(content, fileName);
  },
  
  saveTemplate: async (template) => {
    if (isElectron()) {
      return await window.electronAPI.saveTemplate(template);
    }
    return await saveTemplateFile(template);
  },
  
  loadTemplate: async () => {
    if (isElectron()) {
      return await window.electronAPI.loadTemplate();
    }
    return await loadTemplateFile();
  }
};
