from sqlalchemy import Table, Column, BigInteger, Integer, Text, MetaData, ForeignKey

meta = MetaData()

survey_instance = Table(
    'survey_instance', meta,
    Column('id', BigInteger, primary_key=True),
)

question = Table(
    'question', meta,
    Column('id', BigInteger, primary_key=True),
)

answer = Table(
    'answer', meta,
    Column('id', BigInteger, primary_key=True, autoincrement=True),
    Column('survey_instance_id', BigInteger, ForeignKey('survey_instance.id')),
    Column('question_id', BigInteger, ForeignKey('question.id')),
    Column('value', Text),
    Column('repeat_index', Integer)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.drop()
