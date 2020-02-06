from sqlalchemy import Table, Column, String, Integer, BigInteger, Text, MetaData, ForeignKey

meta = MetaData()

form = Table(
    'form', meta,
    Column('id', BigInteger, primary_key=True),
)

survey_instance = Table(
    'survey_instance', meta,
    Column('id', BigInteger, primary_key=True),
    Column('identifier', String(16)),
    Column('form_id', BigInteger, ForeignKey('form.id'), ondelete='cascade'),
    Column('submitter', Text),
    Column('device', Text),
    Column('survey_time', Integer)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    survey_instance.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    survey_instance.drop()
