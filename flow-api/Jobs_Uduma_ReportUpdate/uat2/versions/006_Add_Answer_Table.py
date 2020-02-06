from sqlalchemy import Table, Column, Integer, BigInteger, Text, MetaData, ForeignKey

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
    Column('value', Text, nullable=True),
    Column('repeat_index', Integer, nullable=True)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.drop()
