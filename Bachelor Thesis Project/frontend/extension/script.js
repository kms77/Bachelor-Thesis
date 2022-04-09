var appStatus = document.getElementById("on-off-block--toggle");
var submitButton = document.getElementById("form-block__submit");

if(appStatus){
    appStatus.addEventListener('click', changeAppStatus, false);
}
if(submitButton){
    submitButton.addEventListener('click', sendRequest, false);
}

function changeAppStatus(){
    if($(appStatus).hasClass('inactive')){
        $('#body-container').css("visibility", "visible");
        $(appStatus).removeClass('inactive');
    }
    else{
        $('#body-container').css("visibility", "hidden");
        $(appStatus).addClass('inactive');
    }
}

function sendRequest(){
    var inputValue = $('#form-block__input').val();
     if(inputValue){ 
       var dataObject = { image_URL: inputValue };
       axios({
         method: 'POST',
         url: 'https://hear-me-assistant.herokuapp.com/data',
         //url: 'http://127.0.0.1:5000/data',
         data: dataObject,
         crossDomain: true
       }).then(function(response) {
           let errorMessage = "Could not download image: ";
           console.log(typeof errorMessage);
           response=String(response.data);
           console.log(typeof String(response));
           if(response.indexOf(errorMessage) !== -1){
                alert(response);
           }
           else{
                if(response !== ""){
                    $('textarea#textarea-block__id').val(response);
                }
                else{
                    alert("Error trying to make the action!");
                }
           }
       })
       .catch(function(error){
         alert("Error trying to make the action: " + error + "!");
       });
     }
     else{
       alert("Error: input value is null!");
   
     }
   }