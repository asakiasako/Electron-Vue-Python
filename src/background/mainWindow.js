import { BrowserWindow } from 'electron'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

async function createWindow () {
  const browserWindow = new BrowserWindow({
    minWidth: 960,
    minHeight: 600,
    useContentSize: true,
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  /**
   * If you install `show: true` then it can cause issues when trying to close the window with dev-tools opened.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show()

    if (isDevelopment) {
      browserWindow?.webContents.openDevTools({ mode: 'detach' })
    }
  })

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await browserWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    browserWindow.loadURL('app://./index.html')
  }

  return browserWindow
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow () {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

  if (window === undefined) {
    window = await createWindow()
  }

  if (window.isMinimized()) {
    window.restore()
  }

  window.focus()
}
