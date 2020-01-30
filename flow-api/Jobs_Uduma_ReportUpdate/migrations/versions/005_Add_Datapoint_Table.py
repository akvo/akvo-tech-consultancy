from sqlalchemy import Table, Column, String, Integer, Text, MetaData, ForeignKey

meta = MetaData()

form = Table(
    'form', meta,
    Column('id', Integer, primary_key=True),
)

datapoint = Table(
    'datapoint', meta,
    Column('id', Integer, primary_key=True),
    Column('identifier', String(16)),
    Column('form_id', Integer, ForeignKey('form.id')),
    Column('submitter', Text),
    Column('device', Text),
    Column('survey_time', Integer)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    datapoint.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    datapoint.drop()
