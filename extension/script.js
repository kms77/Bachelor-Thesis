//
// import express from "./node_modules/express/lib/express";
// var app = express();
document.getElementById("request-button-id").addEventListener("click", sendRequest);
// let defaultSrc = "default-src 'none'";
// let formAction = "form-action 'self'";
// let frameAncestors = "frame-ancestors 'none'";
// let styleSrc = "style-src";
// styleSrc += " 'self'";
// styleSrc += " https://fonts.googleapis.com/";
// let imgSrc = "img-src";
// imgSrc += " 'self'";
// imgSrc += " data:";
// let fontSrc = "font-src";
// fontSrc += " https://fonts.gstatic.com/";
// let scriptSrc = "script-src";
// scriptSrc += " 'self'";
// let connectSrc = "connect-src";
// connectSrc += " https://test-python-heroku-app.herokuapp/data/";
// const csp = [
//   defaultSrc,
//   formAction,
//   frameAncestors,
//   styleSrc,
//   imgSrc,
//   fontSrc,
//   scriptSrc,
//   connectSrc
// ].join("; ");

// app.use(
//   express.static("public", {
//     setHeaders: function (res, path) {
//       res.set("Content-Security-Policy", csp);
//     }
//   })
// );
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
        $.ajaxSetup({
          crossDomain: true
        });
        $.post("https://test-python-heroku-app.herokuapp.com/data/",
                {
                   message: "test12"
                 }
        );
}