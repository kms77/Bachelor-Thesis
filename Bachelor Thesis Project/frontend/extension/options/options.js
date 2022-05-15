const IMAGE_DESCRIPTION_MODE= "image-description-mode";
const SOCIAL_MEDIA_MODE = "social-media-feed-mode";
const INFO_SECTION_OPTION = "info-section";
const SETTNIGS_SECTION_OPTION = "settings-section";
const CLOSE_BUTTON_ID = "close-button-id";
var closeButtonID = document.getElementById(CLOSE_BUTTON_ID);
var imageDescriptionMode = document.getElementById(IMAGE_DESCRIPTION_MODE);
var socialMediaMode = document.getElementById(SOCIAL_MEDIA_MODE);

window.onload = getSelectedOption();

if(imageDescriptionMode){
    imageDescriptionMode.addEventListener('change', function(){
        setApplicationMode(IMAGE_DESCRIPTION_MODE);
    }, false);
}

if(socialMediaMode){
    socialMediaMode.addEventListener('change', function(){
        setApplicationMode(SOCIAL_MEDIA_MODE);
    }, false);
}

if(closeButtonID){
    closeButtonID.addEventListener('click', closePage, false);
}

function getSelectedOption(){
    const params = new URLSearchParams(window.location.search);
    let target = ".";
    if(params && params.has('option')){
        let selectedOption = params.get('option');
        if((selectedOption === INFO_SECTION_OPTION) || (selectedOption === SETTNIGS_SECTION_OPTION)){
            target += selectedOption;
        }
        else{
            target += SETTNIGS_SECTION_OPTION;
        }
    }
    else{
        target += SETTNIGS_SECTION_OPTION;
    }
    showSelectedOption(target);
}

async function setApplicationMode(changedTextBox){
    var applicationMode = await chrome.storage.sync.get(null);
    var currentStatus = document.getElementById(changedTextBox).checked;
    applicationMode[changedTextBox] = currentStatus;
    await chrome.storage.sync.set( applicationMode, function (data){
        if(chrome.runtime.lastError){
            console.error("Error: ", chrome.lastError.message);
        }
        console.log("Data: ", data);
    });
}

function closePage(){
    window.close();
}

$('.link-section').click(function() {
    var target = '.' + $(this).data('target');
    showSelectedOption(target);
})

async function showSelectedOption(target){
    console.log(typeof target);
    let applicationMode = await chrome.storage.sync.get(null);
    imageDescriptionMode.checked = applicationMode[IMAGE_DESCRIPTION_MODE];
    socialMediaMode.checked = applicationMode[SOCIAL_MEDIA_MODE];
    $('#selected-option-container div').hide();
    $(target).show();
}