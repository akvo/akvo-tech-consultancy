from sqlalchemy import Table, Column, Integer, Text, MetaData, ForeignKey

meta = MetaData()

survey = Table(
    'survey', meta,
    Column('id', Integer, primary_key=True),
)

form = Table(
    'form', meta,
    Column('id', Integer, primary_key=True),
    Column('survey_id', Integer, ForeignKey('survey.id')),
    Column('name', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    form.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    form.drop()
