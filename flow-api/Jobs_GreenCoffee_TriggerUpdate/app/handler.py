def handleOption(data):
    response=""
    for value in data:
        if(response==""):
            if(value.get("code")==None):
                response=value.get('text',"")
            else :
                response=value.get('code')+":"+value.get('text',"")
        elif(response):
            if(value.get("code")==None):
                response=response+"|"+value.get('text',"")
            else:
                response=response+"|"+value.get('code',"")+":"+value.get('text',"")
    return response

def handleFreeText(data):
    return data


def handleBarCode(data):
    return data

def handleDate(data):
    return data

def handleNumber(data):
    return data

def handleCascade(data):
    response=""
    for value in data:
        if(response==""):
            if(value.get("code")==None):
                response=value.get('name',"")
            else:
                response=value.get('code',"")+":"+value.get("name","")
        elif(response):
            if(value.get("code")==None):
                response=response+"|"+value.get('name',"")
            else:
                response=response+"|"+value.get('code',"")+":"+value.get("name","")
    return response

def handleGeoshape(data):
    return data

def handleGeolocation(final,value,key):
    text=key+"|Latitude"
    if value:
        final[text].append(value.get('lat',''))
        final['--GEOLON--|Longitude'].append(value.get('long',''))
    else:
        final[text].append('')
        final['--GEOLON--|Longitude'].append('')

def handleCaddisfly(data):
    return data

def handlePhotoQuestion(data):
    return data.get('filename',"")

def handleVideoQuestion(data):
    return data.get('filename',"")

def handleSignature(data):
    return data.get('name',"")


def getValue(value, question):
    qType = question.get('type','')
    if(value == None):
        return ''
    elif(qType == 'OPTION'):
        return handleOption(value)
    elif(qType == 'PHOTO'):
        return handlePhotoQuestion(value)
    elif(qType == 'CADDISFLY'):
        return handleCaddisfly(value)
    elif(qType == 'VIDEO'):
        return handleVideoQuestion(value)
    elif(qType == 'GEOSHAPE'):
        return handleGeoshape(value)
    elif(qType == 'GEO'):
        return handleGeolocation(value)
    elif(qType == 'FREE_TEXT'):
        return handleFreeText(value)
    elif(qType == 'SCAN'):
        return handleBarCode(value)
    elif(qType == 'DATE'):
        return handleDate(value)
    elif(qType == 'NUMBER'):
        return handleNumber(value)
    elif(qType == 'CASCADE'):
        return handleCascade(value)
    elif(qType == 'SIGNATURE'):
        return handleSignature(value)
    else:
        return ''
