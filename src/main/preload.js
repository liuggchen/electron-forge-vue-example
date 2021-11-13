const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('$electron', {
    toolInfo: {
        chrome: process.versions.chrome,
        node: process.versions.node,
        electron: process.versions.electron,
        author: 'www.heycharge.global'
    },
    startWp: () => {
        ipcRenderer.invoke('start-wp')
    }
})

ipcRenderer.on('whatsapp', (event, args) => {
    window.postMessage(args, '*')
})
