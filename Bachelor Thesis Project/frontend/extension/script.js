var appStatus = document.getElementById("on-off-block--toggle");
var submitButton = document.getElementById("form-block__submit");
var settingsButton = document.getElementById("menu-block__settings_button");
var infoButton = document.getElementById("menu-block__info_button");

var lastKnownScrollPosition = 0;


if(appStatus){
    appStatus.addEventListener('click', changeAppStatus, false);
}
if(submitButton){
    submitButton.addEventListener('click', sendRequest, false);
}
if(settingsButton){
  settingsButton.addEventListener('click', goToSettings, false);
}
if(infoButton){
  settingsButton.addEventListener('click', goToInfo, false);
}


window.onload = getPageData();

async function getPageData(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scrollEvent.js']
    // function: getAllImages
  }, (result) => {
    console.log("Result: ", result);
    sendImages(result, tab);
  });
}

async function sendImages(result, tab){
  console.log("Result: ", result);
  var allImages = result[0];
  allImages = allImages['result'];
  console.log("Images: \n", allImages);
  for(let index=0; index<allImages.length; index++){
    console.log("ImageSrc: ", (allImages[index])['src']);
    let imageCaption = await getImageCaption((allImages[index])['src']);
    (allImages[index])['alt'] = ((allImages[index])['alt']).concat((" Image caption: ").concat(imageCaption));
    console.log("Image caption before execute script: ", (allImages[index])['alt']);
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: addAlternativeText,
        args: [allImages[index]]
      });
  }
  console.log("All Images: ", allImages);
}

function addAlternativeText(image){
  const selector  = ('img[src="'.concat(image['src'])).concat('"]');
  console.log("Selector: ", selector);
  var selectedImages = document.querySelectorAll(selector);
  selectedImages.forEach( imageElement => {
    imageElement.setAttribute('alt', image['alt']);
  });
} 

async function getImageCaption(imageSrc){
  var imageCaption = "";
  var dataObject = {
    imageURL: imageSrc
  };
  await axios({
    method: 'POST',
   //  url: 'https://hear-me-assistant.herokuapp.com/data',
    url: 'http://127.0.0.1:5000/images',
    data: dataObject,
    crossDomain: true
  }).then(function(response) {
      response=String(response.data);
      imageCaption = response;
  });
  return imageCaption;
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
           let errorMessage = "";
           response=String(response.data);
           if(response.indexOf(errorMessage) !== -1){
                alert(response);
           }
           else{
                if(response !== ""){
                    $('textarea#textarea-block__id').val(response);
                }
                else{
                    alert("Error trying to make the action!");
                }
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

function goToSettings(){
  var extensionID = chrome.runtime.id;
  var pageURL = ("chrome-extension://").concat(extensionID, "/settings/settings.html");
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}

function goToInfo(){
  var extensionID = chrome.runtime.id;
  var pageURL = ("chrome-extension://").concat(extensionID, "/settings/settings.html");
  try{
    window.open(pageURL, '_blank').focus();
  }
  catch(error){
    console.log("Error: " + error);
  }
}