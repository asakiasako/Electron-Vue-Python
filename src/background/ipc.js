import { ipcMain, app, shell, dialog } from 'electron'
import { getRpcServerInstance } from './rpc-server'

/**
 * Register listeners for ipcMain
 */
export const registerListeners = function () {
  ipcMain.handle('electron.app.getName', (e) => {
    return app.getName()
  })

  ipcMain.handle('electron.app.getVersion', (e) => {
    return app.getVersion()
  })

  ipcMain.on('electron.shell.openExternal', (e, url) => {
    shell.openExternal(url)
  })

  ipcMain.handle('rpcServer.getAddress', (event) => {
    const server = getRpcServerInstance()
    return [server.hostname, server.port]
  })

  ipcMain.handle('prcServer.checkAlive', (event) => {
    const alive = getRpcServerInstance.isAlive()
    if (!alive) {
      dialog.showErrorBox('Fatal Error', `Unable to launch RPC server process. Get more information with logs in:\n${app.getPath('logs')}`)
      app.quit()
    }
  })
}

/**
 * Removes the specified listener from the listener array for the specified channel
 * @param {string} [channel]
 */
export const removeAllListeners = function (channel) {
  ipcMain.removeAllListeners(channel)
}
