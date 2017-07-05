var urlList=["https://*.facebook.com/*"];
var keywordsList = ["code","programming"];
var finalKeywordsList=keywordsList.slice(0);
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
  let tempKeywordsList= [];
  if(store.keywords){
    store.keywords.forEach(function(item){
      if(item!="")
        tempKeywordsList.push(item);
    });
    finalKeywordsList =  keywordsList.concat(tempKeywordsList);
  }
  if(store.websites){
    let tempUrlList = [];
    store.websites.forEach(function(item,index){
      if(item!="")
        tempUrlList.push(item);
    });
    finalUrlList = urlList.concat(tempUrlList);
  }
}
function onError(e){
  console.log("Error retrieving keywords from local storage");
}
function listTabs(tabId,changeInfo){
  var index;
  keywordsForPattern = finalKeywordsList.join("|");
  pattern = new RegExp(keywordsForPattern,"i");
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
    {urls:["<all_urls>"]},
    ["blocking"]
  );
function cancel(requestDetails){
  var domain = requestDetails.url;
  var urlListPattern = new RegExp(finalUrlList.join("|"),"i");
  console.log(urlListPattern);
  for(var i=0;i<tabUrlList.length;i++){
    if((tabUrlList[i].val||titleList[i].val)&&domain.match(urlListPattern))
      return {cancel:true};
  }
  return {cancel:false};
}
