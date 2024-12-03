import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import started from "electron-squirrel-startup";
import { updateElectronApp } from "update-electron-app";
import express from "express"; // Import express
import bodyParser from "body-parser"; // For parsing JSON payloads
import { formatTime } from "./utils";

updateElectronApp({});

let mainWindow: BrowserWindow | null = null; // Declare mainWindow globally

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "./images/icon.ico",
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  startApiServer(); // Start the API server when the app is ready
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to start the Express API server
const startApiServer = () => {
  const apiServer = express();
  const PORT = 3000; // Port for the API server

  // Middleware to parse JSON payloads
  apiServer.use(bodyParser.json());

  // Define API routes
  apiServer.get("/api/status", (req, res) => {
    res.json({ status: "Electron app is running" });
  });

  // Define POST endpoint to receive and forward the message
  apiServer.post("/api/message", (req, res) => {
    const { ts, message } = req.body;

    if (!message) {
      return res.status(400).send("Message is required");
    }

    const formattedMessage = `${formatTime(ts)} --> ${message}`;

    // Send the message to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send("display-message", formattedMessage);
    } else {
      console.error("Main window is not available");
      return res.status(500).send("Main window is not available");
    }

    res.send("Message received and sent to the renderer");
  });

  apiServer.post("/api/write-file", (req, res) => {
    const { fileName, content } = req.body;
    const desktopPath = path.join(os.homedir(), "OneDrive\\Desktop");
    const filePath = path.join(desktopPath, fileName || "output.txt");

    fs.writeFile(filePath, content || "", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        res.status(500).send("Failed to write file");
      } else {
        console.log("File written successfully:", filePath);
        res.send("File written successfully");
      }
    });
  });

  // Start the server
  apiServer.listen(PORT, "127.0.0.1", () => {
    console.log(`API server is running at http://127.0.0.1:${PORT}`);
  });
};

// Handle IPC to write to the desktop
ipcMain.on("write-to-desktop", (event, fileContent) => {
  const desktopPath = path.join(os.homedir(), "OneDrive\\Desktop");
  const filePath = path.join(desktopPath, "output.txt");

  console.log(filePath);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      event.reply("write-to-desktop-reply", "Failed to write file.");
    } else {
      console.log("File written successfully:", filePath);
      event.reply("write-to-desktop-reply", "File written successfully!");
    }
  });
});
