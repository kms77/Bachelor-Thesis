const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const EXTENSION_STATUS = "extension-status";
const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
const OPTIONS_SIGNAL = "options_signal";
var lastKnownScrollPosition = 0;

async function addScrollEvent(){
 document.addEventListener('scroll', function (){
    let currentScrollPosition = window.scrollY;
    if(currentScrollPosition>= lastKnownScrollPosition + 2000)
        {
            lastKnownScrollPosition = currentScrollPosition;
            console.log("Scroll position updated!");
            checkExtensionSettings();
        }
    });
}

// get the current status of the extension settings in order to make changes on the page accordinly
window.onload = onWindowLoad();

async function onWindowLoad(){
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
    let extensionSettings = await chrome.storage.sync.get(null);
    return extensionSettings;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("Message received: ", message.text);
    if (message.text === 'Content_Scripts'){
        sendResponse({response: "Content_Scripts_Added"});
    }
});

chrome.storage.onChanged.addListener(function(){
    checkExtensionSettings();
});

async function checkExtensionSettings(){
    var extensionSettings = await getExtensionSettings();
    console.log("Application Settings in application_script.js: \n", extensionSettings);
    if(extensionSettings[EXTENSION_STATUS] === true){
        let scrollEvent = false;
        if(extensionSettings[IMAGE_DESCRIPTION_MODE] === true){
            let result = await getAllImages();
            await sendImages(result);
            scrollEvent = true;
        }
        if(extensionSettings[SOCIAL_MEDIA_MODE] === true){
            analyzePageData();
            scrollEvent = true;
        }
        if(scrollEvent === true){
            console.log("Add scroll event!");
        }
    }
    else{
        console.log("Remove scroll event!");
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
    });
    return imageCaption;
  }