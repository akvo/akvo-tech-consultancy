import os
import pandas as pd
from Akvo import Flow
from time import sleep
import datetime
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

clientId = 'akvo-lumen'
instanceName = 'anu'
lumenInstance = 'https://'+instanceName+'.akvolumen.org'
loginUrl = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/auth?client_id=akvo-lumen&redirect_uri='
username = os.environ['KEYCLOAK_USER']
password = os.environ['KEYCLOAK_PWD']
f = open('log','a')

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 5)

def checkTime(timetype):
    timenow = datetime.datetime.now()
    timeformat = timenow.strftime("%Y-%m-%d %H:%M:%S")
    if timetype == 'time':
        timeformat = timenow.strftime("         %H:%M:%S")
    return timeformat

def getList():
    token = Flow.getToken()
    dashboards = Flow.getData(lumenInstance + '/api/library', token)
    ds = pd.DataFrame(dashboards['datasets'])
    return ds.to_dict('records')

def updateLumen(ids):
    hoverElement = "//li[@data-test-id='" + ids + "']/child::div[2]/"
    updateButton = hoverElement + "child::div[1]/child::ul/child::li[@data-test-id='update-dataset']"
    try:
        driver.find_element_by_xpath(hoverElement + "child::button").click()
        sleep(3)
        driver.find_element_by_xpath(updateButton).click()
        sleep(2)
        f.write(checkTime('time') + ' UPDATE ' + ids + ' SUCCESS\n')
    except:
        f.write(checkTime('time') + ' UPDATE ' + ids + ' FAILED\n')
    return True

# Create log file to email
f.write('\n')
f.write(checkTime('date') + ' STARTING THE JOB\n')

# Get list of all the datasets using api
datasets = getList()

# Login to Instance
driver.get(loginUrl + lumenInstance)
elementPresent = EC.presence_of_element_located((By.ID, "username"))
element = WebDriverWait(driver, 3).until(elementPresent)
element.send_keys(username)
driver.find_element_by_id ('password').send_keys(password)
driver.find_element_by_id('kc-form-login').submit()
sleep(7)

# Update Datasets
for dataset in datasets:
    updateLumen(dataset['id'])
    print(dataset['id'])
    print(dataset['name'])

# Quit Browser
driver.quit()
