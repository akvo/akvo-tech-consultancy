import sys
import os
from datetime import datetime, timedelta, date
from pytz import utc, timezone
import time
from Akvo import Flow
from FlowHandler import FlowHandler
import pandas as pd
import json
from jinja2 import Environment, FileSystemLoader
from IPython.core.display import display, HTML
import smtplib
from email import encoders
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

today_date = datetime.today().date()
week_ago = today_date - timedelta(days=15)
start_date_raw = (today_date - timedelta(days=15))
start_date = (today_date - timedelta(days=15)).strftime('%Y-%m-%d')
end_date = today_date.strftime('%Y-%m-%d')
day = today_date.strftime('%d')

if (day == '01' or day == '15'):

    instanceURI = 'spiceup'
    requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
    EMAIL_RECEPIENTS = ['hatami@cinquer.co.id','indri@cinquer.nl','yayang@cinquer.nl','d.kurniawati@icco.nl','everschuren@verstegen.nl','aharton2002@yahoo.com','otihrostiana@gmail.com','dyah_manohara@yahoo.com','joy@akvo.org','ima@akvo.org','deden@akvo.org','merembablas@gmail.com']
    #EMAIL_RECEPIENTS = ['merembablas@gmail.com']
    EMAIL_SENDER = os.environ['EMAIL_USER']
    EMAIL_PASSWORD = os.environ['EMAIL_PWD']

    apiData = Flow.getResponse(requestURI + '/surveys/227030237')
    forms = apiData.get('forms')
    RegistrationForm = apiData['registrationFormId']
    start_time = time.time()
    date_format = '%Y-%m-%dT%H:%M:%SZ'

    def formatDate(dt):
        return dt.strftime("%d/%m/%Y")

    def checkTime(x):
        total_time = x - start_time
        spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
        return spent

    questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
    details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
    registrationFormId = apiData.get('registrationFormId')

    def getAll(url):
        data = Flow.getResponse(url)
        formInstances = data.get('formInstances')
        for dataPoint in formInstances:
            dataPoints.append(dataPoint)
        try:
            print(checkTime(time.time()) + ' GET DATA FROM[' + url + ']')
            url = data.get('nextPageUrl')
            getAll(url)
        except:
            print(checkTime(time.time()) + ' DOWNLOAD COMPLETE')
            return "done"

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
            getAll(formURI)
            output = pd.DataFrame(dataPoints)
            print(checkTime(time.time()) + ' TRANSFORMING')
            for qst in metadata:
                qName = qst['name'].replace('_',' ')
                qId = str(qst['id'])
                qType = qst['type']
                try:
                    output[qName] = output['responses'].apply(lambda x: FlowHandler(x.get(groupID, False),qId,qType))
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


    pd.DataFrame(allResponses).unstack().to_frame().dropna().reset_index()
    pd.DataFrame(questionGroups)

    qGroup = list(allResponses.keys())
    qGroup.sort()

    newResponses = {}
    newSort = sorted(allResponses.keys())
    for ns in newSort:
        newResponses.update({ns:allResponses[ns]})

    for g in qGroup:
        forms = [k for k in newResponses[g]]
        for form in forms:
            unordered = pd.DataFrame(newResponses[g][form])
            try:
                ordered = unordered.sort_values(by='submissionDate',ascending=False).to_dict('records')
                newResponses[g][form] = ordered
            except:
                pass
    allResponses = newResponses

    email_data = {}

    plant = allResponses['01. Plot Registration']['Plant Registration'][0]
    plot_location = plant['Plot Location'].split('|')
    plot_location = [pl.split(':')[0] for pl in plot_location]
    plot_location = ', '.join(plot_location)
    email_data.update({'plot_location':plot_location})

    plot_latlong = [str(plant['Plot Geopoint_lat']),str(plant['Plot Geopoint_long'])]
    plot_latlong = ', '.join(plot_latlong)
    plot_map_img = "https://www.mapquestapi.com/staticmap/v4/getmap?size=640,480&type=map&pois=mcenter," + plot_latlong
    plot_map_img = plot_map_img +"|&zoom=12&center="+ plot_latlong +"&imagetype=JPEG&traffic=flow&scalebar=false&key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24"
    plot_link = "http://maps.google.com/maps?t=k&q=loc:" + plot_latlong
    email_data.update({'plot_link':plot_link})

    plant_submissionDate = plant['submissionDate'].split('T')[0]
    plot_submission_summary = 'First demonstration plots have been planted at '
    plot_submission_summary =  plot_submission_summary + datetime.strptime(plant_submissionDate, '%Y-%m-%d').strftime('%B, %d')
    plant_type = plant['Type of Plantation']
    plot_submission_summary = plot_submission_summary + ' with ' + plant_type + ' in ' + plot_location + '.'
    email_data.update({'plot_submission_summary':plot_submission_summary})

    weather = pd.DataFrame(allResponses['02. Weather Conditions']['Weather Conditions'])
    weather['General Weather Conditions'] = weather['General Weather Conditions'].apply(lambda x: x.replace(':',''))
    weather['createdAt'] = weather['createdAt'].astype('datetime64[ns]')
    weather['month'] = weather['createdAt'].apply(lambda x : x.strftime('%B'))
    mask = (weather['createdAt'] > start_date)
    weather = weather.loc[mask]

    try:
        weather_average_temperature = list(weather.groupby('identifier').mean().reset_index()['Temperature (Celsius)'])[0]
        weather_average_temperature = str(int(weather_average_temperature)) + '° Celcious'
    except:
        weather_average_temperature = 'No Data'

    weather_submission = len(weather.index)

    email_data.update({'weather_average_temperature':weather_average_temperature})

    weather_most_condition = weather.groupby(['General Weather Conditions','createdAt']).size().to_frame('size').reset_index()
    weather_most_condition = weather_most_condition.groupby(['General Weather Conditions']).size().to_frame('size').reset_index()
    weather_most_condition = weather_most_condition.max()[0]
    try:
        weather_most_condition = 'Mostly ' + weather_most_condition
    except:
        weather_most_condition = 'No Data'

    email_data.update({'weather_most_condition':weather_most_condition})

    weather_all_conditions = weather[['dataPointId','General Weather Conditions']].groupby(['General Weather Conditions']).count().reset_index()

    email_data.update({'weather_all_conditions':weather_all_conditions.to_dict('records')})

    soil = pd.DataFrame(allResponses['03. Soil Monitoring']['Soil Properties'])
    soil['createdAt'] = soil['createdAt'].astype('datetime64[ns]')
    mask = (soil['createdAt'] > start_date)
    soil = soil.loc[mask]
    soil_submission = len(soil.index)

    def get_soil_result(x):
        if x is not None:
            return float(x['result'][0]['value'])
        else:
            return 0
    
    soil['Soil Moisture'] = soil['Soil Moisture'].apply(get_soil_result)
    soil['Soil pH'] = soil['Soil pH'].apply(get_soil_result)
    soil['Nitrate'] = soil['Nitrate'].apply(get_soil_result)
    soil['P'] = soil['P'].apply(get_soil_result)

    soil_average = {}
    try:
        soil_average['Soil Moisture'] = round(soil.loc[soil['Soil Moisture'] != 0].groupby('identifier').mean().reset_index()['Soil Moisture'][0], 2)
    except:
        soil_average['Soil Moisture'] = 'No Data'

    try:
        soil_average['Soil pH'] = round(soil.loc[soil['Soil pH'] != 0].groupby('identifier').mean().reset_index()['Soil pH'][0], 2)
    except:
        soil_average['Soil pH'] = 'No Data'
        
    try:
        soil_average['Nitrate'] = round(soil.loc[soil['Nitrate'] != 0].groupby('identifier').mean().reset_index()['Nitrate'][0], 2)
    except:
        soil_average['Nitrate'] = 'No Data'
        
    try:
        soil_average['P'] = round(soil.loc[soil['P'] != 0].groupby('identifier').mean().reset_index()['P'][0], 2)
    except:
        soil_average['P'] = 'No Data'

    # SOIL FORMULA
    if soil_average['Soil Moisture'] == 'No Data' or soil_average['Nitrate'] == 'No Data':
        soil_df = 0
        soil_formula = 0
    else:
        soil_df = (1 + (soil_average['Soil Moisture'] * 1.3)) * 5
        soil_formula = round((soil_average['Nitrate'] + 0.613) * soil_df / 2.7763, 2)

    # PLANT GENERAL CONDITION
    plant_gc = pd.DataFrame(allResponses['04. Plant Monitoring']['General Condition'])
    plant_gc['createdAt'] = plant_gc['createdAt'].astype('datetime64[ns]')
    mask = (plant_gc['createdAt'] > start_date)
    plant_gc = plant_gc.loc[mask]
    plant_gc_submission = len(plant_gc.index)

    variables = ['Plant Condition', 'Plant / Vine Condition','Roots / Stem Base']
    conditions = []
    for item in variables:
        tmp_arr = plant_gc[[item, 'Plant ID']].groupby(item).count().reset_index().to_dict('records')
        result = map(lambda x: str(x['Plant ID']) + ' ' + x[item], tmp_arr)
        result = []
        for item2 in tmp_arr:
            if item2[item] == 'Dead':
                result.append('<span style="color:red;font-weight:bold">' + str(item2['Plant ID']) + ' ' + item2[item] + '</span>')
            else:
                result.append(str(item2['Plant ID']) + ' ' + item2[item])
                
        conditions.append('- ' + item + ': ' + ', '.join(result))

    plant_general_condition = "<br/> ".join(conditions)

    # PLANT NODE
    plant_growth = pd.DataFrame(allResponses['04. Plant Monitoring']['Plant Growth'])
    plant_growth['createdAt'] = plant_growth['createdAt'].astype('datetime64[ns]')
    mask = (plant_growth['createdAt'] > start_date)
    plant_growth = plant_growth.loc[mask]
    plant_growth_submission = len(plant_growth.index)
    plant_node = plant_growth[plant_growth['Number of Nodes'].notnull()]['Number of Nodes'].describe()
    plant_node = plant_node.round(1).fillna('No Data')

    # PLANT LEAF
    plant_leaf = plant_growth[plant_growth['Number of Leaves'].notnull()]['Number of Leaves'].describe()
    plant_leaf = plant_leaf.round(1).fillna('No Data')

    # PLANT BRANCH
    plant_branch = plant_growth[plant_growth['Number of Branches'].notnull()]['Number of Branches'].describe()
    plant_branch = plant_branch.round(1).fillna('No Data')

    plant_height = plant_growth[plant_growth['Plant Height (cm)'].notnull()]['Plant Height (cm)'].describe()
    plant_height = plant_height.round(1).fillna('No Data')

    plant_orthotropic = plant_growth[plant_growth['Number of Orthotropic shoots'].notnull()]['Number of Orthotropic shoots'].describe()
    plant_orthotropic = plant_orthotropic.round(1).fillna('No Data')

    # OTHER INFORMATION
    plant_oi = pd.DataFrame(allResponses['04. Plant Monitoring']['Other Information'])
    plant_oi['createdAt'] = plant_oi['createdAt'].astype('datetime64[ns]')
    mask = (plant_oi['createdAt'] > start_date)
    plant_oi = plant_oi.loc[mask]
    plant_oi_max = plant_oi.max()
    plant_oi_min = plant_oi.min()
    plant_oi_avg = plant_oi.mean()

    plant_oi_hanging = plant_oi.groupby('Leaves hanging rigidly').size()
    plant_oi_wilting = plant_oi.groupby('Wilting Symptoms').size()

    # ACTIVITIES
    activities = pd.DataFrame.from_dict(allResponses['05. Activity']['Activity Monitoring'])
    activities['createdAt'] = activities['createdAt'].astype('datetime64[ns]')
    mask = (activities['createdAt'] > start_date)
    activities = activities.loc[mask]
    type_of_activities = activities['Type of Activity'].unique()
    if activities['Type of Activity'].count() == 0:
        type_of_activities=['No Activities']
    
    activities_submission = len(activities.index)

    weather_img_mapping = {
        'Mostly Cloudy': 'https://i.imgur.com/RP7sg1j.png',
        'Mostly Light Rain': 'https://i.imgur.com/hlFuSZZ.png',
        'Mostly Sunny with Cloud': 'https://i.imgur.com/vdgWxeP.png',
        'Mostly Sunny': 'https://i.imgur.com/JD4Z8Rs.png',
        'Mostly Thick Cloudy': 'https://i.imgur.com/RP7sg1j.png',
        'Mostly Medium Rain': 'https://i.imgur.com/Yt8QleJ.png',
        'Mostly Heavy Rain': 'https://i.imgur.com/bIJdjUl.png'
    }

    today = date.today()
    
    file_loader = FileSystemLoader('.')
    env = Environment(loader=file_loader)
    template = env.get_template('./email_v2.html')
    html_output = template.render(
        start_date = start_date_raw.strftime("%B %d, %Y"),
        date = today.strftime("%B %d, %Y"),
        plot_summary = plot_submission_summary,
        img_map = 'https://www.mapquestapi.com/staticmap/v4/getmap?size=640,480&amp;type=map&amp;pois=mcenter,-2.3428743096598823, 106.18896435946226|&amp;zoom=12&amp;center=-2.3428743096598823, 106.18896435946226&amp;imagetype=JPEG&amp;traffic=flow&amp;scalebar=false&amp;key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24',
        gmap_link = plot_link,
        weather_icon = weather_img_mapping.get(weather_most_condition, weather_img_mapping['Mostly Sunny']),
        weather_label = weather_most_condition,
        weather_temp = weather_average_temperature,
        soil_moisture = soil_average['Soil Moisture'],
        soil_ph = soil_average['Soil pH'],
        soil_nitrate = soil_average['Nitrate'],
        soil_p = soil_average['P'],
        plant_general_condition = plant_general_condition,
        plant_leaf = plant_leaf,
        plant_node = plant_node,
        plant_height = plant_height,
        plant_branch = plant_branch,
        plant_oi_hanging = plant_oi_hanging,
        plant_oi_wilting = plant_oi_wilting,
        plant_orthotropic = plant_orthotropic,
        type_of_activities = type_of_activities,
        weather_submission = weather_submission,
        soil_submission = soil_submission,
        plant_growth_submission = plant_growth_submission,
        activities_submission = activities_submission
    )

    fout = "./email_v2.html"

    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'DO NOT REPLY: Demo Plot Notification from ' + formatDate(week_ago) + ' to ' + formatDate(today_date)
    msg['To'] = ', '.join(EMAIL_RECEPIENTS)
    msg['From'] = 'akvo.tech.consultancy@gmail.com'

    print(checkTime(time.time()) + ' SENDING EMAIL')
    with open(fout) as fp:
        msg.attach(MIMEText(html_output, 'html'))

    try:
        with smtplib.SMTP('smtp.sendgrid.net', 587) as s:
                s.ehlo()
                s.starttls()
                s.ehlo()
                s.login(EMAIL_SENDER, EMAIL_PASSWORD)
                s.send_message(msg)
                s.quit()
        print(checkTime(time.time()) + ' EMAIL SENT')
    except:
        print(checkTime(time.time()) + ' UNABLE TO SEND THE EMAIL. ERROR:',sys.exc_info()[0])
        raise