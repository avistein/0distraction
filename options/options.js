const keywordsTextArea = document.querySelector('#keywords');
const websitesTextArea = document.querySelector('#websites');
/*storing keywords from textArea to local storage*/
function storeKeywords(){
  var keywords = keywordsTextArea.value.split("\n");
  browser.storage.local.set({
    keywords
  });
}
/*storing websites from textArea to local storage*/
function storeWebsites(){
  var websites = websitesTextArea.value.split("\n");
  browser.storage.local.set({
    websites
  });
}
/*populating the textArea when options.html is opened*/
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
