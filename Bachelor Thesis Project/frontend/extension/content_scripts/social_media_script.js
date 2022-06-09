const MIN_VALUE = 0;
const ENGLISH_LANGUAGE = 'en';
var currentSocialMedia = null;
var countDonePosts = 0;
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

function getCurrentSocialMedia(){
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
        currentSocialMedia = index;
    }
    return currentSocialMedia;
}

function sendMessagePromise(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({message}, response => {
            if(response.complete) {
                resolve("Done");
            } else {
                reject('Something wrong');
            }
        });
    });
}

async function analyzePageData(){
    var index = getCurrentSocialMedia();
    var allPosts = document.querySelectorAll(arraySocialMedia[index]["post"]);
    let auxiliarLength = countDonePosts;
    countDonePosts = allPosts.length;
    allPosts = Array.from(allPosts);
    allPosts.splice(MIN_VALUE, auxiliarLength);
    console.log(allPosts);
    for(let postElement of allPosts){
        const textMessage = await getPostDescription(postElement, index);
        if(textMessage === null){
            console.log("Invalid element!");
            return;
        }
        else{
            console.log(textMessage);
            // let language = await chrome.i18n.detectLanguage(textMessage);
            // console.log("Language: ", language);
            const  messageOut = await sendMessagePromise(textMessage);
            chrome.runtime.sendMessage({message: textMessage}, function(response) {
                 console.log("Status: ", messageOut);
              });
        }
    } 
}

function getPostDescription(postElement, index){
    return new Promise(function(resolve){
        let intro = '';
        var postDescription = '';
        let auxiliarValue = '';
        //let postLanguage = ENGLISH_LANGUAGE;
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["author"]);
        if(auxiliarValue !== null){
            let saveAuthor = auxiliarValue; 
            // auxiliarValue = postElement.querySelector(arraySocialMedia[index]["description"]);
            // if(auxiliarValue !== null){
            // let description = (((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '')).trim();
            // postLanguage = await chrome.i18n.detectLanguage(description);
            // console.log("Language: ", postLanguage);
            // intro = getIntroOfElement("description");
            // postDescription = postDescription + intro + description + ". ";
            // }
            let author = ((saveAuthor).textContent).replace(/(\r\n|\r|\n)/g, '').trim();
            intro = getIntroOfElement("author");
            postDescription = postDescription + intro + author + ". ";
        }
        else{
            resolve(null);
        }
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["description"]);
        if(auxiliarValue !== null){
            let description = (((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '')).trim();
            intro = getIntroOfElement("description");
            postDescription = postDescription + intro + description + ". ";
        }
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["image"]);
        if(auxiliarValue !=null){
            let imageSrc = auxiliarValue.getAttribute('src');
            let imageCaption = "Image"; //await getImageCaption(imageSrc);
            intro = getIntroOfElement("image");
            postDescription = postDescription + intro + imageCaption + ". ";
        }
        resolve(postDescription);
    });
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function  getIntroOfElement(element){
    let intro = '';
    let index = 0;
    let MAX_VALUE = 0;
    MAX_VALUE = (dictionaryOfIntros[element]).length;
    index = getRandomInteger(MIN_VALUE, MAX_VALUE);
    intro = dictionaryOfIntros[element][index];
    return intro;
}