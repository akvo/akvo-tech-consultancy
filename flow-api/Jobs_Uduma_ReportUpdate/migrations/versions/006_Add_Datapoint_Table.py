from sqlalchemy import Table, Column, Integer, Text, MetaData, ForeignKey

meta = MetaData()

instance = Table(
    'instance', meta,
    Column('id', Integer, primary_key=True),
)

datapoint = Table(
    'datapoint', meta,
    Column('id', Integer, primary_key=True),
    Column('instance_id', Integer, ForeignKey('instance.id')),
    Column('submitter', Text),
    Column('device', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    datapoint.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    datapoint.drop()
