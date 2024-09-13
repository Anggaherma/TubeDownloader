const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  downloadVideo: (url) => ipcRenderer.send("download-video", url),
  convertToMP3: () => ipcRenderer.send("convert-to-mp3"),
  onDownloadSuccess: (callback) =>
    ipcRenderer.on("download-success", (event, ...args) =>
      callback(event, ...args)
    ),
  onDownloadError: (callback) =>
    ipcRenderer.on("download-error", (event, ...args) =>
      callback(event, ...args)
    ),
  onConvertSuccess: (callback) =>
    ipcRenderer.on("convert-success", (event, ...args) =>
      callback(event, ...args)
    ),
  onConvertError: (callback) =>
    ipcRenderer.on("convert-error", (event, ...args) =>
      callback(event, ...args)
    ),
  selectDownloadDir: () => ipcRenderer.invoke("select-dir"),
});
