console.log("Yess");

// function startImageDescriptionMode(){
//   console.log("Image description mode on!");
// }


// // let lastKnownScrollPosition = 0;
// var checkDuplicates = new Map();
// // onEntry();

// async function onEntry(){
//   // document.removeEventListener('scroll', onScroll);
//   let result = await getAllImages();
//   await sendImages(result);
//   // await onScroll();
// }

// // async function onScroll() {
// //   document.addEventListener('scroll', onScroll, true);
// //   let currentScrollPosition = window.scrollY;
// //   if(currentScrollPosition>= lastKnownScrollPosition + 2000)
// //   {
// //     lastKnownScrollPosition = currentScrollPosition;
// //     await onEntry();
// //   }
// // }

// async function getAllImages(){
//   var imageCollection = document.getElementsByTagName("img");
//   var images = Array.prototype.slice.call(imageCollection);
//   var allImages = [];
//   for(var index = 0; index<images.length; index++){
//     let invalidURL = false;
//     images[index].addEventListener('error', function handleError(){
//       console.log("Invalid image URL!");
//       invalidURL = true;
//     });
//     if((images[index].naturalHeight>=50 && images[index].naturalWidth>=50) && 
//     (images[index].clientHeight>=50 && images[index].clientWidth>=50) && (!invalidURL)){
//       let imageSrc = String(images[index].src);
//       let imageAlt = String(images[index].alt);
//       let auxiliarAlt = imageAlt;
//       if(!auxiliarAlt.replace(/\s/g, '').length){
//         imageAlt = auxiliarAlt.replace(/\s/g, '');
//         console.log("Alt only contains whitespace (ie. spaces, tabs or line breaks)!");
//       }
//       let uniqueImage = true;
//       if(checkDuplicates.has(imageSrc)){
//         let imageMapAlt = checkDuplicates.get(imageSrc);
//         if(imageMapAlt === imageAlt){
//           uniqueImage = false;
//           console.log("Image already exists in map!");
//         } 
//       }
//       if(uniqueImage === true){
//         var imageDictionary = {};
//         imageDictionary['src'] = imageSrc;
//         imageDictionary['alt'] = imageAlt;
//         checkDuplicates.set(imageSrc, imageAlt);
//         allImages.push(imageDictionary);
//       }
//     }
//     else{
//         console.log("The image is too small!");
//     }
//   }
//   console.log("Image map: \n", allImages);
//   return allImages;
// }

// async function sendImages(allImages){ 
//   for(let index=0; index<allImages.length; index++){
//     console.log("ImageSrc: ", (allImages[index])['src']);
//     let imageCaption = await getImageCaption((allImages[index])['src']);
//     (allImages[index])['alt'] = ((allImages[index])['alt']).concat((" Image caption: ").concat(imageCaption));
//     checkDuplicates.set((allImages[index])['src'], (allImages[index])['alt']);
//     await addAlternativeText(allImages[index]);
//   }
//   console.log("All Images: ", allImages);
// }

// async function addAlternativeText(image){
//   const selector  = ('img[src="'.concat(image['src'])).concat('"]');
//   var selectedImages = document.querySelectorAll(selector);
//   selectedImages.forEach( imageElement => {
//     imageElement.setAttribute('alt', image['alt']);
//   });
// } 

// async function getImageCaption(imageSrc){
//   var imageCaption = "";
//   var dataObject = {
//     imageURL: imageSrc
//   };
//   await axios({
//     method: 'POST',
//     //  url: 'https://hear-me-assistant.herokuapp.com/data',
//     url: 'http://127.0.0.1:5000/images',
//     data: dataObject,
//     crossDomain: true
//   }).then(function(response) {
//       response=String(response.data);
//       imageCaption = response;
//   });
//   return imageCaption;
// }