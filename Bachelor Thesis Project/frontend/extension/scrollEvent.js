
document.addEventListener('scroll',  async function(e) {
    lastKnownScrollPosition = window.scrollY;
    console.log("ON SCROLL!!! ", lastKnownScrollPosition);
    await getAllImages();
  });

getAllImages();

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
