const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { execFile } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execFileAsync = promisify(execFile);

// gh IPC — runs `gh <args>` and returns { ok, stdout, stderr }
// Args is a string array; using execFile avoids shell injection.
ipcMain.handle('gh', async (_event, args) => {
  if (!Array.isArray(args) || args.some(a => typeof a !== 'string')) {
    return { ok: false, error: 'invalid args' };
  }
  try {
    const { stdout, stderr } = await execFileAsync('gh', args, { timeout: 15000 });
    return { ok: true, stdout, stderr };
  } catch (err) {
    return { ok: false, error: err.message, stderr: err.stderr || '' };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0b0d',
    titleBarStyle: 'hiddenInset',  // macOS: traffic lights inset, no title text
    trafficLightPosition: { x: 12, y: 8 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

// Minimal application menu — removes the default Electron boilerplate
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
