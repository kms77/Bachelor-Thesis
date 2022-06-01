const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const EXTENSION_STATUS = "extension-status";
const INFO_SECTION_OPTION = "info-section";
const SETTNIGS_SECTION_OPTION = "settings-section";
const INACTIVE_EXTENSION = "inactive";
const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
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
  infoButton.addEventListener('click', function(){
    if(!($(appStatus).hasClass(INACTIVE_EXTENSION))){
      goToOptions(INFO_SECTION_OPTION);
    }
  }, false);
}

window.onload = getApplicationMode();

async function setApplicationSettings(applicationSettings){
  applicationSettings["text-to-speech-status"] = true;
  await chrome.storage.sync.set( applicationSettings, function (data){
      if(chrome.runtime.lastError){
          console.error("Error: ", chrome.lastError.message);
      }
      console.log("Data: ", data);
  });
  //extensionSettingsChanged();
}

async function getApplicationSettings(){
  let applicationSettings = await chrome.storage.sync.get(null);
  return applicationSettings;
}

// function extensionSettingsChanged() {
//   chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": CHECK_EXTENSION_SETTINGS}, response => {
//         if(response.complete){
//           console.log("Application settings updated successfully!");
//         }
//         else{
//           console.log("Application settings was not updated!");
//         }
//       });
//  });
// }

// async function getPageData(){
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js", "scrollEvent.js"]
//   });
// }

// async function checkIfSocialMedia(){
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js", "socialMedia.js"]
//   });
// }

function turnOnTheExtension(){
  $(appStatus).removeClass(INACTIVE_EXTENSION);
  $(infoButton).removeClass(INACTIVE_EXTENSION);
  $(settingsButton).removeClass(INACTIVE_EXTENSION);
}

function turnOffTheExtension(){
  $(appStatus).addClass(INACTIVE_EXTENSION);
  $(infoButton).addClass(INACTIVE_EXTENSION);
  $(settingsButton).addClass(INACTIVE_EXTENSION);
}

async function getApplicationMode(){
  let applicationSettings = await getApplicationSettings();
  console.log("Application settings in  script.js: ", applicationSettings);
  if(applicationSettings){
    if(applicationSettings[EXTENSION_STATUS]){
      turnOnTheExtension();
      console.log("Extension is turned-on!");
      // let imageDescriptionMode = applicationSettings[IMAGE_DESCRIPTION_MODE];
      // let linkedInFeedMode = applicationSettings[SOCIAL_MEDIA_MODE];
      // if((imageDescriptionMode && !linkedInFeedMode) || (!imageDescriptionMode && linkedInFeedMode)){
      //   if(imageDescriptionMode){
      //     getPageData();
      //   }
      //   else{
      //     checkIfSocialMedia();
      //   }
      // }
    }
    else{
      turnOffTheExtension();
      console.log("Extension is turned-off!");
    }
  }
  else{
    console.log("Error: incorrect application mode configuration!");
  }
}

async function changeAppStatus(){
  var applicationSettings = await getApplicationSettings();
  if($(appStatus).hasClass(INACTIVE_EXTENSION)){
    turnOnTheExtension();
    applicationSettings[EXTENSION_STATUS] = true;
  }
  else{
    turnOffTheExtension();
    applicationSettings[EXTENSION_STATUS] = false;
  }
  setApplicationSettings(applicationSettings);
}

function goToOptions(option){
  var extensionID = chrome.runtime.id;
  var pageURL = "chrome-extension://" + extensionID + "/options_page/options.html" + "?option=" + option;
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}