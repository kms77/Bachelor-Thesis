// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // console.log("Status: Start talking!");
//     // console.log("Sender: ", sender);
//     // console.log("Our message: ", request.message);
//     // chrome.tts.speak(request.message, 
//     //     { rate: 0.8, onEvent: function() {}}, function() {});


//     // return new Promise(function (resolve){
//     //     // chrome.tts.speak(request.message, 
//     //     //     { rate: 0.8, onEvent: function() {}}, function() {});
        
//     //     chrome.tts.speak(request.message);
//     //     //sendResponse("Done talking!");
//     //     //,{ rate: 0.8, onEvent: function() {}}, function() {})
//     //     resolve("Done!");
//     // });



//     // return Promise.resolve({
//     //     response:"aaaa"
//     // }).then(function(){
//     //     const myTimeout = setTimeout(chrome.tts.speak(request.message), 2000);
//     //     sendResponse("Hate my life");
//         // chrome.tts.speak(request.message);
//     })

//     // return new Promise(async function(resolve){
//     //     // chrome.tts.speak(request.message);
//     //     // resolve(sendResponse("Done talking!"));
//     //     // resolve(sendResponse("Done talking!"));
//     //     // sendResponse(resolve("Done talking!"));
//     //     await waitForTTS(request.message);
//     //     resolve("Please work");
    
        
//     //   });
  
// });

function waitForTTS(message){
    return new Promise((resolve) => {
        console.log("Message2", message);
        chrome.tts.speak(message, {'enqueue': true});
        resolve("Done");
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log("Message1: ", request.message);
    waitForTTS(request.message).then(() => {
        // telling that CS has finished its job
        sendResponse({complete: true});
      });
  
      // return true from the event listener to indicate you wish to send a response asynchronously
      // (this will keep the message channel open to the other end until sendResponse is called).
      return true;
    // console.log("Before awaitttttttttt");
    // const tts = await waitForTTS(request.message);
    // // if(tts === "Done"){
    // console.log("AAAAAAAAAAAAAAA");
    // sendResponse("pls work");
    // console.log("BBBBBBBBBBBBBBBBBBB");
    // }

    // return true;
    // return new Promise((resolve) => {
    //     // chrome.tts.speak(message);
    //     // resolve("Done");
    // });
});