const { exec } = require("child_process");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let downloadDir = "";

// Create function main windows
function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js");
  const indexPath = path.join(__dirname, "public", "index.html");

  // Check if preload.js is exist
  if (!fs.existsSync(preloadPath)) {
    console.error(`Preload script not found at ${preloadPath}`);
    return;
  } else {
    console.log(`Preload script found at ${preloadPath}`);
  }

  // Check if index.html is exist
  if (!fs.existsSync(indexPath)) {
    console.error(`index.html script not found at ${indexPath}`);
    return;
  } else {
    console.log(`index.html script found at ${indexPath}`);
  }

  const win = new BrowserWindow({
    width: 800,
    heigth: 600,
    webPreferences: {
      // Load the preload script
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Load main HTML file
  win.loadFile(indexPath);

  // Open the DevTools
  win.webContents.openDevTools();
}

// Call electron
app.whenReady().then(() => {
  createWindow();

  // Handle directory selection
  ipcMain.handle("select-dir", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    downloadDir = result.filePaths[0] || "";
    console.log(`Selected donwload directory: ${downloadDir}`);
    return downloadDir;
  });

  // Handle video download request
  ipcMain.on("download-video", (event, url) => {
    if (!downloadDir) {
      event.reply("dowload-error", "Download directory not set");
      return;
    }

    const command = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "${path.join(
      downloadDir,
      "%(title)s.%(ext)s"
    )}" ${url}`;

    console.log(`Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error downloading video: ${error}`);
        event.reply("download-error", error.message);
        return;
      }
      console.log(`Command stdout: ${stdout}`);
      console.log(`Command stderr: ${stderr}`);
      event.reply("download-success", stdout);
    });
  });

  // Handle MP3 convertion
  ipcMain.on("convert-to-mp3", (event) => {
    exec(
      "ffmpeg -i video.mp4 -q:a 0 -map a audio.mp3",
      (error, stdout, stderr) => {
        if (error) {
          console.log(`Error converting to MP3: ${error}`);
          event.reply("convert-error", error.message);
          return;
        }
        event.reply("convert-success", stdout);
      }
    );
  });

  // Quit app when all windows closed
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit;
  });

  // Recreate the window if the application is active
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
