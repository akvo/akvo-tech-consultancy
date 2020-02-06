from sqlalchemy import Table, BigInteger, Column, Text, MetaData, ForeignKey

meta = MetaData()

survey = Table(
    'survey', meta,
    Column('id', BigInteger, primary_key=True),
)

form = Table(
    'form', meta,
    Column('id', BigInteger, primary_key=True),
    Column('survey_id', BigInteger, ForeignKey('survey.id'), ondelete='cascade'),
    Column('name', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    form.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    form.drop()
