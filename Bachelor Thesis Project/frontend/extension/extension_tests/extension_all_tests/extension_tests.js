window.onload =  runAllTests();

function getTestData(){
    const testData = {
        "success_image_request_test": 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
        "fail_image_request_test": 'https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e',
        "more_requests_first": 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Ingersoll_Museum_School_inside.jpg',
        "more_requests_second": 'https://upload.wikimedia.org/wikipedia/commons/1/10/Edifice_Wilder_24.jpg',
        "more_requests_third": 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/100_most_translated_concepts_using_lexemes_in_Wikidata.svg/640px-100_most_translated_concepts_using_lexemes_in_Wikidata.svg.png'
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
  let testData = getTestData();
  QUnit.test('Fail Image Process', async function(assert) {
      let imageCaption = await getImageCaption(testData['fail_image_request_test']);
      assert.equal(imageCaption, "");
    });
}

function testMultipleRequest(){
  // working on it
  let testData = getTestData(); 
  QUnit.test('Multiple Images Requests', async function(assert) {
      let firstImage = await getImageCaption(testData['more_requests_first']);
      let secondImage = await getImageCaption(testData['more_requests_second']);
      let thirdImage = await getImageCaption(testData['more_requests_third']);
      let fourthImage = await getImageCaption(testData['fail_image_request_test']);
      assert.equal(firstImage, "the interior of the school.");
      assert.equal(secondImage, "the building is being constructed.");
      assert.equal(thirdImage, "a diagram of the world's most popular tags.");
      assert.equal(fourthImage, "");
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