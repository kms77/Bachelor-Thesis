var appStatus = document.getElementById("on-off-block--toggle");
var submitButton = document.getElementById("form-block__submit");
var settingsButton = document.getElementById("menu-block__settings_button");
var infoButton = document.getElementById("menu-block__info_button");

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
    function: getAllImages
  }, (result) => {
    sendImages(result, tab);
  });
}

function getAllImages(){
  var images = document.getElementsByTagName("img");
  console.log("Images: ", images);
  var allImages = Array.prototype.slice.call(images);
  allImages[0].removeAttribute("alt");
  allImages[1].alt = "      \n";
  var imageData = new Object();
  for(var index = 0; index<allImages.length; index++){
    imageData['src'] = String(allImages[index].src);
    let imageAlt = String(allImages[index].alt);
    if(!imageAlt.replace(/\s/g, '').length){
      imageAlt = imageAlt.replace(/\s/g, '');
      console.log("Alt only contains whitespace (ie. spaces, tabs or line breaks)");
    }
    imageData['alt'] = imageAlt;
    imageData['code'] = allImages[index].outerHTML;
    allImages[index] = imageData;
    imageData = new Object();
  }
  console.log("All img: ", allImages);
  return allImages;
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

async function sendImages(result, tab){
  var allImages = result[0];
  allImages = allImages['result'];
  console.log("Images: \n", allImages);
  for(var index = 0; index<allImages.length; index++){
    let imageSrc = (allImages[index])['src'];
    let imageAlt = (allImages[index]['alt']);
    console.log("Index: ", index, " | ImageSrc: ", imageSrc);
    let imageCaption = await getImageCaption(imageSrc);
    imageAlt = imageAlt.concat((" Image caption: ").concat(imageCaption));
    console.log("Image caption before execute script: ", imageAlt);
    (allImages[index])['alt'] = imageAlt;
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: addAlternativeText,
        args: [allImages[index]]
      });
  }
  console.log("All Images: ", allImages);
  // console.log("Images Array: ", images);
  //     let imageObject = images[index].src;
  //     console.log("Img src: ", imageObject);
  //     let imageCaptionText = "Image caption: ";
  //     let imageCaption = getImageCaption(imageObject);
  //     imageCaptionText.concat(imageCaption);
  //     imageObject.alt = imageCaptionText;
  //     console.log("Image caption before execute script: ", imageObject);
  //     // chrome.scripting.executeScript({
  //     //   target: { tabId: tab.id },
  //     //   function: addAlternativeText(imageCaptionText),
  //     //   args: [imageSrc, ]
  //     // });
  //   }
  // }
}
function addAlternativeText(image){
  // var div = document.createElement('div');
  // div.innerHTML = image['code'];
  // console.log("Div: ", div, " | Img: ", div.getElementsByTagName('img'));
  // var imageHTML = div.getElementsByTagName('img')[0];
  // imageHTML.alt = image['alt'];
  const selector  = ('img[src="'.concat(image['src'])).concat('"]');
  console.log("Selector: ", selector);
  var selectedImages = document.querySelectorAll(selector);
  selectedImages.forEach( imageElement => {
    imageElement.setAttribute('alt', image['alt']);
  });
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
           // console.log(typeof errorMessage);
           response=String(response.data);
           // console.log(typeof String(response));
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