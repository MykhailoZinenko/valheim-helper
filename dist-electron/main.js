"use strict";
const electron = require("electron");
const path = require("path");
const url = require("url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __dirname$1 = path.dirname(url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "Valheim Helper",
    icon: path.join(__dirname$1, "../icons/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
}
electron.app.whenReady().then(createWindow);
if (process.platform === "win32") {
  electron.app.setAppUserModelId("Valheim Helper");
}
electron.app.setAboutPanelOptions({
  applicationName: "Valheim Helper",
  applicationVersion: "1.0.0",
  credits: "Mykhailo Zinenko"
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
