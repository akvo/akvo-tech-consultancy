from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.api import flow_api
from resources.database import clear_schema, schema_generator
from resources.connection import engine_url

api = flow_api()
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()

surveysUrl = []
token = api.get_token()

clear_schema(engine)
schema_generator(session, engine)
api.init_sync(session, token)
