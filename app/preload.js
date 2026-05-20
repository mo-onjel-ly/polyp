const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('polyp', {
  version: process.versions.electron,
  gh:     (args)             => ipcRenderer.invoke('gh', args),
  config: {
    save: (filename, data) => ipcRenderer.invoke('config:save', filename, data),
    load: (filename)       => ipcRenderer.invoke('config:load', filename),
  },
});
