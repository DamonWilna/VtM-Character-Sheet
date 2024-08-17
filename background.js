let characterSheetWindow = null;

function openCharacterSheet() {
  // Check if a character sheet window is already open
  if (characterSheetWindow) {
    // If it is, just focus on that window
    browser.windows.update(characterSheetWindow.id, { focused: true });
  } else {
    // If not, create a new window
    browser.windows.create({
      url: "character-sheet.html",
      type: "popup",
      width: 1024,
      height: 1300
    }).then((windowInfo) => {
      characterSheetWindow = windowInfo;
    });
  }
}

// Listen for clicks on the browser action
browser.browserAction.onClicked.addListener(openCharacterSheet);

// Create context menu item
browser.contextMenus.create({
  id: "open-vtm-sheet",
  title: "Open VtM Character Sheet",
  contexts: ["all"]
});

// Listen for clicks on the context menu item
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-vtm-sheet") {
    openCharacterSheet();
  }
});

// Listen for window close events to reset the characterSheetWindow variable
browser.windows.onRemoved.addListener((windowId) => {
  if (characterSheetWindow && characterSheetWindow.id === windowId) {
    characterSheetWindow = null;
  }
});