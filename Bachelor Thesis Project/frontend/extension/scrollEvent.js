let lastKnownScrollPosition = 0;
// let isInitialCall = true; 
// onEntry();


document.addEventListener('scroll',  async function() {
    let currentScrollPosition = window.scrollY;
    if(currentScrollPosition>= lastKnownScrollPosition + 500)
    {
      lastKnownScrollPosition = currentScrollPosition;
      console.log("ON SCROLL!!! ", lastKnownScrollPosition);
      await onEntry();
    }
  });

//   function onEntry(){
//     console.log("Initial Call!", "")
//     if((lastKnownScrollPosition < 500) && (isInitialCall)){
//       isInitialCall  = false;
//       return testFunction(1);
//     }
//   }

//   function testFunction(value){
//     console.log("Test function!", value);
//     return ("Value: ").concat(String(value));
//   }

onEntry();

async function onEntry(){
  let result = await getAllImages();
  let status = await sendImages(result);
  console.log("Status: ", status);
}

async function getAllImages(){

  var imageCollection = document.getElementsByTagName("img");
  console.log("Images: ", imageCollection);
  var images = Array.prototype.slice.call(imageCollection);
  var allImages = [];
  var checkDuplicates = new Map();
  for(var index = 0; index<images.length; index++){
    let invalidURL = false;
    images[index].addEventListener('error', function handleError(){
      console.log("Invalid image URL!");
      invalidURL = true;
    });
    if((images[index].naturalHeight>=50 && images[index].naturalWidth>=50) && 
    (images[index].clientHeight>=50 && images[index].clientWidth>=50) && (!invalidURL)){
      let imageSrc = String(images[index].src);
      let imageAlt = String(images[index].alt);
      if(!imageAlt.replace(/\s/g, '').length){
        imageAlt = imageAlt.replace(/\s/g, '');
        console.log("Alt only contains whitespace (ie. spaces, tabs or line breaks)!");
      }
      let uniqueImage = true;
      if(checkDuplicates.has(imageSrc)){
        let imageMapAlt = checkDuplicates.get(imageSrc);
        if(imageMapAlt === imageAlt){
          uniqueImage = false;
          console.log("Image already exists in map!");
        } 
      }
      if(uniqueImage === true){
        var imageDictionary = {};
        imageDictionary['src'] = imageSrc;
        imageDictionary['alt'] = imageAlt;
        checkDuplicates.set(imageSrc, imageAlt);
        allImages.push(imageDictionary);
      }
    }
    else{
        console.log("The image is too small!");
    }
  }
  console.log("Image map: \n", allImages);
  return allImages;
}

async function sendImages(allImages){ //, tab){
  // console.log("Result: ", result);
  // var allImages = result[0];
  // allImages = allImages['result'];
  console.log("Images: \n", allImages);
  for(let index=0; index<allImages.length; index++){
    console.log("ImageSrc: ", (allImages[index])['src']);
    let imageCaption = await getImageCaption((allImages[index])['src']);
    (allImages[index])['alt'] = ((allImages[index])['alt']).concat((" Image caption: ").concat(imageCaption));
    console.log("Image caption before execute script: ", (allImages[index])['alt']);
    await addAlternativeText(allImages[index]);
    // chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     function: addAlternativeText,
    //     args: [allImages[index]]
    //   });
  }
  console.log("All Images: ", allImages);
}

async function addAlternativeText(image){
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