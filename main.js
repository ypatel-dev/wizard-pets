// Created by Yesha Patel
const { app, BrowserWindow, screen } = require('electron');

app.whenReady().then(() => {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;

  const win = new BrowserWindow({ 
    x, y, width, height, // cover the whole screen
    transparent: true, // see through bg
    frame: false, // no title bar or borders
    hasShadow: false,
    alwaysOnTop: true, // floay above the other windows
    skipTaskbar: true, // no Dock/taskbar entry
    resizable: false,
    focusable: false // dont steal keyboard focus
   });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true }); // clicks pass through
  win.loadFile('index.html');

  setTimeout(() => app.quit(), 3000);
});
