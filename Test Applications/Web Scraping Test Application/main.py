import time
import random
from bs4 import BeautifulSoup
import urllib3
from selenium import webdriver
from selenium.webdriver.common.by import By

username = 'komsaatti@yahoo.com'
password = 'X2x^xd-ecX_v-p/'
browserDriver = webdriver.Chrome('chromedriver100.exe')
browserDriver.get('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')

# Get username spot and fill it
authenticationID = browserDriver.find_element(By.ID, 'username')
authenticationID.send_keys(username)
# Get password spot and fill it
authenticationID = browserDriver.find_element(By.ID, 'password')
authenticationID.send_keys(password)
# Connect to the account
authenticationID.submit()

numberOfScrolls = 30
for i in range(1, numberOfScrolls):
    browserDriver.execute_script("window.scrollTo(1,50000)")
    time.sleep(5)
http = urllib3.PoolManager()

pageSource = browserDriver.page_source
soup = BeautifulSoup(pageSource, 'html.parser')

profileIntros = [
    'The author of the post is: ',
    'The post was written by: ',
    'Profile name: ',
    ' wrote: ',
    ' posted the following: ',
    ' said: '
]
descriptionIntros = [
    'Post description: ',
    'Description: ',
    'The description of the post: '
]
imageIntros = [
    'In the picture we have: ',
    'The image can be described as: ',
    'The image depicts: ',
    'The image shows: ',
    'In the image used by the author we can see: ',
    'The image description: '
]

for links in soup.find_all('div', {'class': 'feed-shared-update-v2'}):
    profileName = (links.find('span', {'class': 'feed-shared-actor__name'}).getText()).replace("\n", "")
    postDescription = (links.find('div', {'class': 'feed-shared-text'}).getText()).replace("\n", "")
    maxBound = len(profileIntros) - 1
    allPostDescription = profileName
    randomIndex = random.randint(0, maxBound)
    if (allPostDescription != '') and (randomIndex + 1 > (len(profileIntros) / 2)):
        allPostDescription = allPostDescription + profileIntros[randomIndex] + postDescription + ". "
    else:
        valueToDivide = maxBound / 2
        randomIndex %= valueToDivide  # if randomIndex + 1 > (len(profileIntros) / 2) and allPostDescription == ''
        allPostDescription = profileIntros[int(randomIndex)] + profileName + ". "
        if allPostDescription != '':
            randomIndex = random.randint(0, int(maxBound / 2))
            allPostDescription = allPostDescription + descriptionIntros[randomIndex] + postDescription + " ."
    try:
        imageURL = (links.find('img', {'class': 'feed-shared-image__image'}).get('src')).replace("\n", "")
        randomIndex = random.randint(0, maxBound)
        allPostDescription = allPostDescription + imageIntros[randomIndex] + imageURL
    except:
        pass
        # print("No image")
    print(allPostDescription)
# browserDriver.close()
