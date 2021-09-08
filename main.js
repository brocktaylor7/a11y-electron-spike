const {
    app,
    BrowserWindow,
    BrowserView,
    ipcRenderer,
    ipcMain,
    webContents,
} = require("electron");
const path = require("path");

let focusedElements = [];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWindow() {
    const currentWindow = new BrowserWindow({
        width: 2400,
        height: 1800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    currentWindow.loadFile("index.html");
    return currentWindow;
}

function createBrowserView(browserWindow) {
    const view = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, "browserview-preload.js"),
        },
    });
    browserWindow.setBrowserView(view);
    view.setBounds({ x: 1200, y: 0, width: 1200, height: 1800 });
    view.setAutoResize({
        horizontal: true,
        vertical: true,
    });
    // view.webContents.loadURL("https://usu.edu");
    view.webContents.loadURL("http://www.usu.edu/about/");
    // view.webContents.loadURL("https://accessibilityinsights.io");
    return view;
}

function sendTabEventToTestPage(webContents) {
    webContents.sendInputEvent({
        keyCode: "Tab",
        type: "keyDown",
    });
    webContents.sendInputEvent({
        keyCode: "Tab",
        type: "keyUp",
    });
}

function sendRequestForActiveElementToTestPage(webContents) {
    webContents.send("browser-view-commands", "return-active-element");
}

app.whenReady().then(async () => {
    const mainWindow = createWindow();
    const testPageView = createBrowserView(mainWindow);

    testPageView.webContents.addListener(
        "ipc-message",
        (e, channel, message) => {
            console.log(channel + ": " + message);
            switch (channel) {
                case "page-received-tab":
                    sendRequestForActiveElementToTestPage(
                        testPageView.webContents
                    );
                    break;
                case "current-active-element":
                    focusedElements.push(message);
                    sendTabEventToTestPage(testPageView.webContents);
                    break;
                case "page-done-tabbing":
                    mainWindow.webContents.send(
                        "focusedElementsList",
                        focusedElements
                    );
                    break;
            }
        }
    );

    testPageView.webContents.on("did-finish-load", async () => {
        await sleep(1000);
        testPageView.webContents.focus();
        sendTabEventToTestPage(testPageView.webContents);
        // testPageView.webContents.openDevTools({ mode: "detach" });
    });

    testPageView.webContents.on("did-start-navigation", async () => {
        focusedElements = [];
        mainWindow.webContents.send("resetElementsList");
    });

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
