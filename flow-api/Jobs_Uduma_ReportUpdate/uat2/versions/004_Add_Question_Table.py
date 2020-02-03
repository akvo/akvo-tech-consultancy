from sqlalchemy import Table, Column, BigInteger, Text, MetaData, ForeignKey

meta = MetaData()

form = Table(
    'form', meta,
    Column('id', BigInteger, primary_key=True),
)

question_group = Table(
    'question_group', meta,
    Column('id', BigInteger, primary_key=True),
)

question = Table(
    'question', meta,
    Column('id', BigInteger, primary_key=True),
    Column('form_id', BigInteger, ForeignKey('form.id')),
    Column('question_group_id', BigInteger, ForeignKey('question_group.id'), ondelete='cascade'),
    Column('name', Text),
    Column('type', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    question.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    question.drop()
