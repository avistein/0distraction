var urlList=["https://*.facebook.com/*"];
var keywordsList = ["code","programming"];
var finalKeywordsList=[];
var finalUrlList = urlList.slice(0);
var keywordsForPattern;
var pattern;
var tabUrlList = [];
var titleList = [];
getFromStorage();
function getFromStorage(){
  browser.storage.local.get().then(store,onError);
}
function store(store){
  if(store.keywords){
    finalKeywordsList = keywordsList.concat(store.keywords);
    finalKeywordsList.forEach(function(item,index){
      if(item=="")
        finalKeywordsList.splice(index,1);
    });
  }
  if(store.websites){
    finalUrlList = urlList.concat(store.websites);
    finalUrlList.forEach(function(item,index){
      if(item=="")
        finalUrlList.splice(index,1);
    });
  }
}
function onError(e){
  console.log("Error retrieving keywords from local storage");
}
function listTabs(tabId,changeInfo){
  var index;
  console.log(finalKeywordsList);
  keywordsForPattern = finalKeywordsList.join("|");
  pattern = new RegExp(keywordsForPattern,"i");
  console.log(keywordsForPattern);
  for(index=0;index<tabUrlList.length;index++){
    if(tabUrlList[index].tabId==tabId){
      break;
    }
  }
    if(changeInfo.url){
      if(changeInfo.url.match(pattern)){
        tabUrlList[index].val = 1;
      }
      else {
        tabUrlList[index].val = 0;
      }
    }
    if(changeInfo.title){
      if(changeInfo.title.match(pattern)){
        titleList[index].val = 1;
      }
      else{
        titleList[index].val = 0;
      }
    }
}
function addTabs(tab){
  var obj = {tabId:tab.id,val:0};
  tabUrlList.push(obj);
  titleList.push(obj);
}
function removeTabs(tabId){
  var index;
  for(index=0;index<tabUrlList.length;index++){
    if(tabUrlList[index].tabId==tabId){
      break;
    }
  }
  tabUrlList.splice(index,1);
  titleList.splice(index,1);
}
browser.tabs.onCreated.addListener(addTabs);
browser.tabs.onUpdated.addListener(listTabs);
browser.tabs.onRemoved.addListener(removeTabs);
browser.storage.onChanged.addListener(getFromStorage);
browser.webRequest.onBeforeRequest.addListener(
    cancel,
    {urls:finalUrlList},
    ["blocking"]
  );
function cancel(requestDetails){
  console.log(finalUrlList);
  for(var i=0;i<tabUrlList.length;i++){
    if(tabUrlList[i].val||titleList[i].val)
      return {cancel:true};
  }
  return {cancel:false};
}
