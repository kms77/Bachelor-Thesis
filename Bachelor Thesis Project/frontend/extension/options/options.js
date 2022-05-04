window.onload =getSelectedOption();

var saveCredentialsButton = document.getElementById("form-block__save");
var closeButtonID = document.getElementById("close-button-id");
var imageDescriptionMode = document.getElementById("image-description-mode");
var linkedinMode = document.getElementById("linkedIn-feed-mode");

if(imageDescriptionMode){
    imageDescriptionMode.addEventListener('change', function(){
        const changedTextBox = "image-description-mode";
        const toChangeTextBox = "linkedIn-feed-mode";
        const toUncheckTextBox = "linkedIn-credentials";
        document.getElementById(toUncheckTextBox).checked = false;
        changeApplicationMode(changedTextBox, toChangeTextBox, toUncheckTextBox);
    }, false);
}

if(linkedinMode){
    linkedinMode.addEventListener('change', function(){
        const changedTextBox = "linkedIn-feed-mode";
        const toChangeTextBox = "image-description-mode";
        const toUncheckTextBox = "linkedIn-credentials";
        document.getElementById(toUncheckTextBox).checked = false;
        changeApplicationMode(changedTextBox, toChangeTextBox);
    }, false);
}

if(closeButtonID){
    closeButtonID.addEventListener('click', closePage, false);
}

if(saveCredentialsButton){
    console.log("Button clicked: ");
    saveCredentialsButton.addEventListener('click', saveCredentials, false);
}

async function changeApplicationMode(changedTextBox, toChangeTextBox){
    var currentStatus = document.getElementById(changedTextBox).checked;
    if(currentStatus){
        document.getElementById(toChangeTextBox).checked = false;
    }
    else{
        document.getElementById(toChangeTextBox).checked = true;
    }
    await setApplicationMode(changedTextBox, toChangeTextBox);
}

function getSelectedOption(){
    const params = new URLSearchParams(window.location.search);
    const infoOption = 'info-section';
    const settingsOption = 'settings-section';
    let target = ".";
    if(params && params.has('option')){
        let selectedOption = params.get('option');
        if((selectedOption === infoOption) || (selectedOption === settingsOption)){
            target += selectedOption;
        }
        else{
            target += settingsOption;
        }
    }
    else{
        target += settingsOption;
    }
    showSelectedOption(target);
}

async function saveCredentials(){
    console.log("In save credentials");
    var usernameCredentials = document.getElementById("form_block__username_input").value;
    var passwordCredentials = document.getElementById("form_block__password_input").value;
    if(usernameCredentials === "" || passwordCredentials === ""){
        console.log("Invalid credentials!");
    }
    else{
        var credentials = {};
        credentials['username'] = usernameCredentials;
        credentials['password'] = passwordCredentials;
        console.log("Credentials from input: ", credentials);
        await chrome.storage.sync.set( credentials, function (data){
            console.log("Yess");
            if(chrome.runtime.lastError){
                console.error("Error: ", chrome.lastError.message);
            }
            console.log("Data: ", data);
        });
    }
}

async function setApplicationMode(changedTextBox, toChangeTextBox){
    var applicationModes = {};
    applicationModes[changedTextBox] = document.getElementById(changedTextBox).checked;
    applicationModes[toChangeTextBox] = document.getElementById(toChangeTextBox).checked;
    console.log("App modes: ", applicationModes);
    await chrome.storage.sync.set( applicationModes, function (data){
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

function showSelectedOption(target){
    console.log("Target: ", target);
    console.log(typeof target)
    $('#selected-option-container div').hide();
    $(target).show();
}