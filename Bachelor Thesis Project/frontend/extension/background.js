function processMessage(message){
    return new Promise((resolve) => {
        chrome.tts.speak(message, {'enqueue': true});
        resolve("Done");
    });
}

async function setApplicationSettings(applicationSettings){
    await chrome.storage.sync.set( applicationSettings, function (data){
        if(chrome.runtime.lastError){
            console.error("Error: ", chrome.lastError.message);
        }
        console.log("Data: ", data);
    });
}

async function getApplicationSettings(){
    let applicationSettings = await chrome.storage.sync.get(null);
    return applicationSettings;
}

function processExtensionGuide(){
    const guideMessage = `Here is the guide for all shortcuts of the extension.
    To turn on or turn off the extension press Ctrl+Shift+Up arrow or Command+Shift+Up arrow if you are a mac user. 
    If you want to stop the text to speech of the extension press Ctrl+Shift+Down or Command+Shift+Down for mac users.
    To open the shortcuts guide of the extension press Ctrl+Shift+Left arrow or Command+Shift+Left arrow if you are a mac user.
    Press Ctrl+Shift+Right arrow or Command+Shift+Left arrow (for mac users) to resume the text to speech mode of the extension or to pause it.`
    chrome.tts.speak(guideMessage, {'enqueue': true});
}

chrome.runtime.onInstalled.addListener(async function(details){
    if(details.reason == "install"){
        //call a function to handle a first install
        let appliationSettings = {
            "extension-status": false,
            "text-to-speech-status": true,
            "image-description-mode": false,
            "social-media-feed-mode": false
        }
        setApplicationSettings(appliationSettings);
        console.log("Extension installed!");

    }else if(details.reason == "update"){
        //call a function to handle an update
        console.log("Extension updated!");
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    processMessage(request.message).then(() => {
        // telling that CS has finished its job
        sendResponse({complete: true});
      });
  
      // return true from the event listener to indicate you wish to send a response asynchronously
      // (this will keep the message channel open to the other end until sendResponse is called).
      return true;
});


//chrome.commands.onCommand.addListener(async function(command){
    chrome.commands.onCommand.addListener(async function(command ) {
    console.log(`Command: "${command}" called!`);
    const EXTENSION_STATUS = "extension-status";
    const TTS_STATUS = "text-to-speech-status";
    const STOP_TEXT_TO_SPEECH  = "stop-text-to-speech";
    const EXTENSION_SHORTCUTS_GUIDE = "extension-shortcuts-guide";
    let applicationSettings = await getApplicationSettings();
    switch(command) {
        case EXTENSION_STATUS:
            applicationSettings[EXTENSION_STATUS] = !applicationSettings[EXTENSION_STATUS];
            if(applicationSettings[EXTENSION_STATUS] === false){
                chrome.tts.stop();
            }
            break;
        case TTS_STATUS:
            applicationSettings[TTS_STATUS] = !applicationSettings[TTS_STATUS];
            if(applicationSettings[TTS_STATUS] === false){
                chrome.tts.pause();
            }
            else{
                chrome.tts.resume();
            }
            break;
        case STOP_TEXT_TO_SPEECH:
            chrome.tts.stop(); 
            break;
        case EXTENSION_SHORTCUTS_GUIDE:
            processExtensionGuide();
            break;
        default:
          console.log("Invalid key shortcut!");
    }
    if(Object.keys(applicationSettings).length){
        await setApplicationSettings(applicationSettings);
    }
  });