var checkDuplicates = new Map();

async function getAllImages(){
  var imageCollection = document.getElementsByTagName("img");
  var images = Array.prototype.slice.call(imageCollection);
  var allImages = [];
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
      let auxiliarAlt = imageAlt;
      if(!auxiliarAlt.replace(/\s/g, '').length){
        imageAlt = auxiliarAlt.replace(/\s/g, '');
        console.log("Alt only contains whitespace (ie. spaces, tabs or line breaks)!");
      }
      if(imageAlt === ''){
        let uniqueImage = true;
        if(checkDuplicates.has(imageSrc)){
          let imageMapAlt = checkDuplicates.get(imageSrc);
          uniqueImage = false;
          console.log("Image already exists in map!");
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
        console.log("The image has already an alternative text!");
      }
    }
    else{
        console.log("The image is too small!");
    }
  }
  console.log("Image map: \n", allImages);
  return allImages;
}

async function sendImages(allImages){ 
  for(let index=0; index<allImages.length; index++){
    console.log("ImageSrc: ", (allImages[index])['src']);
    let imageCaption = await getImageCaption((allImages[index])['src']);
    (allImages[index])['alt'] = ((allImages[index])['alt']).concat((" Image caption: ").concat(imageCaption));
    checkDuplicates.set((allImages[index])['src'], (allImages[index])['alt']);
    await addAlternativeText(allImages[index]);
  }
}

async function addAlternativeText(image){
  const selector  = ('img[src="'.concat(image['src'])).concat('"]');
  var selectedImages = document.querySelectorAll(selector);
  selectedImages.forEach( imageElement => {
    imageElement.setAttribute('alt', image['alt']);
  });
} 