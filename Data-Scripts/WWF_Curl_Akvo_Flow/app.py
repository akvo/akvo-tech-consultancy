from Akvo import Flow

instanceURI = 'wwfid'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI

print(Flow.getResponse(requestURI + '/folders'))
