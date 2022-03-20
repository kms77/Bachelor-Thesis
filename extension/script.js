import axios from '../node_modules/axios/dist/axios'

document.getElementById("request-button-id").addEventListener("click", sendRequest);
// function sendRequest(){
         //let textToSend = document.getElementById("header-text-id");
         //console.log("Text to send: ", textToSend);
//         axios({
//                 method: "post",
//                 url: "https://test-python-heroku-app.herokuapp.com/data/",
//                 data: {
//                   message: "test"
//                 }
//         });
// }

function sendRequest(){
        $.ajax({
                url: "https://test-python-heroku-app.herokuapp/data/",
                data: {
                   message: "test"
                 },
                type: "POST",
                dataType: "json"

        });
}