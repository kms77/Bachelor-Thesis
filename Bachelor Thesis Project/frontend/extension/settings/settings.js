var saveCredentialsButton = document.getElementById("form-block__save");
if(saveCredentialsButton){
    console.log("Button clicked: ");
    saveCredentialsButton.addEventListener('click', saveCredentials, false);
}

function saveCredentials(){
    console.log("In save credentials");
    var usernameCredentials = document.getElementById("form_block__username_input").value;
    var passwordCredentials = document.getElementById("form_block__password_input").value;
    console.log("Username: ", usernameCredentials);
    console.log("Password: ", passwordCredentials);
    if(usernameCredentials === "" || passwordCredentials === ""){
        console.log("Invalid credentials");
    }
    else{
        console.log("In else");
        chrome.storage.sync.set({'linkedin_username': 'username_example'});
        // chrome.storage.sync.set({'linkedin_username': usernameCredentials, 'linkedin_password': passwordCredentials});
    }
    var example = "";
    chrome.storage.sync.get('linkedin_username', function(response) {
        example =  response;
    });
      console.log("Example: ", example);
}