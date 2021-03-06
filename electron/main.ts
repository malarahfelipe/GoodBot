import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import { startListeners } from './services/listener'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
    mainWindow.webContents.openDevTools({ mode: 'undocked' })
  } else
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => setTimeout(createWindow, 300))
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${ name }`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${ name }`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })
  .then(startListeners)

app.allowRendererProcessReuse = true
/*
if (process.env.NODE_ENV === 'development') {
  require('electron-watch')(
    __dirname,
    'start:electron',             // npm scripts, means: npm run dev:electron-main
    path.join(__dirname, './'),      // cwd
    2000,                            // debounce delay
  );
}
*/
