from sqlalchemy import Table, Column, Integer, Text, MetaData, ForeignKey

meta = MetaData()

form = Table(
    'form', meta,
    Column('id', Integer, primary_key=True),
)

question_group = Table(
    'question_group', meta,
    Column('id', Integer, primary_key=True),
)

question = Table(
    'question', meta,
    Column('id', Integer, primary_key=True),
    Column('form_id', Integer, ForeignKey('form.id')),
    Column('question_group_id', Integer, ForeignKey('question_group.id')),
    Column('name', Text),
    Column('type', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    question.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    question.drop()
