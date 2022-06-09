const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const INFO_SECTION_OPTION = "info-section";
const SETTNIGS_SECTION_OPTION = "settings-section";
const CHECK_EXTENSION_SETTINGS = "extension_settings_signal";
const CLOSE_BUTTON_ID = "close-button-id";
const EXTENSION_ID = "extension-id";
var closeButtonID = document.getElementById(CLOSE_BUTTON_ID);
var imageDescriptionMode = document.getElementById(IMAGE_DESCRIPTION_MODE);
var socialMediaMode = document.getElementById(SOCIAL_MEDIA_MODE);

/**
 * Event listener which fires when the window has loaded
 * The getSelectedOption() method is called
 * 
 * @param {} 
 * @return {}
 */
window.onload = getSelectedOption();

/**
 * Selector method which fires when a DOM element with the class link-sleection is clicked
 * The selected menu option is obtained by the data-target tag and passed as a parameter for the method which will show the selected option
 *
 * @param {}
 * @return {}
 */
$('.link-section').click(function() {
    var target = '.' + $(this).data('target');
    showSelectedOption(target);
});

/**
 * Event listener which fires when the Image Description Mode checkbox state is changed and the method which will update 
 * the current extension settings with the selected mode is called
 *
 * @param {}
 * @return {}
 */
if(imageDescriptionMode){
    imageDescriptionMode.addEventListener('change', function(){
        setApplicationMode(IMAGE_DESCRIPTION_MODE);
    }, false);
}

/**
 * Event listener which fires when the Social Media Mode checkbox state is changed and the method which will update 
 * the current extension settings with the selected mode is called
 *
 * @param {}
 * @return {}
 */
if(socialMediaMode){
    socialMediaMode.addEventListener('change', function(){
        setApplicationMode(SOCIAL_MEDIA_MODE);
    }, false);
}

/**
 * Event listener which fires when the 'Exit' button is clicked and the closePage method is called in order to close the 'Options' page tab
 *
 * @param {}
 * @return {}
 */
if(closeButtonID){
    closeButtonID.addEventListener('click', closePage, false);
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
    await chrome.storage.sync.set( extensionSettings, function (){
        if(chrome.runtime.lastError){
            console.error("Error: ", chrome.lastError.message);
        }
    });
}

/**
 * Method which gets the changed checkbox element and creates the data object with the new extension settings
 * The data object is passed as a parameter for other method in order to be updated the chrome storage extension settings
 *
 * @param {Object} changedTextBox An element object which represents the checkbox element which state was changed.
 * @return {}
 */
async function setApplicationMode(changedTextBox){
    var extensionSettings = await getExtensionSettings();
    var currentStatus = document.getElementById(changedTextBox).checked;
    extensionSettings[changedTextBox] = currentStatus;
    setExtensionSettings(extensionSettings);
}

/**
 * Method which gets the URL search parameter 'option' which represents the user selected button in the popup of the extension, 
 * gets the selected page(or the default one) and calls the method which shows it
 *
 * @param {Object} changedTextBox An element object which represents the checkbox element which state was changed.
 * @return {}
 */
function getSelectedOption(){
    const params = new URLSearchParams(window.location.search);
    let target = ".";
    if(params && params.has('option')){
        let selectedOption = params.get('option');
        if((selectedOption === INFO_SECTION_OPTION) || (selectedOption === SETTNIGS_SECTION_OPTION)){
            target += selectedOption;
        }
        // if the value does not correspond with the default options the settings page is selected
        else{
            target += SETTNIGS_SECTION_OPTION;
        }
    }
    // if there is no 'option' parameter the settings page is selected as default option
    else{
        target += SETTNIGS_SECTION_OPTION;
    }
    showSelectedOption(target);
}

/**
 * Method which shows the selected menu by the target paramter which represents the class of the menu
 * In order to perform this action both menus are hidden then the selected menu is shown
 * Also, the state of the checkboxes is updated with respect to extenion settings
 *
 * @param {String} target The class of the selected menu
 * @return {}
 */
async function showSelectedOption(target){
    let applicationSettings = await getExtensionSettings();
    imageDescriptionMode.checked = applicationSettings[IMAGE_DESCRIPTION_MODE];
    socialMediaMode.checked = applicationSettings[SOCIAL_MEDIA_MODE];
    $('#selected-option-container div').hide();
    $(target).show();
}

/**
 * Method which closes the 'Options' page tab
 *
 * @param {}
 * @return {}
 */
function closePage(){
    window.close();
}