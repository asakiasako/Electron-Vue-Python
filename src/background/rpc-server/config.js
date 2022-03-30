/* global __static */
import path from 'path'

export const DEFAULT_SERVER_HOSTNAME = 'localhost'
export const DEFAULT_SERVER_PORT = 23300 // if occupied other port will be used automatically
export const PYTHON_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-code/.venv/Scripts/python.exe') : null
export const PROCESS_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-code/src/__main__.py') : path.join(__static, 'ElectronPythonSubProcess', 'ElectronPythonSubProcess.exe')
