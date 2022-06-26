const MIN_VALUE_OF_INDEX = 0;
const ENGLISH_LANGUAGE = 'en';
const LANGUAGE_CODE = 'language_code';
var currentSocialMedia = null;
var countDonePosts = 0;
var checkDuplicates = new Map();

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
        if (window.location.href.indexOf(arraySocialMedia[index]['URL']) > -1){
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

async function getLanguageCode(message){
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
    return languageObject;
}

async function sendMessagePromise(message) {
    let languageCode = await getLanguageCode(message);
    let language = languageCode[LANGUAGE_CODE];
    console.log("Language: ", language);
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({message, language}, response => {
            if(response.complete) {
                resolve("Done");
            } 
            else {
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
        let imageAlt = '';
        let arrayOfIntros = [];
        let currentPostLanguage = ENGLISH_LANGUAGE;
        var author;
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["image"]);
        if(auxiliarValue !=null){
            imageSrc = auxiliarValue.getAttribute('src');
            //imageAlt = auxiliarValue.getAttribute('alt');
            console.log("Image src: ", imageSrc);
            if(checkDuplicates.has(imageSrc)){
                resolve(null);
            }
            else{
                checkDuplicates.set(imageSrc, null);
                console.log("Check array: ", checkDuplicates);
            }
        }
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["author"]);
        if(auxiliarValue !== null){
            let saveAuthor = auxiliarValue;
            author = ((saveAuthor).textContent).replace(/(\r\n|\r|\n)/g, '').trim();
            if(author === null){
                resolve(null);
            }
        }
        else{
            resolve(null);
        }
        auxiliarValue = postElement.querySelector(arraySocialMedia[index]["description"]);
        if(auxiliarValue !== null){
            let description = (((auxiliarValue).textContent).replace(/(\r\n|\r|\n)/g, '')).trim();
            let languageCode = await getLanguageCode(description);
            code = languageCode[LANGUAGE_CODE];
            currentPostLanguage = code.substring(0, 2);
            arrayOfIntros = languageCode["author"];
            intro = getIntroOfElement(arrayOfIntros);
            postDescription = postDescription + intro + author + ". ";
            arrayOfIntros = languageCode["description"];
            intro = getIntroOfElement(arrayOfIntros);
            postDescription = postDescription + intro + description + ". ";
        }
        else{
            let languageCode = languagesJSON[currentPostLanguage];
            arrayOfIntros = languageCode["author"];
            intro = getIntroOfElement(arrayOfIntros);
            postDescription = postDescription + intro + author + ". ";
        }
        if(imageSrc !== ''){
            // if(imageAlt === ''){
                imageAlt = await getImageCaption(imageSrc);
            // }
            if(imageAlt !== ''){
                let languageCode = languagesJSON[currentPostLanguage];
                arrayOfIntros = languageCode["image"];
                intro = getIntroOfElement(arrayOfIntros);
                postDescription = postDescription + intro + imageAlt;
            }
        }
        resolve(postDescription);
    });
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function  getIntroOfElement(arrayOfIntros){
    let intro = '';
    let index = 0;
    let MAX_VALUE = 0;
    MAX_VALUE = arrayOfIntros.length;
    index = getRandomInteger(MIN_VALUE_OF_INDEX, MAX_VALUE);
    intro = arrayOfIntros[index];
    return intro;
}