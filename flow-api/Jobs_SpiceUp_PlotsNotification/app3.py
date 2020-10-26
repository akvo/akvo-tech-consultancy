import os
from datetime import datetime, timedelta, date
import time
from Akvo import Flow
from mailjet_rest import Client
from FlowHandler import FlowHandler
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from itertools import groupby # Need to add into requirements.txt


# Change frequency to 30 days (every month)
f = 30
today_date = datetime.today().date()
week_ago = today_date - timedelta(days=f)
start_date_raw = (today_date - timedelta(days=f))
start_date = (today_date - timedelta(days=f)).strftime('%Y-%m-%d')
end_date = today_date.strftime('%Y-%m-%d')
day = today_date.strftime('%d')


# # New Start Date
# ##### Date when Lampung Monitoring Started 2020-07-21 15:07

# Change the date to 15 of September 2020 - Just run once on 15 Sept 2020
if today_date == date(2020, 9, 15):
    calculate_day = (today_date - date(2020, 7, 21)).days
    week_ago = today_date - timedelta(days=calculate_day)
    start_date_raw = (today_date - timedelta(days=calculate_day))
    start_date = (today_date - timedelta(days=calculate_day)).strftime('%Y-%m-%d')
    end_date = today_date.strftime('%Y-%m-%d')


# # Starting Process
if (day == '01'):
    instanceURI = 'spiceup'
    requestURI = "https://api-auth0.akvo.org/flow/orgs/{}".format(instanceURI)

    EMAIL_RECEPIENTS = ['akvo.tech.consultancy@gmail.com']
    EMAIL_BCC = ['hatami.nugraha@gmail.com','everschuren@verstegen.nl','joy@akvo.org','hatami@cinquer.co.id','d.kurniawati@icco.nl','dymanohara@gmail.com','aharton2002@yahoo.com','akhmadfa@apps.ipb.ac.id','otihrostiana@gmail.com','ima@akvo.org','deden@akvo.org','galih@akvo.org', 'wietze.suijker@nelen-schuurmans.nl']

    # EMAIL_RECEPIENTS = ['galih@akvo.org']
    # EMAIL_BCC = ['galih@akvo.org']

    MAILJET_APIKEY = os.environ['MAILJET_APIKEY']
    MAILJET_SECRET = os.environ['MAILJET_SECRET']

    mailjet = Client(auth=(MAILJET_SECRET, MAILJET_APIKEY), version='v3.1')

    token = Flow.getAccessToken();
    apiData = Flow.getResponse(requestURI + '/surveys/227030237', token)

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
        data = Flow.getResponse(url, token)
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


    # # Collect All Responses
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


    # # Group datapoint ID by Plot Location
    lst = allResponses['01. Plot Registration']['Plant Registration']
    lst.sort(key=lambda x:x['Plot Location'])

    datapointIds = []
    for k,v in groupby(lst,key=lambda x:x['Plot Location']):
        # print(k, [x['dataPointId'] for x in list(v)])
        datapointIds.append([x['dataPointId'] for x in list(v)])


    # # New Part to split report into Bangka and Lampung
    # ##### Design to split automatically for each datapoint on registration form
    def get_soil_result(x):
        if x is not None:
            return float(x['result'][0]['value'])
        else:
            return 0

    registrationDataPoints = datapointIds
    all_email_data = []
    for dpId in registrationDataPoints:
        print("Collect Email Data for datapoint - " + str(dpId))
        email_data = {}
        
        # PLOT LOCATION
        plant = [x for x in allResponses['01. Plot Registration']['Plant Registration'] if x['dataPointId'] in dpId][1] # to get the old datapoint
        plot_location = plant['Plot Location'].split('|')
        plot_location = [pl.split(':')[0] for pl in plot_location]
        plot_location = ', '.join(plot_location)
        email_data.update({'plot_location':plot_location})
        
        # PLOT ID
        plot_id = plant['Plot ID']
        email_data.update({'plot_id':plot_id})
        
        # PLOT LINK
        plot_latlong = [str(plant['Plot Geopoint_lat']),str(plant['Plot Geopoint_long'])]
        plot_latlong = ', '.join(plot_latlong)
        plot_map_img = "https://www.mapquestapi.com/staticmap/v4/getmap?size=640,480&type=map&pois=mcenter," + plot_latlong
        plot_map_img = plot_map_img +"|&zoom=12&center="+ plot_latlong +"&imagetype=JPEG&traffic=flow&scalebar=false&key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24"
        plot_link = "http://maps.google.com/maps?t=k&q=loc:" + plot_latlong
        email_data.update({'plot_link':plot_link})
        
        # PLOT SUMMARY
        plant_submissionDate = plant['submissionDate'].split('T')[0]
        plot_submission_summary = 'First demonstration plots have been planted at '
        plot_submission_summary =  plot_submission_summary + datetime.strptime(plant_submissionDate, '%Y-%m-%d').strftime('%B, %d %Y')
        plant_type = plant['Type of Plantation']
        plot_submission_summary = plot_submission_summary + ' with ' + plant_type + ' in ' + plot_location + '.'
        email_data.update({'plot_submission_summary':plot_submission_summary})
        
        # WEATHER
        filter_weather = [x for x in allResponses['02. Weather Conditions']['Weather Conditions'] if x['dataPointId'] in dpId]
        weather = pd.DataFrame(filter_weather)
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
        email_data.update({'weather_submission':weather_submission})
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

        # SOIL
        filter_soil = [x for x in allResponses['03. Soil Monitoring']['Soil Properties'] if x['dataPointId'] in dpId]
        soil_average = {}
        soil_average['Soil Moisture'] = 'No Data'
        soil_average['Soil pH'] = 'No Data'
        soil_average['Nitrate'] = 'No Data'
        soil_average['P'] = 'No Data'
        soil_submission = 0
        
        if len(filter_soil) > 0:
            soil = pd.DataFrame(filter_soil)
            mask = (soil['createdAt'] > start_date)
            soil = soil.loc[mask]
            soil_submission = len(soil.index)
            soil['Soil Moisture'] = soil['Soil Moisture'].apply(get_soil_result)
            soil['Soil pH'] = soil['Soil pH'].apply(get_soil_result)
            soil['Nitrate'] = soil['Nitrate'].apply(get_soil_result)
            soil['P'] = soil['P'].apply(get_soil_result)
            
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
            
            # soil_average['Soil Moisture'] = soil_df
            # soil_average['Nitrate'] = soil_formula
        
        email_data.update({'soil_submission':soil_submission})
        email_data.update({'soil_average':soil_average})
            
        # PLANT GENERAL CONDITION
        filter_plant_gc = [x for x in allResponses['04. Plant Monitoring']['General Condition'] if x['dataPointId'] in dpId]
        if len(filter_plant_gc) > 0:
            plant_gc = pd.DataFrame(filter_plant_gc)
            plant_gc['createdAt'] = plant_gc['createdAt'].astype('datetime64[ns]')
            mask = (plant_gc['createdAt'] > start_date)
            plant_gc = plant_gc.loc[mask]
            plant_gc_submission = len(plant_gc.index)
        
        variables = ['Plant Condition', 'Plant / Vine Condition','Roots / Stem Base']    
        conditions = []
        for item in variables:
            if len(filter_plant_gc) > 0:
                tmp_arr = plant_gc[[item, 'Plant ID']].groupby(item).count().reset_index().to_dict('records')
                result = map(lambda x: str(x['Plant ID']) + ' ' + x[item], tmp_arr)
                result = []
                for item2 in tmp_arr:
                    if item2[item] == 'Dead':
                        result.append('<span style="color:red;font-weight:bold">' + str(item2['Plant ID']) + ' ' + item2[item] + '</span>')
                    else:
                        result.append(str(item2['Plant ID']) + ' ' + item2[item])
                conditions.append('- ' + item + ': ' + ', '.join(result))
            else:
                conditions.append('- ' + item + ':')
        plant_general_condition = "<br/> ".join(conditions)
        email_data.update({'plant_general_condition':plant_general_condition})
            
        # PLANT NODE
        filter_plant_growth = [x for x in allResponses['04. Plant Monitoring']['Plant Growth'] if x['dataPointId'] in dpId]
        plant_growth_default = {}
        plant_growth_default['count'] = 'No Data'
        plant_growth_default['mean'] = 'No Data'
        plant_growth_default['std'] = 'No Data'
        plant_growth_default['min'] = 'No Data'
        plant_growth_default['25%'] = 'No Data'
        plant_growth_default['50%'] = 'No Data'
        plant_growth_default['75%'] = 'No Data'
        plant_growth_default['max'] = 'No Data'
        
        plant_node = plant_growth_default
        plant_growth_submission = 0
        if len(filter_plant_growth) > 0:
            plant_growth = pd.DataFrame(filter_plant_growth)
            plant_growth['createdAt'] = plant_growth['createdAt'].astype('datetime64[ns]')
            mask = (plant_growth['createdAt'] > start_date)
            plant_growth = plant_growth.loc[mask]
            plant_growth_submission = len(plant_growth.index)
            plant_node = plant_growth[plant_growth['Number of Nodes'].notnull()]['Number of Nodes'].describe()
            plant_node = plant_node.round(1).fillna('No Data')
        email_data.update({'plant_growth_submission':plant_growth_submission})
        email_data.update({'plant_node':plant_node})
        
        # PLANT LEAF
        plant_leaf = plant_growth_default
        if len(filter_plant_growth) > 0:
            plant_leaf = plant_growth[plant_growth['Number of Leaves'].notnull()]['Number of Leaves'].describe()
            plant_leaf = plant_leaf.round(1).fillna('No Data')
        email_data.update({'plant_leaf':plant_leaf})
        
        # PLANT BRANCH
        plant_branch = plant_growth_default
        if len(filter_plant_growth) > 0:
            plant_branch = plant_growth[plant_growth['Number of Branches'].notnull()]['Number of Branches'].describe()
            plant_branch = plant_branch.round(1).fillna('No Data')
        email_data.update({'plant_branch':plant_branch})
        
        # PLANT HEIGHT
        plant_height = plant_growth_default
        if len(filter_plant_growth) > 0:
            plant_height = plant_growth[plant_growth['Plant Height (cm)'].notnull()]['Plant Height (cm)'].describe()
            plant_height = plant_height.round(1).fillna('No Data')
        email_data.update({'plant_height':plant_height})
        
        # PLANT ORTHOTROPIC
        plant_orthotropic = plant_growth_default
        if len(filter_plant_growth) > 0:
            plant_orthotropic = plant_growth[plant_growth['Number of Orthotropic shoots'].notnull()]['Number of Orthotropic shoots'].describe()
            plant_orthotropic = plant_orthotropic.round(1).fillna('No Data')
        email_data.update({'plant_orthotropic':plant_orthotropic})
        
        # OTHER INFORMATION
        plant_oi_max = 'No Data'
        plant_oi_min = 'No Data'
        plant_oi_avg = 'No Data'
        plant_oi_hanging = {}
        plant_oi_wilting = {}
        filter_plant_oi = [x for x in allResponses['04. Plant Monitoring']['Other Information'] if x['dataPointId'] in dpId]
        if len(filter_plant_oi) > 0:
            plant_oi = pd.DataFrame(filter_plant_oi)
            plant_oi['createdAt'] = plant_oi['createdAt'].astype('datetime64[ns]')
            mask = (plant_oi['createdAt'] > start_date)
            plant_oi = plant_oi.loc[mask]
            plant_oi_max = plant_oi.max()
            plant_oi_min = plant_oi.min()
            plant_oi_avg = plant_oi.mean()

            plant_oi_hanging = plant_oi.groupby('Leaves hanging rigidly').size()
            plant_oi_wilting = plant_oi.groupby('Wilting Symptoms').size()
        email_data.update({'plant_oi_hanging':plant_oi_hanging})
        email_data.update({'plant_oi_wilting':plant_oi_wilting})

        # ACTIVITIES
        filter_activities = [x for x in allResponses['05. Activity']['Activity Monitoring'] if x['dataPointId'] in dpId]
        type_of_activities = ['No Activities']
        activities_submission = 0
        if len(filter_activities) > 0:
            activities = pd.DataFrame(filter_activities)
            activities['createdAt'] = activities['createdAt'].astype('datetime64[ns]')
            mask = (activities['createdAt'] > start_date)
            activities = activities.loc[mask]
            type_of_activities = activities['Type of Activity'].unique()
            if activities['Type of Activity'].count() == 0:
                type_of_activities=['No Activities']
                
            activities_submission = len(activities.index)
        email_data.update({'type_of_activities':type_of_activities})
        email_data.update({'activities_submission':activities_submission})
        
        # append to collect all email data
        all_email_data.append(email_data)


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
    template = env.get_template('./email_v3.html')


    # # New template render for each datapoint
    html_output = ""
    for content in all_email_data:
        html_output += template.render(
            start_date = start_date_raw.strftime("%B %d, %Y"),
            date = today.strftime("%B %d, %Y"),
            location_title = content['plot_id'],
            plot_summary = content['plot_submission_summary'],
            img_map = 'https://www.mapquestapi.com/staticmap/v4/getmap?size=640,480&amp;type=map&amp;pois=mcenter,-2.3428743096598823, 106.18896435946226|&amp;zoom=12&amp;center=-2.3428743096598823, 106.18896435946226&amp;imagetype=JPEG&amp;traffic=flow&amp;scalebar=false&amp;key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24',
            gmap_link = content['plot_link'],
            weather_icon = weather_img_mapping.get(content['weather_most_condition'], weather_img_mapping['Mostly Sunny']),
            weather_label = content['weather_most_condition'],
            weather_temp = content['weather_average_temperature'],
            soil_moisture = content['soil_average']['Soil Moisture'],
            soil_ph = content['soil_average']['Soil pH'],
            soil_nitrate = content['soil_average']['Nitrate'],
            soil_p = content['soil_average']['P'],
            plant_general_condition = content['plant_general_condition'],
            plant_leaf = content['plant_leaf'],
            plant_node = content['plant_node'],
            plant_height = content['plant_height'],
            plant_branch = content['plant_branch'],
            plant_oi_hanging = content['plant_oi_hanging'],
            plant_oi_wilting = content['plant_oi_wilting'],
            plant_orthotropic = content['plant_orthotropic'],
            type_of_activities = content['type_of_activities'],
            weather_submission = content['weather_submission'],
            soil_submission = content['soil_submission'],
            plant_growth_submission = content['plant_growth_submission'],
            activities_submission = content['activities_submission']
        )


    # # Send Email & Print Result
    receiver = []
    for email in EMAIL_RECEPIENTS:
        receiver.append({"Email": email})

    bcc = []
    for email in EMAIL_BCC:
        bcc.append({"Email": email})

    email = {
        'Messages': [{
                    "From": {"Email": "noreply@akvo.org", "Name": "noreply@akvo.org"},
                    "To": receiver,
                    "Bcc": bcc,
                    "Subject": 'DO NOT REPLY: Demo Plot Notification from ' + formatDate(week_ago) + ' to ' + formatDate(today_date),
                    "HTMLPart": html_output,
                }]
        }

    result = mailjet.send.create(data=email)
    print(checkTime(time.time()) + ' SENDING EMAIL TO {}'.format(', '.join(EMAIL_RECEPIENTS)))
    print(checkTime(time.time()) + ' SENDING BCC TO {}'.format(', '.join(EMAIL_BCC)))
    print(checkTime(time.time()) + ' STATUS: {}\n'.format(result.status_code))