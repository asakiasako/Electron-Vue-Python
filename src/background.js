'use strict'

import { app, protocol } from 'electron'

import { restoreOrCreateWindow } from '@/background/mainWindow'
import { createRpcServer, getRpcServerInstance } from '@/background/rpc-server'
import { registerListeners } from '@/background/ipc'

const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * Scheme must be registered before the app is ready
 */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}
app.on('second-instance', restoreOrCreateWindow)

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration()

/**
 * Register listeners for ipcMain
 */
registerListeners()

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow)

/**
 * Close RPC Server before app quit.
 */
app.on('will-quit', () => {
  const rpcServer = getRpcServerInstance()
  if (rpcServer.isAlive()) rpcServer.close()
})

/**
* Create app window when background process will be ready
*/
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e))
  .then(createRpcServer)
  .catch((e) => console.error(e))

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (isDevelopment) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true
      }
    }))
    .catch(e => console.error('Failed install extension:', e))
}

/**
 * Check new app version in production mode only
 */
if (!isDevelopment) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e))
}

/**
 * Exit cleanly on request from parent process in development mode.
 */
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
