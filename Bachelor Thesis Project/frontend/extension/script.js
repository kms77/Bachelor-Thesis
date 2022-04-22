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
    sendImages(result);
    //getImageCaption(result)
  });
}

function getAllImages(){
  var images = document.getElementsByTagName("img");
  console.log("Images: ", images);
  var allImages = Array.prototype.slice.call(images);
  let image = allImages[0];
  // allImages[0] = "<img src=\"http://www.cs.ubbcluj.ro/wp-content/themes/CSUBB/images/social-profiles/youtube.png\" alt=\"Youtube\" title=\"Youtube\">";
  allImages[0] = "<img src=\"http://www.cs.ubbcluj.ro/wp-content/themes/CSUBB/images/social-profiles/youtube.png\" title=\"Youtube\">";
  for(var index = 1; index<allImages.length; index++){
    let image = allImages[index];
    allImages[index] = image.outerHTML;
  }
  // var allImages = [];
  // for(var index = 0; index<images.length; index++){
  //   allImages.push(images[index].src);
  //   // if(index < 5){
  //   //   let imageCaption = getImageCaption(images[index].src);
  //   //   console.log("Image caption: ", imageCaption);
  //   // }
  // }
    // console.log("ALT: ", images[index].alt);
    // if(images[index].alt === ""){
    //   // allImages.push(images[index].src);
    //   // console.log("Added!");
    // }
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

async function sendImages(result){
  console.log("Result: ", result);
  var images = result[0];
  images = images['result'];
  console.log("Result2: \n", images);
  var imageCaptionText = "";
  for(var index = 0; index<5; index++){
    let imageSrc = (images[index].split('src="').pop()).split('"')[0];
    console.log("Index: ", index, " | ImageSrc: ", imageSrc);
    let imageCaption = await getImageCaption(imageSrc);
    imageCaptionText = (" Image caption: ").concat(imageCaption);
    console.log("Image caption before execute script: ", imageCaptionText);
  }
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


// function addAlternativeText(imageCaptionText){

// }



// function sendImages(result){
//   var allImages = result[0]
//   allImages = allImages['result']
//   console.log("Result: \n", allImages)
//   var dataObject = {
//     images: allImages
//   };
//   axios({
//     method: 'POST',
//    //  url: 'https://hear-me-assistant.herokuapp.com/data',
//     url: 'http://127.0.0.1:5000/images',
//     data: dataObject,
//     crossDomain: true
//   }).then(function(response) {
//       response=String(response.data);
//       console.log(typeof String(response));
//       console.log(response);
//   });
// }

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
    // var inputValue = $('#form-block__input').val();
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