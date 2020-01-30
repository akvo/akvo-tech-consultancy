from sqlalchemy import Table, Column, Integer, Text, MetaData

meta = MetaData()

survey = Table(
    'survey', meta,
    Column('id', Integer, primary_key=True),
    Column('name', Text),
    Column('registration_id', Integer, nullable=True)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    survey.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    survey.drop()
