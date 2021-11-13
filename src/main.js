// 'use strict'

const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const {Client} = require("whatsapp-web.js")

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,//process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        }
    })
    // and load the index.html of the app.
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // 开启whatsapp
    ipcMain.handle('start-wp', () => {
        // win.webContents.openDevTools()
        startWhatsapp(win)
    })
}

const getDefaultOsPath = () => {
    if (process.platform === 'win32') {
        return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    } else {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    }
}


function destroyClient(client) {
    client.destroy().then(_ => {
        console.log("destroy client success")
    }).catch(er => {
        console.log("destroy err: ", er)
    })
}

async function startWhatsapp(worker) {
    const client = new Client({
        puppeteer: {
            executablePath: getDefaultOsPath()
        }
    })

    // if (client.getState()) {
    //     await client.destroy()
    // }
    console.log('开始同步whatsapp消息')

    const postWPMessage = (type, message) => {
        worker.webContents.postMessage('whatsapp', {type, message, timestamp: new Date().getTime()})
    }

    client.on('qr', (qr) => {
        console.log('生成二维码', qr)
        worker.webContents.postMessage('whatsapp', {type: 'qrcode', message: qr})
    })

    client.on('authenticated', session => {
        // todo: 保存登录态
        postWPMessage('login_success', '登录成功')
    })

    client.on('auth_failure', er => {
        worker.webContents.postMessage('whatsapp', {type: 'login_fail', message: err.message})
    })

    client.on('disconnected', reason => {
        postWPMessage('disconnected', reason)
        destroyClient(client)
    })

    client.on('ready', async () => {
        const meNumber = client.info.wid.user
        postWPMessage('msg', '登录账号： ' + meNumber)
        let chats = await client.getChats();
        for (const chat of chats) {
            postWPMessage('msg', {isGroup: chat.isGroup, user: chat.id.user, name: chat.name})
        }
        postWPMessage('complete', '处理完成')
        destroyClient(client)
    });

    client.on('message', msg => {
        worker.webContents.postMessage('whatsapp', {type: 'msg', message: msg})
    });

    client.initialize();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    createWindow()
})
