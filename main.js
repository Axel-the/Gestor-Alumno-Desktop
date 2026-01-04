import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'Gestor Alumno',
        icon: path.join(__dirname, 'logo.jpeg'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });

    const isDev = !app.isPackaged;

    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        // mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
