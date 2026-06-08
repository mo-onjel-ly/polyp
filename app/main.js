const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const { execFile } = require('child_process');
const { promisify } = require('util');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

function getConfigDir() {
  return process.env.POLYP_CONFIG_DIR || path.join(os.homedir(), '.polyp');
}

// Generic config file I/O — saves/loads JSON files in the config dir.
ipcMain.handle('config:save', async (_event, filename, data) => {
  const dir = getConfigDir();
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, filename);
  fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2), 'utf8');
  return { ok: true, file };
});

ipcMain.handle('config:load', async (_event, filename) => {
  const file = path.join(getConfigDir(), filename);
  if (!fs.existsSync(file)) return { ok: false, reason: 'no file' };
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
});

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

// ---------- window bounds persistence ----------

const WINDOW_FILE = 'window.json';

function loadWindowBounds() {
  try {
    const file = path.join(getConfigDir(), WINDOW_FILE);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) { return null; }
}

function saveWindowBounds(win) {
  if (win.isMinimized() || win.isFullScreen()) return;
  try {
    const dir = getConfigDir();
    fs.mkdirSync(dir, { recursive: true });
    // getNormalBounds() returns the restored size even while maximized,
    // so we always keep a valid size to restore to.
    const data = { ...win.getNormalBounds(), maximized: win.isMaximized() };
    fs.writeFileSync(path.join(dir, WINDOW_FILE), JSON.stringify(data, null, 2), 'utf8');
  } catch (_) {}
}

function boundsOnScreen(b) {
  return screen.getAllDisplays().some(d => {
    const w = d.workArea;
    return b.x < w.x + w.width  && b.x + b.width  > w.x &&
           b.y < w.y + w.height && b.y + b.height > w.y;
  });
}

function createWindow() {
  const saved = loadWindowBounds();
  const usePosition = saved && boundsOnScreen(saved);

  const win = new BrowserWindow({
    width:  saved?.width  || 1400,
    height: saved?.height || 900,
    ...(usePosition ? { x: saved.x, y: saved.y } : {}),
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

  // Debounced save on resize / move; immediate save on maximize / close
  let boundsTimer = null;
  const debouncedSave = () => {
    clearTimeout(boundsTimer);
    boundsTimer = setTimeout(() => saveWindowBounds(win), 400);
  };
  win.on('resize',     debouncedSave);
  win.on('move',       debouncedSave);
  win.on('maximize',   () => saveWindowBounds(win));
  win.on('unmaximize', () => saveWindowBounds(win));
  win.on('close',      () => { clearTimeout(boundsTimer); saveWindowBounds(win); });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Restore maximized state after the window has been shown
  if (saved?.maximized) win.maximize();
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
