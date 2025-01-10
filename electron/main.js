// electron/main.ts
import { app, BrowserWindow } from "electron"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Valheim Helper",
    icon: path.join(__dirname, "../icons/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"))
  }
}

app.whenReady().then(createWindow)

if (process.platform === "win32") {
  app.setAppUserModelId("Valheim Helper")
}

app.setAboutPanelOptions({
  applicationName: "Valheim Helper",
  applicationVersion: "1.0.0",
  credits: "Mykhailo Zinenko",
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
