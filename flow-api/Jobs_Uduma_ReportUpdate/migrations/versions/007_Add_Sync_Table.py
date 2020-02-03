from sqlalchemy import Table, Column, BigInteger, Text, MetaData, DateTime, JSON
import datetime

meta = MetaData()

sync = Table(
    'sync', meta,
    Column('id', BigInteger, primary_key=True, autoincrement=True),
    Column('url', Text),
    Column('data', JSON),
    Column('updated_at', DateTime, default=datetime.datetime.utcnow)
)

def upgrade(migrate_engine):
    meta.bind = migrate_engine
    sync.create()

def downgrade(migrate_engine):
    meta.bind = migrate_engine
    sync.drop()
