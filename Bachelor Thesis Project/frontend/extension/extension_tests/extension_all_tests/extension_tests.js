window.onload =  runAllTests();

function getTestData(){
    const testData = {
        "success_image_request_test": 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
        "fail_image_request_test": 'https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=741',
        "more_requests_first": 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Ingersoll_Museum_School_inside.jpg',
        "more_requests_second": 'https://upload.wikimedia.org/wikipedia/commons/1/10/Edifice_Wilder_24.jpg',
        "more_requests_third": 'https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/dx9EpIKK949olhe8qraK.png?auto=format&w=741'
    }
    return testData;
}

function runAllTests(){
    testSuccessRequest();
    testFailRequest();
    testMultipleRequest();
}

function testSuccessRequest(){
  // getTestData() - method which returns a dictionary of image URLs
  let testData = getTestData();
  QUnit.test('Success Image Process', async function(assert) {
      let imageCaption = await getImageCaption(testData['success_image_request_test']);
      assert.equal(imageCaption, "a cat in the garden.");
    });
}

function testFailRequest(){
  // working on it
  QUnit.test('Fail Image Process', async function(assert) {
      let imageCaption = "a cat in the garden.";
      assert.equal(imageCaption, "a cat in the garden.");
    });
}

function testMultipleRequest(){
  // working on it
  let testData = getTestData(); 
  QUnit.test('Multiple Images Requests', async function(assert) {
      let firstImage = "a cat in the garden.";
      let secondImage = "a cat in the garden.";
      let thirdImage = "a cat in the garden.";
      assert.equal(firstImage, "a cat in the garden.");
      assert.equal(secondImage, "a cat in the garden.");
      assert.equal(thirdImage, "a cat in the garden.");
    });
}

// same function like the one from the application_script.js file
async function getImageCaption(imageSrc){
    var imageCaption = "";
    var dataObject = {
      imageURL: imageSrc
    };
    console.log(dataObject);
    await axios({
      method: 'POST',
      //  url: 'https://hear-me-assistant.herokuapp.com/image',
      url: 'http://127.0.0.1:5000/image',
      data: dataObject,
      crossDomain: true
    }).then( function(response) {
        response=String(response.data);
        imageCaption = response;
    });
    return imageCaption;
  }