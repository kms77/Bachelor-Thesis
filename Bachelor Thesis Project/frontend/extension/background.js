function processMessage(message){
    return new Promise((resolve) => {
        chrome.tts.speak(message, {'enqueue': true});
        resolve("Done");
    });
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
        default:
          console.log("Invalid key shortcut!");
    }
    if(Object.keys(applicationMode).length){
        await chrome.storage.sync.set( applicationMode, function (data){
            if(chrome.runtime.lastError){
                console.error("Error: ", chrome.lastError.message);
            }
            console.log("Data: ", data);
        });
    }
  });