from sqlalchemy import Table, Column, Integer, Text, MetaData, ForeignKey

meta = MetaData()

survey = Table(
    'survey', meta,
    Column('id', Integer, primary_key=True),
)

instance = Table(
    'instance', meta,
    Column('id', Integer, primary_key=True),
    Column('survey_id', Integer, ForeignKey('survey.id')),
    Column('identifier', Text),
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    instance.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    instance.drop()
