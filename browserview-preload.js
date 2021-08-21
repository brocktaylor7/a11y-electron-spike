const { ipcRenderer } = require("electron");

ipcRenderer.on("browser-view-commands", (e, data) => {
    switch (data) {
        case "return-active-element":
            returnActiveElementResponse();
            break;
    }
});

//add event listener for keyup Tab, send "page-received-tab" message to main process
document.addEventListener("keyup", tabKeyupEventListener);

function tabKeyupEventListener(e) {
    if (e.key == "Tab") {
        ipcRenderer.send("page-received-tab", "true");
    }
}

function setActiveElementAsTabbed() {
    document.activeElement.setAttribute("data-a11y-has-focused", "true");
}

function returnActiveElementResponse() {
    if (
        document.activeElement.getAttribute("data-a11y-has-focused") == "true"
    ) {
        document.removeEventListener("keyup", tabKeyupEventListener);
        ipcRenderer.send("page-done-tabbing", "true");
        return;
    }
    setActiveElementAsTabbed();
    ipcRenderer.send(
        "current-active-element",
        "tag: " +
            document.activeElement.nodeName +
            " text: " +
            document.activeElement.text
    );
}
