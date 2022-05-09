var lastKnownScrollPosition = 0;
const MIN_VALUE = 0;
var checkDuplicatesPosts = new Map();
var dictionaryOfIntros = {
    "author": ['The author of the post is: ', 'The post was written by: ', 'Profile name: '],
    "description": ['Post description: ', 'Description: ', 'The description of the post: ', 'The author of the post said: ', 'The author wrote the following: ', 'The author posted the following: '],
    "image": ['In the picture we have: ', 'The image can be described as: ', 'The image depicts: ', 'The image shows: ', 'In the image used by the author we can see: ', 'The image description: ']
}

var arraySocialMedia = [
    {
        "URL": "www.linkedin.com/feed/",
        "post": "div.feed-shared-update-v2",
        "key": "h2.visually-hidden",
        "author": "span.feed-shared-actor__name",
        "description": "div.feed-shared-text",
        "image": "img.feed-shared-image__image"
    }
]

document.addEventListener('scroll', async function (){
  let currentScrollPosition = window.scrollY;
  if(currentScrollPosition>= lastKnownScrollPosition + 2000)
  {
    lastKnownScrollPosition = currentScrollPosition;
    await analyzePageData();
  }
}, true);

$(document).ready(async function() {
    let isValid = false;
    let index = 0;
    for(index= 0; index < arraySocialMedia.length; index++){
        if (window.location.href.indexOf(arraySocialMedia[index]['URL']) > -1) {
            isValid = true;
            break;
        }
    }
    if(isValid){
        console.log("Index: ", index);
        await analyzePageData(index);
    }
  });

async function analyzePageData(index){
    var allPosts = document.querySelectorAll(arraySocialMedia[index]['post']);
    allPosts.forEach( async postElement => {
        let key = ((postElement.querySelector(arraySocialMedia[index]['key'])).textContent).replace(/(\r\n|\r|\n)/g, '').trim();
        console.log(key);
        if(checkDuplicatesPosts.has(key)){
            console.log("Already added ro dictionary!")
        }
        else{
            var value = await getPostDescription(postElement, index);
            if(value === null){
                console.log("Invalid element!");
                return;
            }
            else{
                checkDuplicatesPosts.set(key, value);
                console.log("Added to dictionary!");
            }
        }
    });
    console.log("All posts: ", allPosts);
    console.log("Checkduplicates: ", checkDuplicatesPosts);
}

async function getPostDescription(postElement, index){
    let intro = '';
    let postDesciption = '';
    let auxiliarValue = '';
    auxiliarValue = postElement.querySelector(arraySocialMedia[index]['autor']);
    if(auxiliarValue !== null){ 
        let author = ((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '').trim();
        intro = getIntroOfElement("author");
        postDesciption = postDesciption + intro + author + ". ";
    }
    else{
        return null;
    }
    auxiliarValue = postElement.querySelector(arraySocialMedia[index]['description']);
    if(auxiliarValue !== null){
        let description = (((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '')).trim();
        intro = getIntroOfElement("description");
        postDesciption = postDesciption + intro + description + ". ";
    }
    auxiliarValue = postElement.querySelector(arraySocialMedia[index]['image']);
    if(auxiliarValue !=null){
        let imageSrc = auxiliarValue.getAttribute('src');
        let imageCaption =  await getImageCaption(imageSrc);
        intro = await getIntroOfElement("image");
        postDesciption = postDesciption + intro + imageCaption + ". ";
    }
    return postDesciption;
}

function getRandomdInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function  getIntroOfElement(element){
    let intro = '';
    let index = 0;
    let MAX_VALUE = 0;
    MAX_VALUE = (dictionaryOfIntros[element]).length;
    index = getRandomdInteger(MIN_VALUE, MAX_VALUE);
    intro = dictionaryOfIntros[element][index];
    return intro;
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
    }).then( function(response) {
        response=String(response.data);
        imageCaption = response;
    });
    return imageCaption;
  }