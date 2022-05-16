function processMessage(message){
    return new Promise((resolve) => {
        chrome.tts.speak(message, {'enqueue': true});
        resolve("Done");
    });
}

function processExtensionGuide(){
    const guideMessage = `Here is the guide for all shortcuts of the extension.
    To turn on the extension press Ctrl+Shift+Up arrow or Command+Shift+Up arrow if you are a mac user.
    If you want to turn off the extension press Ctrl+Shift+Down arrow or Command+Shift+Down for mac users.
    Press Ctrl+Shift+Left arrow or Command+Shift+Left arrow (if you are a mac user) to pause text to speech mode of the extension.
    Press  Ctrl+Shift+Right arrow or Command+Shift+Left arrow (for mac users) to resume the text to speech mode of the extension if it was paused.
    If you want to stop the text to speech of the extension press Ctrl+Shift or Command+Shift if you are a mac user.
    To open the shortcuts guide of the extension press Ctrl+Shift+Space or Command+Shift+Space for mac users.`;
    chrome.tts.speak(guideMessage, {'enqueue': true});
}

chrome.runtime.onInstalled.addListener(async function(details){
    if(details.reason == "install"){
        //call a function to handle a first install
        let applicationMode = {
            "extension-status": false,
            "image-description-mode": false,
            "social-media-feed-mode": false
        }
        await chrome.storage.sync.set( applicationMode, function (data){
            if(chrome.runtime.lastError){
                console.error("Error: ", chrome.lastError.message);
            }
            console.log("Data: ", data);
        });
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


chrome.commands.onCommand.addListener(async function(command){
    console.log(`Command: "${command}" called!`);
    let applicationMode = {};
    switch(command) {
        case "turn-on-extension":
            applicationMode["extension-status"] = true;
            break;
        case "turn-off-extension":
            applicationMode["extension-status"] = false;
            break;
        case "stop-text-to-speech":
            chrome.tts.stop(); 
            break;
        case "pause-text-to-speech":
            chrome.tts.pause();
            break;
        case "resume-text-to-speech":
            chrome.tts.resume();
            break;
        case "extension-shortcuts-guide":
            processExtensionGuide();
            break;
        default:
          console.log("Invalid key shortcut!");
    }
    if(Object.keys(applicationMode).length){
        chrome.tts.stop();
        await chrome.storage.sync.set( applicationMode, function (data){
            if(chrome.runtime.lastError){
                console.error("Error: ", chrome.lastError.message);
            }
            console.log("Data: ", data);
        });
    }
  });