var urlList=["https://www.facebook.com"];
var keywordsList = ["code","programming","mdn","developers","coding","tutorials","stackoverflow",
"github","xda","java","python","javascript","ruby","django","linux","nodejs","reactjs","sql","wikipedia",
"onenote","gate","cse"];
var keywordsForPattern;
var pattern;
var tabUrlList = [];
var titleList = [];

/*fetching keywords and urls from local storage for the first time*/
getFromStorage();

/*fetching keywords and urls from local storage whenever the local storage changes*/
function getFromStorage(){
  browser.storage.local.get().then(store,onError);
}

/**success callback function for the get().then() promise
  * @store holds the object used in set method
*/
function store(store){
  let tempKeywordsList= [];
  if(store.keywords){
    store.keywords.forEach(function(item){
      if(item!="")
        tempKeywordsList.push(item);
    });
    keywordsList =  keywordsList.concat(tempKeywordsList);
  }
  if(store.websites){
    let tempUrlList = [];
    store.websites.forEach(function(item,index){
      if(item!="")
        tempUrlList.push(item);
    });
    urlList = urlList.concat(tempUrlList);
  }
}

/*error callback for get().then() promise*/
function onError(e){
  console.log("Error retrieving keywords from local storage");
}

/**callback for the onUpdated event listener-fires when the tab is changed
  * @tabId holds the id of the tab which is changed
  * @changeInfo holds other info like url,title etc of the changed tabId
  * @pattern creating a pattern with all the keywords to match with title or url
*/
function changeTabs(tabId,changeInfo){
  var index;
  keywordsForPattern = keywordsList.join("|");
  pattern = new RegExp(keywordsForPattern,"i");
  for(index=0;index<tabUrlList.length;index++){
    if(tabUrlList[index].tabId==tabId){
      break;
    }
  }
    if(changeInfo.url){
      if(changeInfo.url.match(pattern)){
        tabUrlList[index].val = true;
        console.log("fired1");
      }
      else {
        tabUrlList[index].val = false;
      }
    }
    if(changeInfo.title){
      if(changeInfo.title.match(pattern)){
        titleList[index].val = true;
        console.log("fired2");
      }
      else{
        titleList[index].val = false;
      }
    }
}

/**callback for onCreated event listener-fires when new tab is created
  *@tab contains info about the newly created tab
  *@val check if the tab contains keyword values-if yes then true
*/
function addTabs(tab){
  console.log("fired0");
  var obj = {tabId:tab.id,val:false};
  tabUrlList.push(obj);
  titleList.push(obj);
}

/**callback for onRemoved event listener-fires when tab is destroyed
  * @tabId id of the removed tab
  * @index find the removed tab id in the listener
*/
function removeTabs(tabId){
  console.log("fired3");
  var index;
  for(index=0;index<tabUrlList.length;index++){
    if(tabUrlList[index].tabId==tabId){
      break;
    }
  }
  tabUrlList.splice(index,1);
  titleList.splice(index,1);
}

/**callback for onBeforeRequest-fires when a request is about to be made
  * @requestDetails conatins details about the request
  * @domain url at which the request is made to
  * @urlListPattern pattern of all urls which is to be blocked if there
    is a match with the @domain
*/
function cancelRequest(requestDetails){
  var domain = requestDetails.url;
  var urlListPattern = new RegExp(urlList.join("|"),"i");
  for(var i=0;i<tabUrlList.length;i++){
    if((tabUrlList[i].val||titleList[i].val)&&domain.match(urlListPattern)){
      console.log("Cancelling : ", requestDetails.url);
      //console.log("")
      return {cancel:true};
    }
  }
  return {cancel:false};
}

browser.tabs.onCreated.addListener(addTabs);
browser.tabs.onUpdated.addListener(changeTabs);
browser.tabs.onRemoved.addListener(removeTabs);
browser.storage.onChanged.addListener(getFromStorage);
browser.webRequest.onBeforeRequest.addListener(
    cancelRequest,
    {urls:["<all_urls>"]},
    ["blocking"]
  );
