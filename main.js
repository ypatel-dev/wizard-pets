
// Created by Yesha Patel

const { app, BrowserWindow, screen } = require('electron');

let win;

function createWindow() {
    const { x, y, width, height } = screen.getPrimaryDisplay().bounds;

    win = new BrowserWindow({
        x,
        y,
        width,
        height,

        // Transparent desktop overlay.
        transparent: true,
        backgroundColor: '#00000000',

        // Remove normal window decorations.
        frame: false,
        hasShadow: false,

        // Keep the characters above other windows.
        alwaysOnTop: true,
        skipTaskbar: true,

        // Window settings.
        resizable: false,
        focusable: false,

        // Security settings.
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Keep the overlay above normal application windows.
    win.setAlwaysOnTop(true, 'screen-saver');

    // Show the overlay across macOS workspaces.
    win.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
    });

    // Allow mouse clicks to pass through the overlay.
    win.setIgnoreMouseEvents(true, {
        forward: true
    });

    // Load the application.
    win.loadFile('index.html');

    // Clean up when the window closes.
    win.on('closed', () => {
        win = null;
    });
}


// -------------------------
// APPLICATION LIFECYCLE
// -------------------------

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // Keep the application running on macOS.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

