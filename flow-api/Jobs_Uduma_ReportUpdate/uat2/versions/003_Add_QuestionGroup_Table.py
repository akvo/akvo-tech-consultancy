from sqlalchemy import Table, Column, BigInteger, Text, Boolean, MetaData, ForeignKey

meta = MetaData()

form = Table(
    'form', meta,
    Column('id', BigInteger, primary_key=True),
)

question_group = Table(
    'question_group', meta,
    Column('id', BigInteger, primary_key=True),
    Column('form_id', BigInteger, ForeignKey('form.id'), ondelete='cascade'),
    Column('repeat', Boolean),
    Column('name', Text)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    question_group.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    question_group.drop()
