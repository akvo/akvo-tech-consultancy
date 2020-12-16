docker run -it -p 5000:5000 \
    --env BASIC_ADMIN=akvo \
    --env BASIC_PWD=secret \
    --env FLOW_SERVICE_URL=$FLOW_SERVICE_URL \
    --env AUTH0_URL=$AUTH0_URL \
    --env SQLALCHEMY_DATABASE_URI='localhost:5432' \
    akvo-flow-web-api python app.py
