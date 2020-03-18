from sqlalchemy import create_engine, Column, BigInteger, Text, Integer
# from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from app.connection import engine_url

engine_url = engine_url()
engine = create_engine(engine_url)
Base = declarative_base()

class Countries(Base):

    __tablename__ = "countries"

    id = Column(BigInteger, primary_key=True)
    name = Column(Text)
    code = Column(Text, nullable=True)
    status = Column(Text, nullable=True)

    def __init__(self, data):
        self.name = data['name']
        self.code = data['code']
        self.status = data['status']

    def __repr__(self):
        return "<Country(id={}, name={}, code={}, status={})>".format(
                self.id, self.name, self.code, self.status)

class Groups(Base):

    __tablename__ = "groups"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    parent_id = Column(BigInteger, nullable=True)
    name = Column(Text)
    code = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    def __init__(self, data):
        self.parent_id= data['parent_id']
        self.name = data['name']
        self.code = data['code']
        self.description = data['description']

    def __repr__(self):
        return "<Group(id={}, parent_id={}, name={}, code={}, description={})>".format(
                self.id, self.parent_id, self.name, self.code, self.description)

class CountryGroups(Base):

    __tablename__ = "country_groups"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    country_id = Column(BigInteger)
    group_id = Column(BigInteger)

    def __init__(self, data):
        self.country_id = data['country_id']
        self.group_id = data['group_id']

    def __repr__(self):
        return "<CountryGroups(id={}, country_id={}, group_id={}>".format(
                self.id, self.country_id, self.group_id)

class Values(Base):

    __tablename__ = "values"

    id = Column(BigInteger, primary_key=True, index=True, unique=True)
    parent_id = Column(BigInteger, nullable=True)
    code = Column(Text)
    type = Column(Text)
    name = Column(Text)
    units = Column(Text)
    description = Column(Text)

    def __init__(self, data):
        self.parent_id = data['parent_id']
        self.code = data['code']
        self.name = data['name']
        self.type = data['type']
        self.units = data['units']
        self.description = data['description']

    def __repr__(self):
        return "<Value(id={}, parent_id={}, code={}, name={}, type={}, units={}, description={})>".format(
                self.id, self.parent_id, self.code, self.name, self.type, self.units, self.description)

class CountryValues(Base):

    __tablename__ = "country_values"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    country_id = Column(BigInteger)
    value_id = Column(BigInteger)
    value = Column(Integer)
    description = Column(Text, nullable=True)

    def __init__(self, data):
        self.country_id = data['country_id']
        self.value_id = data['value_id']
        self.value = data['value']
        self.description = data['description']

    def __repr__(self):
        return "<CountryValues(id={}, country_id={}, value_id={}, value={}, description={})>".format(
                self.id, self.country_id, self.value_id, self.value, self.description)
