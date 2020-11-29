docker run -it -p 5000:5000 \
    --env BASIC_ADMIN=akvo \
    --env BASIC_PWD=webform \
    --env FLOW_SERVICE_URL=$FLOW_SERVICE_URL \
    --env AUTH0_URL=$AUTH0_URL \
    --env AUTH0_CLIENT_FLOW=$AUTH0_CLIENT_FLOW \
    --env AUTH0_USER=$AUTH0_USER \
    --env AUTH0_PWD=$AUTH0_PWD \
    --env SQLALCHEMY_DATABASE_URI=$SQLALCHEMY_DATABASE_URI \
    akvo-flow-web-api python app.py
