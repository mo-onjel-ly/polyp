const { contextBridge } = require('electron');

// Stub — expand this to expose native APIs to the renderer as the app grows.
// e.g.: contextBridge.exposeInMainWorld('polyp', { saveGraph, loadGraph })
contextBridge.exposeInMainWorld('polyp', {
  version: process.versions.electron,
});
