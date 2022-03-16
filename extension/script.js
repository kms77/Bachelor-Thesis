function sendRequest(){
        let textToSend = document.getElementById("header-text-id");
        console.log("Text to send: ", textToSend);
        axios({
                method: "post",
                url: "https://test-python-heroku-app.herokuapp.com/data/",
                data: {
                  message: textToSend
                }
        });
}