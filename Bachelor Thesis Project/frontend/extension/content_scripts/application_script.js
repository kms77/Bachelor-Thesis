const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const EXTENSION_STATUS = "extension-status";
const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
const OPTIONS_SIGNAL = "options_signal";
// var lastKnownScrollPosition = 0;
// document.addEventListener('scroll', async function (){
//     let appliationSettings = await getApplicationSettings();
//     if(appliationSettings[EXTENSION_STATUS] === true){
//         let currentScrollPosition = window.scrollY;
//         if(currentScrollPosition>= lastKnownScrollPosition + 2000)
//         {
//             lastKnownScrollPosition = currentScrollPosition;
//             if(appliationSettings[SOCIAL_MEDIA_MODE] === true){
//                 analyzePageData();
//             }
//             else{
//                 onEntry();
//             }
//         }
//     }
// });

async function getApplicationSettings(){
    let applicationSettings = await chrome.storage.sync.get(null);
    return applicationSettings;
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//     if(request.message === CHECK_EXTENSION_SETTINGS){
//         // resolve promise
//         console.log("In application_script.js, onMessage: ", request.message);
//        checkExtensionSettings();
//        sendResponse({complete: true});
//     }
//     else{
//         sendResponse({complete: false});
//     }
//     return true;
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("Message received: ", message.text);
    if (message.text === 'Content_Scripts'){
        sendResponse({response: "Content_Scripts_Added"});
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace){
    checkExtensionSettings();
    // chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    //     const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
    //     console.log("In extension settings! No of tabs: ", tabs.length);
    //     for(let index = 0; index<tabs.length; ++index){
    //     chrome.tabs.sendMessage(tabs[index].id, {"message": CHECK_EXTENSION_SETTINGS}, response => {
    //         var lastError = chrome.runtime.lastError;
    //         if (lastError) {
    //             console.log(lastError.message);
    //             // 'Could not establish connection. Receiving end does not exist.'
    //             return;
    //         }
    //         if(response.complete){
    //             console.log("Application settings updated successfully for tab with id: !", tabs[index].id);
    //         }
    //         else{
    //             console.log("Application settings was not updated for tab with id: !", tabs[index].id);
    //         }
    //        });
    //    } 
// });
});


// async function getImageCaption(imageSrc){
//     var imageCaption = "";
//     var dataObject = {
//       imageURL: imageSrc
//     };
//     await axios({
//       method: 'POST',
//       //  url: 'https://hear-me-assistant.herokuapp.com/data',
//       url: 'http://127.0.0.1:5000/images',
//       data: dataObject,
//       crossDomain: true
//     }).then( function(response) {
//         response=String(response.data);
//         imageCaption = response;
//     });
//     return imageCaption;
//   }

checkExtensionSettings();

async function checkExtensionSettings(){
    // possible to return a promise
    var applicationSettings = await getApplicationSettings();
    console.log("Application Settings in application_script.js: \n", applicationSettings);
    if(applicationSettings[EXTENSION_STATUS] === true){
        let scrollEvent = false;
        if(applicationSettings[IMAGE_DESCRIPTION_MODE] === true){
            //startImageDescriptionMode();
            scrollEvent = true;
        }
        if(applicationSettings[SOCIAL_MEDIA_MODE] === true){
            //startSocialMediaMode();
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