var appStatus = document.getElementById("on-off-block--toggle");
var submitButton = document.getElementById("form-block__submit");
var settingsButton = document.getElementById("menu-block__settings_button");
var infoButton = document.getElementById("menu-block__info_button");

var lastKnownScrollPosition = 0;

if(appStatus){
    appStatus.addEventListener('click', changeAppStatus, false);
}

// if(submitButton){
//     submitButton.addEventListener('click', //sendRequest, false);
// }

if(settingsButton){
  settingsButton.addEventListener('click', function(){
    goToOptions("settings-section")
  }, false);
}

if(infoButton){
  console.log("Info button clicked!");
  infoButton.addEventListener('click', function(){
    goToOptions("info-section")
  }, false);
}

window.onload = getApplicationMode();

async function getPageData(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js", "scrollEvent.js"]
  });
}

async function getApplicationMode(){
  var applicationMode = await chrome.storage.sync.get(null);
  if(applicationMode){
    let imageDescriptionMode = applicationMode['image-description-mode'];
    let linkedInFeedMode = applicationMode['linkedIn-feed-mode'];
    if((imageDescriptionMode && !linkedInFeedMode) || (!imageDescriptionMode && linkedInFeedMode)){
      if(imageDescriptionMode){
        getPageData();
      }
      else{
        sendRequest();
      }
    }
    else{
      console.log("Error: incorrect application mode configuration!");
    }
  }
  console.log("appMode: ", applicationMode);
}

function changeAppStatus(){
    if($(appStatus).hasClass('inactive')){
        $('#body-container').css("visibility", "visible");
        $(appStatus).removeClass('inactive');
    }
    else{
        $('#body-container').css("visibility", "hidden");
        $(appStatus).addClass('inactive');
    }
}

async function sendRequest(){
    // get(null) - to get all values
    var currentCredentials = await chrome.storage.sync.get(null);
    console.log("Credentials: ", currentCredentials);
    if(currentCredentials){ 
       var dataObject = { 
              username: currentCredentials['username'],
              password: currentCredentials['password']
          };
       axios({
         method: 'POST',
        //  url: 'https://hear-me-assistant.herokuapp.com/data',
         url: 'http://127.0.0.1:5000/data',
         data: dataObject,
         crossDomain: true
       }).then(function(response) {
          ///let errorMessage = "";
          response=String(response.data);
          //  if(response.indexOf(errorMessage) !== -1){
          //       alert(response);
          //  }
          //  else{
          if(response !== ""){
              $('textarea#textarea-block__id').val(response);
          }
          else{
              alert("Error trying to make the action!");
          }
       })
       .catch(function(error){
         alert("Error trying to make the action: " + error + "!");
       });
     }
     else{
       alert("Error: input value is null!");
   
    }
}

function goToOptions(option){
  var extensionID = chrome.runtime.id;
  var pageURL = "chrome-extension://" + extensionID + "/options/options.html" + "?option=" + option;
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}