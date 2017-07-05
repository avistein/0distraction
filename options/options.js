const keywordsTextArea = document.querySelector('#keywords');
const websitesTextArea = document.querySelector('#websites');
function storeKeywords(){
  var keywords = keywordsTextArea.value.split("\n");
  browser.storage.local.set({
    keywords
  });
}
function storeWebsites(){
  var websites = websitesTextArea.value.split("\n");
  browser.storage.local.set({
    websites
  });
}
function updateTextArea(restoredSettings) {
    if(restoredSettings.keywords)
  keywordsTextArea.value = restoredSettings.keywords.join("\n");
    if(restoredSettings.websites)
  websitesTextArea.value = restoredSettings.websites.join("\n");
}

function onError(e) {
  console.error(e);
}
browser.storage.local.get().then(updateTextArea, onError);
keywordsTextArea.addEventListener("change",storeKeywords);
websitesTextArea.addEventListener("change",storeWebsites);
