const IMAGE_DESCRIPTION_MODE_CONSTANT= "image-description-mode";
const SOCIAL_MEDIA_MODE_CONSTANT = "social-media-feed-mode";
const EXTENSION_STATUS = "extension-status";
const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
const OPTIONS_SIGNAL = "options_signal";
var scrollEventAdded = false;
var lastKnownScrollPosition = 0;
var languagesJSON = "";


async function getLanguagesJSON(){
    let URL = chrome.runtime.getURL("./assets/utils/language_intros.json");
    let responses = await fetch(URL);
    languagesJSON = await responses.json();
}

async function addScrollEvent(){
    scrollEventAdded = true;
    document.addEventListener('scroll', function (){
        let currentScrollPosition = window.scrollY;
        if(currentScrollPosition>= lastKnownScrollPosition + 2000){
            lastKnownScrollPosition = currentScrollPosition;
            console.log("Scroll position updated!");
            checkExtensionSettings();
        }
    });
}

function removeScrollEvent(){
    document.removeEventListener('scroll', function(){
        lastKnownScrollPosition = 0;
        scrollEventAdded = false;
    });
}

// get the current status of the extension settings in order to make changes on the page accordinly
window.onload = onWindowLoad();

async function onWindowLoad(){
   await getLanguagesJSON();
   console.log("languagesJSON: ", languagesJSON);
   await addScrollEvent();
   await checkExtensionSettings();
}

/**
 * Method which returns the chrome storage data(the settings of the extension).
 *
 * @param {}
 * @return {Object} extensionSettings The data object which contains the current extenison settings as {key: value} pairs.
 */
async function getExtensionSettings(){
    let extensionSettings = null;
    try{
        extensionSettings = await chrome.storage.sync.get(null);
    }
    catch(error){
        console.log(error);
    }
    return extensionSettings;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("Message received: ", message.text);
    if (message.text === 'Content_Scripts'){
        sendResponse({response: "Content_Scripts_Added"});
    }
    checkExtensionSettings();
});

chrome.storage.onChanged.addListener(function(){
    checkExtensionSettings();
});

async function checkExtensionSettings(){
    var extensionSettings = await getExtensionSettings();
    if(extensionSettings !== null){
        console.log("Application Settings in application_script.js: \n", extensionSettings);
        if(extensionSettings[EXTENSION_STATUS] === true){
            let scrollEvent = false;
            if(extensionSettings[IMAGE_DESCRIPTION_MODE_CONSTANT] === true){
            // if(document.hasFocus()){
                if(!document.hidden){
                    console.log("HAS FOCUS! ");
                    let result = await getAllImages();
                    await sendImages(result);
                }
                //}
                scrollEvent = true;
            }
            if(extensionSettings[SOCIAL_MEDIA_MODE_CONSTANT] === true){
                //if(document.hasFocus()){
                if(!document.hidden){    
                    analyzePageData();
                }
                scrollEvent = true;
            }
            if(scrollEvent === true){
                console.log("Add scroll event!");
                if(scrollEventAdded === false)
                {
                    addScrollEvent();
                }
            }
        }
        else{
            console.log("Remove scroll event!");
            if(scrollEventAdded === true)
            {
                removeScrollEvent();
            }
        }
    }
}

/**
 * Method which gets the image source as a parameter and 
 *
 * @param {String} imageSrc An image source which represents the URL address of the image. 
 * @return {String} imageCaption A textual description of the image that source was the paramether.
 */
async function getImageCaption(imageSrc){
    var imageCaption = "";
    var dataObject = {
      imageURL: imageSrc
    };
    await axios({
      method: 'POST',
      //  url: 'https://hear-me-assistant.herokuapp.com/image',
      url: 'http://127.0.0.1:5000/image',
      data: dataObject,
      crossDomain: true
    }).then( function(response) {
        response=String(response.data);
        imageCaption = response;
        if(imageCaption === ""){
            console.log("The image couldn't be process!");
        }
    });
    return imageCaption;
  }