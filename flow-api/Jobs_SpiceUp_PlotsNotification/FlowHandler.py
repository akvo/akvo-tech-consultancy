def FlowHandler(val,qId,qType):
    try:
        data = val[0][qId]
        if (data == 'Error'):
            return ""
        elif(qType=='OPTION'):
            return handleOption(data)
        elif(qType=='PHOTO'):
            return handlePhotoQuestion(data)
        elif(qType=='CADDISFLY'):
            return handleCaddisfly(data)
        elif(qType=='VIDEO'):
            return handleVideoQuestion(data)
        elif(qType=='GEOSHAPE'):
            return handleGeoshape(data)
        elif(qType=='GEO'):
            return handleGeolocation(data)
        elif(qType=='FREE_TEXT'):
            return handleFreeText(data)
        elif(qType=='SCAN'):
            return handleBarCode(data)
        elif(qType=='DATE'):
            return handleDate(data)
        elif(qType=='NUMBER'):
            return handleNumber(data)
        elif(qType=='CASCADE'):
            return handleCascade(data)
        elif(qType=='SIGNATURE'):
            return handleSignature(data)
        else:
            return ""
    except:
        data = None
    return data

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

def handleGeolocation(data):
    response = []
    response.append(data.get('lat'))
    response.append(data.get('long'))
    return response

def handleCaddisfly(data):
    return data

def handlePhotoQuestion(data):
    return data.get('filename',"")

def handleVideoQuestion(data):
    return data.get('filename',"")

def handleSignature(data):
    return data.get('name',"")
