const EXTENSION_STATUS = "extension-status";
const INFO_SECTION_OPTION = "info-section";
const SETTNIGS_SECTION_OPTION = "settings-section";
const INACTIVE_EXTENSION = "inactive";
var extensionStatus = document.getElementById("on-off-block--toggle");
var settingsButton = document.getElementById("menu-block__settings_button");
var infoButton = document.getElementById("menu-block__info_button");

/**
 * Event listener which fires when the window has loaded. 
 * The getExtensionStatus() method is called in order to set the current settings of the extension.
 * 
 * @param {} 
 * @return {}
 */
window.onload = getExtensionStatus();

/**
 * Event listener which fires when the toggle button state is changed. 
 * The changeExtensionStatus method is called so that the storage variables are updated with the new state of the extension.
 *
 * @param {}
 * @return {}
 */
if(extensionStatus){
    extensionStatus.addEventListener('click', changeExtensionStatus, false);
}

/**
 * Event listener which fires when the 'Info' button is clicked. If the extension status is on the 
 * goToOptions method is called and the 'Options' page is opened.
 *
 * @param {}
 * @return {}
 */
 if(infoButton){
  infoButton.addEventListener('click', function(){
    // we check if the extension status div element has the 'INACTIVE_EXTENSION' class which determin if the extension is on or off
    if(!($(extensionStatus).hasClass(INACTIVE_EXTENSION))){
      goToOptions(INFO_SECTION_OPTION);
    }
  }, false);
}

/**
 * Event listener which fires when the 'Settings' button is clicked. If the extension status is on the 
 * goToOptions method is called and the 'Options' page is opened.
 *
 * @param {}
 * @return {}
 */
if(settingsButton){
  settingsButton.addEventListener('click', function(){
    // we check if the extension status div element has the 'INACTIVE_EXTENSION' class which determin if the extension is on or off
    if(!($(extensionStatus).hasClass(INACTIVE_EXTENSION))){
      goToOptions(SETTNIGS_SECTION_OPTION);
    }
  }, false);
}

/**
 * Method which returns the chrome storage data(the settings of the extension).
 *
 * @param {}
 * @return {Object} extensionSettings The data object which contains the current extenison settings as {key: value} pairs.
 */
async function getExtensionSettings(){
  let extensionSettings = await chrome.storage.sync.get(null);
  return extensionSettings;
}

/**
 * Method which updates the chrome storage data(the settings of the extension).
 *
 * @param {Object} extensionSettings The data object which will be store.
 * @return {}
 */
async function setExtensionSettings(extensionSettings){
  extensionSettings["text-to-speech-status"] = true;
  await chrome.storage.sync.set( extensionSettings, function (){
      if(chrome.runtime.lastError){
          console.error("Error: ", chrome.lastError.message);
      }
  });
}

/**
 * Function which turn on the extension status by removing the 'INACTIVE_EXTENSION' class 
 * from all the elements of the popup window.
 * 
 * @param {}
 * @return {}
 */
function turnOnTheExtension(){
  $(extensionStatus).removeClass(INACTIVE_EXTENSION);
  $(infoButton).removeClass(INACTIVE_EXTENSION);
  $(settingsButton).removeClass(INACTIVE_EXTENSION);
}

/**
 * Function which turn off the extension status by adding the 'INACTIVE_EXTENSION' class 
 * from all the elements of the popup window.
 * 
 * @param {}
 * @return {}
 */
function turnOffTheExtension(){
  $(extensionStatus).addClass(INACTIVE_EXTENSION);
  $(infoButton).addClass(INACTIVE_EXTENSION);
  $(settingsButton).addClass(INACTIVE_EXTENSION);
}

/**
 * Method which gets the extension settings and sets the design of the popup based on the settings values.
 * 
 * @param {}
 * @return {}
 */
async function getExtensionStatus(){
  let extensionSettings = await getExtensionSettings();
  console.log("Application settings in  script.js: ", extensionSettings);
  if(extensionSettings){
    // check the current status of the extension
    if(extensionSettings[EXTENSION_STATUS]){
      turnOnTheExtension();
      console.log("Extension is turned-on!");
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

/**
 * Method that is called when the toggle button changes its state. The design of the popup and
 * the chrome storage settings are also changed accordingly.
 *
 * @param {}
 * @return {}
 */
async function changeExtensionStatus(){
  var extensionSettings = await getExtensionSettings();
  if(extensionSettings){
    if($(extensionStatus).hasClass(INACTIVE_EXTENSION)){
      turnOnTheExtension();
      extensionSettings[EXTENSION_STATUS] = true;
    }
    else{
      turnOffTheExtension();
      extensionSettings[EXTENSION_STATUS] = false;
    }
    setExtensionSettings(extensionSettings);
  }
  else{
    console.log("Error: incorrect application mode configuration!");
  }
}

/**
 * Function which gets as a parmeter the user selected option and opens the 'Options' page of the extension by accessing its URL. 
 * Also, the selected option is passed as a URL parameter to the 'Options' page such that the user wanted option will be shown.
 *
 * @param {String} option Is a constant value which represents the clicked button from the popup window 
 * @return {} 
 */
function goToOptions(option){
  var extensionID = chrome.runtime.id;
  // we create the URL of the 'Options' page of the extension
  var pageURL = "chrome-extension://" + extensionID + "/options_page/options.html" + "?option=" + option;
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}