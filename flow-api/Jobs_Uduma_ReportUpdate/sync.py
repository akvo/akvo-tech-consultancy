from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.database import schema_generator
from resources.connection import engine_url

engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()

schema_generator(session, engine)
