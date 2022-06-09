//---------------------------------------------Social Media Mode Methods---------------------------------------------

/**
 * Event listener which fires when a keyboard shortcut command declared in the manifest file triggers an action.
 * The command is identified and the text-to-speech functionality or the extension status is changed accordingly.
 *
 * @param {String} command The keyboard shortcut which triggered the action.
 * @return {}
 */
 chrome.commands.onCommand.addListener(async function(command ) {
    console.log(`Keyboard shortcut: "${command}" used!`);
    // define the constant varibles which represents the properties of the "commands" object from the manifest file
    const EXTENSION_STATUS = "extension-status";
    const TTS_STATUS = "text-to-speech-status";
    const STOP_TEXT_TO_SPEECH  = "stop-text-to-speech";
    const EXTENSION_SHORTCUTS_GUIDE = "extension-shortcuts-guide";
    let applicationSettings = await getExtensionSettings();
    // check which command property triggered the action
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
            // processExtensionGuide();
            break;
        default:
          console.log("Invalid key shortcut!");
    }
    // the chrome storage is updated if the triggered action changed the settings of the extension
    if(Object.keys(applicationSettings).length){
        await setExtensionSettings(applicationSettings);
    }
  });

/**
 * Method which gets a text message and process it using text-to-speech functionality.
 * Each message is process one by one, in the received order.
 *
 * @param {String} message The message to be process.
 * @return {String} Promise resolve The confiramation that the message was processed.
 */
function processMessage(message){
    return new Promise((resolve) => {
        chrome.tts.speak(message, {'enqueue': true});
        resolve("Done");
    });
}

/**
 * Event listener which fires when a message is received from the content scripts.
 * A response is send back in order to confirm that the message was received.
 * 
 * @param {Object} request A JSON object which contains a message send by the content script.
 * @param {Object} sender An object giving details about the message sender.
 * @param {function} sendResponse Is a function that can be used to send a response back to the sender.
 * @return {boolean} boolean value A value which indicates if the message channel should be keep open or not.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    processMessage(request.message).then(() => {
        // confirmation that the message was received and processed
        sendResponse({complete: true});
      });
  
      // return true to indicate that an asynchronous response will be send
      // it will keep the message channel open to the other end until sendResponse is called.
      return true;
});