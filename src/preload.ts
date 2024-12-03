// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  writeToDesktop: (localPath: string, content: string) =>
    ipcRenderer.send("write-to-desktop", { localPath, content }),
  onDisplayMessage: (callback: (event: any, message: string) => void) => {
    ipcRenderer.on("display-message", callback);
  },
  onConnect: (callback: (event: any, message: string) => void) => {
    ipcRenderer.on("connect", callback);
  },
});
