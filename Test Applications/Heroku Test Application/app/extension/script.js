//import axios from './node_modules/axios/index'
//import axios from 'axios';
var element = document.getElementById("submit-button-id");
if(element){
  element.addEventListener('click', sendRequest, false);
}
// function sendRequest(){
// manifest file
// "background":{
//   "service-worker": ["./node_modules/jquery/dist/jquery.min.js", "./node_modules/axios/dist/axios.min.js"]
// },
//   var dataObj = {message:"test"};
//   var json = JSON.stringify(dataObj);
//   $.ajax({
//            url: "https://test-python-heroku-app.herokuapp.com/data",
//           url: "http://127.0.0.1:5000/data",
//           data: json,
//           type: "POST",
//           contentType: 'application/json',
//           crossDomain:true,
//           success: function(data) {
//             console.log("Data: ", data);
//             $('#header-text-id').html(data);
//           },
//           error: function(err) {
//             $('#header-text-id').html("Error trying to make the action");
//           }
//   });
// }

function sendRequest(){
 var inputValue = $('#imageURL-input-id').val();
  if(inputValue){ 
    var dataObj = { image_URL: inputValue };
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/data',
      data: dataObj,
      crossDomain: true
    }).then(function(response) {
        if(response !== "") {
            $('textarea#response-textarea-id').val(String(response.data));
        }
        else{
            $('textarea#response-textarea-id').val("The request method is not valid")
        }
    })
    .catch(function(error){
      alert("Error trying to make the action");
    });
  }
  else{
    alert("Error: input value is null");

  }
}