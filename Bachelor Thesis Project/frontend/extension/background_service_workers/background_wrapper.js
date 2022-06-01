// import all background scripts of the extension
try{
    importScripts("background_script.js", "social_media_background.js");
}
catch (error) {
    console.error(error);
}