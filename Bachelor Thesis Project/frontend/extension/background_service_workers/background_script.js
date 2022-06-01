//---------------------------------------------General Extension Methods---------------------------------------------

/**
 * Method which updates the chrome storage data(the settings of the extension).
 *
 * @param {Object} extensionSettings The data object which will be store.
 * @return {}
 */
async function setApplicationSettings(extensionSettings){
    await chrome.storage.sync.set( extensionSettings, function (){
        if(chrome.runtime.lastError){
            console.error("Error: ", chrome.lastError.message);
        }
    });
}

/**
 * Method which returns the chrome storage data(the settings of the extension).
 *
 * @param {}
 * @return {Object} extensionSettings The data object which contains the current extenison settings as {key: value} pairs.
 */
async function getApplicationSettings(){
    let extensionSettings = await chrome.storage.sync.get(null);
    return extensionSettings;
}

/**
 * Event listener which fires when the extension is installed or updated to a new version.
 * The default settings of the extension are set.
 * @param {Object} details An object with the id property which is the ID of the imported shared module extension which updated(optional), 
 *                         previousVersion property which indicates the previous version of the extension(optional) and reason, a property  
 *                         that gives information about why this event is being dispatched.
 * @return {}
 * 
 */
chrome.runtime.onInstalled.addListener(async function(details){
    if((details.reason == "install") || (details.reason == "update")){
        let extensionSettings = {
            "extension-status": false,
            "text-to-speech-status": true,
            "image-description-mode": false,
            "social-media-feed-mode": false,
        }
        setApplicationSettings(extensionSettings);
        console.log("Extension installed or updated!");
    }
});

/**
 * Event listener which fires when the active tab in a window changes.
 * If the active tab changes than a message is send to the content scripts in order to verify if they were added to the current page.
 * A response message is verified and if it is not valid the content scripts files are injected into the web page.
 * Any error which is thrown because of an invalid accessed page is catch and printed in the console.
 * 
 * @param {Object} activeInfo An object which contains the ID of the tab that was made active, 
 *                            the ID of the previous activated tab and the ID of the tab's window.
 * @return {}
 */
 chrome.tabs.onActivated.addListener(function(activeInfo){
    let tabId = activeInfo.tabId;
    chrome.tabs.sendMessage(tabId, {text:"Content_Scripts"}, function(message){
        if(chrome.runtime.lastError){
            console.warn(chrome.runtime.lastError.message);
        }
        message = message || {};
        // check the response message
        if(message.response != 'Content_Scripts_Added'){
            //  inject the content scripts programmatically(using host permission in the manifest file) into the current web page
            chrome.scripting.executeScript(
                {
                  target: {tabId: tabId},
                  files: ['./content_scripts/application_script.js'],
                },
                () => {
                    let error = chrome.runtime.lastError;
                    if(error){
                        console.log(error.message);
                    }
                }
            );
        }
        else{
            console.log("Content scripts already inserted!");
        }
    });
});