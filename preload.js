process.once("loaded", () => {
    const { ipcRenderer } = require("electron");
    // window.addEventListener("DOMContentLoaded", () => {
    //     const replaceText = (selector, text) => {
    //         const element = document.getElementById(selector);
    //         if (element) element.innerText = text;
    //     };

    //     for (const dependency of ["chrome", "node", "electron"]) {
    //         replaceText(`${dependency}-version`, process.versions[dependency]);
    //     }
    // });

    ipcRenderer.on("focusedElementsList", (event, focusedElements) => {
        const listElement = document.getElementById("focused-elements-list");
        for (let i = 0; i < focusedElements.length; i++) {
            const newListItem = document.createElement("li");
            newListItem.innerHTML = `${focusedElements[i]}`;
            listElement.appendChild(newListItem);
        }
    });
    ipcRenderer.on("resetElementsList", (event) => {
        document.getElementById("focused-elements-list").innerHTML = "";
    });
});
