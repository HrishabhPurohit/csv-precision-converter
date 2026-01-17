const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (defaultName, content) => ipcRenderer.invoke('save-file-dialog', defaultName, content),
  saveTemplate: (template) => ipcRenderer.invoke('save-template', template),
  loadTemplate: () => ipcRenderer.invoke('load-template'),
  
  // Listen to menu events
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-open-csv', callback);
    ipcRenderer.on('menu-save-template', callback);
    ipcRenderer.on('menu-load-template', callback);
    ipcRenderer.on('menu-export', callback);
  },
  
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('menu-open-csv');
    ipcRenderer.removeAllListeners('menu-save-template');
    ipcRenderer.removeAllListeners('menu-load-template');
    ipcRenderer.removeAllListeners('menu-export');
  }
});
