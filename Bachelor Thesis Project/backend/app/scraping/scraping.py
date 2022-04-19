import os
import time
import random
from bs4 import BeautifulSoup
import urllib
from captioning.captioning import Captioning
from selenium import webdriver
from selenium.webdriver.common.by import By

class Scraping():
    def scraping_data(self, usernameCredential, passwordCredential):
        username = usernameCredential
        password = passwordCredential
        browserDriver = webdriver.Chrome('../utils/chrome_drivers/chromedriver100.exe')
        browserDriver.get('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')

        # Get username spot and fill it
        authenticationID = browserDriver.find_element(By.ID, 'username')
        authenticationID.send_keys(username)
        # Get password spot and fill it
        authenticationID = browserDriver.find_element(By.ID, 'password')
        authenticationID.send_keys(password)
        # Connect to the account
        authenticationID.submit()
        numberOfScrolls = 10
        for i in range(1, numberOfScrolls):
            browserDriver.execute_script("window.scrollTo(1,50000)")
            time.sleep(5)
        # http = urllib3.PoolManager()
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

        scraping_output = ''
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
                    try:
                        urllib.request.urlretrieve(imageURL, "./utils/image/image.jpg")
                        imageCaption = Captioning().get_image_caption()
                        os.remove("./utils/image/image.jpg")
                        randomIndex = random.randint(0, maxBound)
                        allPostDescription = allPostDescription + imageIntros[randomIndex] + imageCaption
                    except urllib.error.URLError as error:
                        # error_message = error.read().decode("utf8", "ignore")
                        pass
                except:
                    pass
                # print("No image")
            scraping_output += allPostDescription
        return scraping_output
        # browserDriver.close()
