curl -s \
     -d "client_id=S6Pm0WF4LHONRPRKjepPXZoX1muXm1JS" \
     -d "username=${MY_AUTH0_USER}" \
     -d "password=${MY_AUTH0_PWD}" \
     -d "grant_type=password" \
     -d "scope=offline_access" \
     "https://akvofoundation.eu.auth0.com/oauth/token"
