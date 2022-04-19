var saveCredentialsButton = document.getElementById("form-block__save");
if(saveCredentialsButton){
    console.log("Button clicked: ");
    saveCredentialsButton.addEventListener('click', saveCredentials, false);
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
        await chrome.storage.sync.set( credentials, function (){
            if(chrome.runtime.lastError){
                console.error("Error: ", chrome.lastError.message);
            }
        });

        // get(null) - to get all values
        // var currentCredentials = await chrome.storage.sync.get(null, function(){
        //     if(chrome.runtime.lastError){
        //         console.error("Error: ", chrome.lastError.message);
        //     }
        // });
        // console.log("Credentials: ", currentCredentials);
    }
}