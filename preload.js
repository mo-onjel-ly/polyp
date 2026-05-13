const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('polyp', {
  version: process.versions.electron,
  gh: (args) => ipcRenderer.invoke('gh', args),
});
