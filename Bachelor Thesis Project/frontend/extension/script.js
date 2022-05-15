const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const EXTENSION_STATUS = "extension-status";
const INFO_SECTION_OPTION = "info-section";
const SETTNIGS_SECTION_OPTION = "settings-section";
const INACTIVE_EXTENSION = "inactive";
var appStatus = document.getElementById("on-off-block--toggle");
var submitButton = document.getElementById("form-block__submit");
var settingsButton = document.getElementById("menu-block__settings_button");
var infoButton = document.getElementById("menu-block__info_button");
var lastKnownScrollPosition = 0;

if(appStatus){
    appStatus.addEventListener('click', changeAppStatus, false);
}


if(settingsButton){
  settingsButton.addEventListener('click', function(){
    if(!($(appStatus).hasClass(INACTIVE_EXTENSION))){
      goToOptions(SETTNIGS_SECTION_OPTION);
    }
  }, false);
}

if(infoButton){
  console.log("Info button clicked!");
  infoButton.addEventListener('click', function(){
    if(!($(appStatus).hasClass(INACTIVE_EXTENSION))){
      goToOptions(INFO_SECTION_OPTION);
    }
  }, false);
}

window.onload = getApplicationMode();

async function getPageData(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js", "scrollEvent.js"]
  });
}

async function checkIfSocialMedia(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js", "socialMedia.js"]
  });
}

async function getApplicationMode(){
  console.log("Yess");
  var applicationMode = await chrome.storage.sync.get(null);
  if(applicationMode){
    if(applicationMode[EXTENSION_STATUS]){
      $(appStatus).removeClass(INACTIVE_EXTENSION);
      let imageDescriptionMode = applicationMode[IMAGE_DESCRIPTION_MODE];
      let linkedInFeedMode = applicationMode[SOCIAL_MEDIA_MODE];
      if((imageDescriptionMode && !linkedInFeedMode) || (!imageDescriptionMode && linkedInFeedMode)){
        if(imageDescriptionMode){
          getPageData();
        }
        else{
          checkIfSocialMedia();
        // sendRequest();
        }
      }
    }
    else{
      $(appStatus).addClass(INACTIVE_EXTENSION);
      console.log("Extension is turned-off!");
    }
  }
  else{
    console.log("Error: incorrect application mode configuration!");
  }
  console.log("appMode: ", applicationMode);
}

async function changeAppStatus(){
  var applicationMode = await chrome.storage.sync.get(null);
  if($(appStatus).hasClass(INACTIVE_EXTENSION)){
      //$('#body-container').css("visibility", "visible");
      $(appStatus).removeClass(INACTIVE_EXTENSION);
      applicationMode[EXTENSION_STATUS] = true;
  }
  else{
      //$('#body-container').css("visibility", "hidden");
      $(appStatus).addClass(INACTIVE_EXTENSION);
      applicationMode[EXTENSION_STATUS] = false;
  }
  await chrome.storage.sync.set( applicationMode, function (data){
    if(chrome.runtime.lastError){
        console.error("Error: ", chrome.lastError.message);
    }
    console.log("Data: ", data);
  });
}

function goToOptions(option){
  var extensionID = chrome.runtime.id;
  var pageURL = "chrome-extension://" + extensionID + "/options/options.html" + "?option=" + option;
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}