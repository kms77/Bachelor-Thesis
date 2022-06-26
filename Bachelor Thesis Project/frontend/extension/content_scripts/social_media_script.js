const MIN_VALUE_OF_INDEX = 0;
const ENGLISH_LANGUAGE = 'en';
const LANGUAGE_CODE = 'language_code';
var currentSocialMedia = null;
var countDonePosts = 0;
var checkDuplicates = new Map();
var dictionaryOfIntros = {
    "author": ['The author of the post is: ', 'The post was written by: ', 'Profile name: '],
    "description": ['Post description: ', 'Description: ', 'The description of the post: ', 'The author of the post said: ', 'The author wrote the following: ', 'The author posted the following: '],
    "image": ['In the picture we have: ', 'The image can be described as: ', 'The image depicts: ', 'The image shows: ', 'In the image used by the author we can see: ', 'The image description: ']
}

var arraySocialMedia = [
    {
        "URL": "www.linkedin.com/feed/",
        "post": "div.feed-shared-update-v2",
        "author": "span.feed-shared-actor__name",
        "description": "div.feed-shared-text",
        "image": "img.feed-shared-image__image"
    },
    {
        "URL": "www.instagram.com/",
        "post": "article._ab6k",
        "author": "a._acat",
        "description": "div._aat7 div div",
        "image": "img._aagt"
    },
    {
        "URL": "www.facebook.com/",
        "post": "[aria-posinset]",
        "author": "span.nc684nl6 strong span, strong span.nc684nl6 span, span.nc684nl6 a span",
        "description": "[data-ad-preview]",
        "image": "div.l9j0dhe7 img.bixrwtb6"
    }
]

async function getCurrentSocialMedia(){
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

async function getLanguageToSpeech(message){
    let languagesMap = await chrome.i18n.detectLanguage(message);
    let currentLanguage = ENGLISH_LANGUAGE;
    let languageObject = ''
    if(languagesMap['isReliable'])
    {
        let languagesArray = languagesMap['languages'];
        currentLanguage = languagesArray[0]['language'];
        if(languagesJSON === ''){
            await getLanguagesJSON();
        }
        if(languagesJSON.hasOwnProperty(currentLanguage)){
            languageObject = languagesJSON[currentLanguage];
        }
        else{
            languageObject = languagesJSON[ENGLISH_LANGUAGE];
        }
    }
    else{
        languageObject = languagesJSON[ENGLISH_LANGUAGE];
    }
    let language = languageObject[LANGUAGE_CODE];
    return language;
}

async function sendMessagePromise(message) {
    let language = await getLanguageToSpeech(message);
    console.log("Language: ", language);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({message, language}, response => {
            if(response.complete) {
                resolve("Done");
            } else {
                reject('Something wrong');
            }
        });
    });
}

async function analyzePageData(){
    var index = await getCurrentSocialMedia();
    if(currentSocialMedia !== null){
        console.log("currentSocialMedia: ", currentSocialMedia, " | Index: ", index);
        var allPosts = document.querySelectorAll(arraySocialMedia[index]["post"]);
        let auxiliarLength = countDonePosts;
        console.log("auxiliarLength: ", auxiliarLength);
        countDonePosts = allPosts.length;
        console.log("countDonePosts: ", countDonePosts);
        allPosts = Array.from(allPosts);
        if( index === 0 || index == 2){
            allPosts.splice(MIN_VALUE_OF_INDEX, auxiliarLength);
        }
        console.log(allPosts);
        for(let postElement of allPosts){
            const textMessage = await getPostDescription(postElement, index);
            if(textMessage === null){
                console.log("Invalid element!");
                continue;
            }
            else{
                console.log(textMessage);
                const outputMessage = await sendMessagePromise(textMessage);
            }
        }
    }
}

function getPostDescription(postElement, index){
    return new Promise(async function(resolve){
        let intro = '';
        var postDescription = '';
        let auxiliarValue = '';
        let imageSrc = '';
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["image"]);
        if(auxiliarValue !=null){
            imageSrc = auxiliarValue.getAttribute('src');
            console.log("Image src: ", imageSrc);
            if(checkDuplicates.has(imageSrc)){
                resolve(null);
            }
            else{
                checkDuplicates.set(imageSrc, null);
                console.log("Check array: ", checkDuplicates);
            }
        }
        //let postLanguage = ENGLISH_LANGUAGE;
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["author"]);
        console.log("Author: ", auxiliarValue);
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
            if(author === null){
                resolve(null);
            }
            else{
                intro = getIntroOfElement("author");
                postDescription = postDescription + intro + author + ". ";
            }
        }
        else{
            resolve(null);
        }
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["description"]);
        console.log("auxDescription: ", auxiliarValue);
        if(auxiliarValue !== null){
            let description = (((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '')).trim();
            console.log("Description: ", description);

            intro = getIntroOfElement("description");
            postDescription = postDescription + intro + description + ". ";
        }
        if(imageSrc !== ''){
            let imageCaption = await getImageCaption(imageSrc);
            if(imageCaption !== ""){
                intro = getIntroOfElement("image");
                postDescription = postDescription + intro + imageCaption;
            }
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
    index = getRandomInteger(MIN_VALUE_OF_INDEX, MAX_VALUE);
    intro = dictionaryOfIntros[element][index];
    return intro;
}