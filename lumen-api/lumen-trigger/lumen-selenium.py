import os
from time import sleep
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


loginUrl = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/auth'
clientId = 'akvo-lumen'
instanceName = 'xxx'
lumenInstance = 'https://'+instanceName+'.akvolumen.org'
datasetId = [
        '5cad70ee-a0ca-40b1-b907-e396b51769ff',
]

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 5)

driver.get(loginUrl + '?client_id=' + clientId + '&redirect_uri=' + lumenInstance)
elementPresent = EC.presence_of_element_located((By.ID, "username"))
element = WebDriverWait(driver, 3).until(elementPresent)
element.send_keys(os.environ['KEYCLOAK_USER'])
driver.find_element_by_id ('password').send_keys(os.environ['KEYCLOAK_PWD'])
driver.find_element_by_id('kc-form-login').submit()
sleep(2)

def updateLumen(ids):
    hoverElement = "//li[@data-test-id='" + ids + "']/child::div[2]/"
    driver.find_element_by_xpath(hoverElement + "child::button").click()
    sleep(2)
    updateButton = hoverElement + "child::div[1]/child::ul/child::li[@data-test-id='update-dataset']"
    driver.find_element_by_xpath(updateButton).click()
    print(ids + "done")
    sleep(2)
    return "mantap"

for id in datasetId:
    updateLumen(id)

driver.quit()
