from sqlalchemy import Table, Column, Integer, Text, MetaData, ForeignKey

meta = MetaData()

datapoint = Table(
    'datapoint', meta,
    Column('id', Integer, primary_key=True),
)

question = Table(
    'question', meta,
    Column('id', Integer, primary_key=True),
)

answer = Table(
    'answer', meta,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('datapoint_id', Integer, ForeignKey('datapoint.id')),
    Column('question_id', Integer, ForeignKey('question.id')),
    Column('value', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    answer.drop()
