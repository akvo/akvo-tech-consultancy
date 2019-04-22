import time
import os
import pandas as pd
import urllib
from datetime import datetime
from Akvo import Flow
from FlowHandler import FlowHandler
from twilio.rest import Client
from flask import Flask, request, Response

app = Flask(__name__)
instanceURI = 'angkorsalad'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
start_time = time.time()
date_format = '%Y-%m-%dT%H:%M:%SZ'
TWILLIO_SID = os.environ['TWILLIO_SID']
TWILLIO_TOKEN = os.environ['TWILLIO_TOKEN']

def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent

def getUpdatedData():
    apiData = Flow.getResponse(requestURI + '/surveys/225170023')
    forms = apiData.get('forms')
    questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
    details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
    allResponses = {}
    for form in forms:
        questionGroups = questions(form['questionGroups'])
        metas = pd.DataFrame(questionGroups)
        formURI = form['formInstancesUrl']
        allGroups = {}
        for index, questionGroup in enumerate(questionGroups):
            dataPoints = []
            groupID = questionGroup['id']
            metadata = metas['questions'][index]
            print(checkTime(time.time()) + ' +++ ' + questionGroup['name'].upper() + ' +++')
            def getAll(url,page_count):
                data = Flow.getResponse(url)
                formInstances = data.get('formInstances')
                for dataPoint in formInstances:
                    dataPoints.append(dataPoint)
                try:
                    psource = url.replace(requestURI + '/form_instances?survey_id=','').replace('&form_id=','|')
                    if '&cursor=' in psource:
                        psource = psource.split('&cursor=')[0]
                    page_count += 1
                    print(checkTime(time.time()) + ' GET DATA FROM ['+ psource + '|PAGE ' + str(page_count) + ']')
                    url = data.get('nextPageUrl')
                    getAll(url, page_count)
                except:
                    print(checkTime(time.time()) + ' DOWNLOAD COMPLETE')
                    return "done"
            getAll(formURI,0)
            output = pd.DataFrame(dataPoints)
            print(checkTime(time.time()) + ' TRANSFORMING')
            for qst in metadata:
                qName = qst['name'].replace('_',' ')
                qId = str(qst['id'])
                qType = qst['type']
                try:
                    output[qName] = output['responses'].apply(lambda x: FlowHandler(x[groupID],qId,qType))
                    if qType == 'GEO':
                        output[qName+'_lat'] = output[qName].apply(lambda x: x[0] if x is not None else x)
                        output[qName+'_long'] = output[qName].apply(lambda x: x[1] if x is not None else x)
                        output = output.drop([qName], axis=1)
                except:
                    pass
            try:
                output = output.drop(['responses'], axis=1)
            except:
                pass
            allGroups.update({questionGroup['name']:output.to_dict('records')})
        allResponses.update({form['name']:allGroups})
    updatedData = TransformData(allResponses)
    return updatedData

def TransformData(allResponses):
    CollectorRegistration = pd.DataFrame(allResponses['Collector Registration']['Primary Details'])
    BuyingDetails = pd.DataFrame(allResponses['Buying Details']['Buying details'])
    CollectionArea = pd.DataFrame(allResponses['Buying Details']['Collection Area'])
    BuyingDetails = BuyingDetails.merge(CollectionArea[['Collection communes','identifier']],
                                        left_on='identifier',
                                        right_on='identifier')
    Transactions = BuyingDetails.merge(CollectorRegistration,
                                       left_on='identifier',
                                       right_on='identifier')
    Transactions = Transactions.rename(columns={
        'submissionDate_x':'submission date',
        'Contact phone number':'phone number',
        'Approximate quantity collected every month in season (kg)':'quantity permonth',
        'Primary address of collector':'collector address',
        'Collection communes':'collection communes',
        'Transport facility':'transportations',
        'Where do you sell the vegetables':'selling place',
        'Type of crop':'crop',
        'Name':'name',
        'Gender':'gender'
    })
    Transactions['Age'] = Transactions['Age'].astype(int)
    Transactions['quantity permonth'] = Transactions['quantity permonth'].astype(int)
    Transactions['phone number'] = Transactions['phone number'].astype(int)
    Transactions['crop'] = Transactions['crop'].apply(lambda x: x.split(':')[1])
    Transactions['submission date'] = Transactions['submission date'].apply(lambda x:x.split('T')[0])
    Transactions = Transactions[Transactions.columns.drop(list(Transactions.filter(regex='_y')))]
    Transactions = Transactions[Transactions.columns.drop(list(Transactions.filter(regex='_x')))]
    Transactions = Transactions.sort_values(by='submission date',ascending=False)
    Transactions.to_csv('transaction_'+datetime.today().strftime('%Y-%m-%d')+'.csv',index=False)
    return Transactions

def renderMessage(Transactions, params):
    rendered = ''
    rendered += '\n\n'
    if len(Transactions) > 0:
        rendered += '*'+params.upper()+'*\n'
        rendered += "------------------------------------"
        rendered += "--------------------------------\n\n"
        for idx, x in enumerate(Transactions):
            if idx < 5:
                rendered += '```'+x['name'].title() + "```\n\n"
                if params == 'submission date':
                    rendered += '🗓 _' + x['submission date'] + '_\n'
                    rendered += x['crop'] + ': *' + str(x['quantity permonth']) +'*\n'
                    rendered += '_Collected from_: ' + x['collection communes'] +'\n'
                    rendered += '_Sold to_: ' + x['selling place'] +'\n'
                elif params == 'name':
                    for key, value in x.items():
                        if key not in ['identifier','name','submission date']:
                            rendered += str(key).title() + ': *'+ str(value).title() +"*\n"
                    rendered +="\n"
                else:
                    rendered += " 📞 *" + str(x['phone number']) +"*\n"
                    rendered += params.title() + ': *' + x[params].replace('|',', ') +'*\n'
                rendered += "------------------------------------"
                rendered += "--------------------------------\n\n"
            else:
                pass
        if len(Transactions) > 5:
            rendered += '... and *' + str(len(Transactions) - 5) + ' more* at\n'
        rendered += 'https://akvo.org\n\n'
        rendered += '🇰🇭 Angkor Salad - Akvo Flow\n'
    else:
        rendered = "We are sorry, we cannot find " + params + " with your keywords"
    return rendered

def sendMessage(rendered, sender):
    client = Client(TWILLIO_SID, TWILLIO_TOKEN)
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        to=sender,
        body=rendered
    )
    mid = message.sid
    return mid

def execute(params, inputs):
    try:
        Transactions = pd.read_csv('transaction_'+datetime.today().strftime('%Y-%m-%d')+'.csv')
    except:
        Transactions = getUpdatedData()
    Results = Transactions.loc[Transactions[params.lower()].str.contains(inputs)]
    if Results.empty == True:
        Results= Transactions.loc[Transactions[params.lower()].str.contains(inputs.title())]
    Transactions = Results.to_dict('records')
    rendered = renderMessage(Transactions, params)
    return rendered

def generateTrasaction(params, values, sender):
    message = execute(params,values)
    mid = sendMessage(message, sender)
    return mid

def generateWelcome(sender):
    message = "Hi! "+ sender.replace("whatsapp:","") +" how are you doing?\n\n"
    message += "Welcome to 🇰🇭 *G4AW - Angkor Salad* Programme \n"
    message += "Can we help you?\n\n"
    message += "1. I want to know transaction today\n"
    message += "2. Show me list of available collectors\n"
    message += "3. I need some other specific information\n"
    message += "4. What is Angkor Salad?\n"
    mid = sendMessage(message, sender)
    return mid

def sendContacts(keyword, sender):
    try:
        Transactions = pd.read_csv('transaction_'+datetime.today().strftime('%Y-%m-%d')+'.csv')
    except:
        Transactions = getUpdatedData()
    Collections = Transactions[Transactions['collector address'].str.contains(keyword)].groupby(
        ['name','phone number','collector address','identifier']).size().to_frame('size').reset_index()
    if Collections.empty == True:
        message = 'Sorry, we cannot find the location'
    else:
        new = Collections["collector address"].str.split("|", n = 2, expand = True)
        Collections['province']= new[0]
        Collections['district']= new[1]
        Collections['sub-district']= new[2]
        Collections.drop(columns =['collector address'], inplace = True)
        Collections['province'] = Collections['province'].apply(lambda x:x.split(':')[0])
        Collections['district'] = Collections['district'].apply(lambda x:x.split(':')[0])
        Collections['sub-district'] = Collections['sub-district'].apply(lambda x:x.split(':')[0])
        Collections = Collections.to_dict('records')
        message = '\n'
        message += '*CONTACT LIST*\n'
        message += "------------------------------------"
        message += "--------------------------------\n\n"
        for col in Collections:
            message += col['name']
            message += " 📞 " + str(col['phone number']) +"\n"
            message += col['province'] +", "+ col['district'] + ", " + col['sub-district'] + "\n\n"
            message += "------------------------------------"
            message += "--------------------------------\n\n"
    mid = sendMessage(message, sender)
    return mid

def transformSenderMessage(contents):
    response = {}
    for content in contents:
        pv = content.split('=')
        response.update({pv[0]:pv[1]})
    return response

@app.route('/api', methods=['GET', 'POST'])
def api():
    message = ""
    contents = request.get_data().decode('utf-8').split('&')
    response = transformSenderMessage(contents)
    print(response)
    body = urllib.parse.unquote(urllib.parse.unquote(response['Body']))
    sender = urllib.parse.unquote(urllib.parse.unquote(response['From']))
    welcome = ['hi','hello','excuse me','hai']
    if body.lower().strip() in welcome:
        message = generateWelcome(sender)
    elif body == '1':
        generateTrasaction('submission date', datetime.today().strftime('%Y-%m-%d'), sender)
    elif body == '2':
        sendMessage("Search available contacts with this format:\n_contacts, province or district or sub-district_", sender)
    elif body == '3':
        message = "Search available transaction with this format:\n_parameters, key_\n\n"
        message += "Example:\n_submission date, 2019-03-28_\n"
        message += "List of Available Parameters:\n"
        message += "- name, *Keywords*\n"
        message += "- crop, *Keywords*\n"
        message += "- collector address, *Keywords*\n"
        message += "- collecton communes, *Keywords*\n"
        message += "- transportations, *Truck/Motorcycle/Car/Tuk*\n"
        message += "- selling place, *Village/Province/Phnom Penh)*\n"
        sendMessage(message, sender)
    elif body == '4':
        message = '*ABOUT ANGKOR SALAD*\n'
        message += "-----------------------------"
        message += "--------------------------------\n"
        message += 'The Angkor Salad project is funded by the Netherlands Space Office (NSO) and is focused on incorporating satellite-derived data to inform and improve agricultural production in selected developing countries.\n'
        message += "-----------------------------"
        message += "--------------------------------\n"
        message += 'Partners: Akvo, Angkor Green, General Directorate of Agriculture (GDA), Nelen & Schuurmans, SMART Axiata, VanderSat, World Vegetable Center.\n\n'
        message += 'https://youtu.be/05ovSkVvS4g'
        sendMessage(message, sender)
    elif body == '5':
        sendMessage('lagi di KH nih', sender)
    elif body.lower().strip() == 'update-flow':
        getUpdatedData()
        sendMessage("Hi! The data has been updated \n\n Download(.csv): http://test.dedenbangkit.online/download", sender)
    else:
        if ',' in body:
            body = body.split(',')
            param = body[0].replace('+',' ').lower().strip()
            keys = body[1].replace('+',' ').strip()
            if param == 'contacts':
                sendContacts(keys.title(), sender)
            else:
                generateTrasaction(param, keys, sender)
        else:
            sendMessage("We are sorry, the command " + body + " is not available", sender)
    return sender

@app.route('/download', methods=['GET', 'POST'])
def download():
    csv_output = 'transaction_'+datetime.today().strftime('%Y-%m-%d')+'.csv'
    with open(csv_output) as fp:
        csv = fp.read()
    return Response(csv,mimetype="text/csv",headers={"Content-disposition":"attachment; filename=" + csv_output})

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True, port=3000)

