from sqlalchemy import create_engine, Column, BigInteger, Integer, Text, String
# from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from app.connection import engine_url

engine_url = engine_url()
engine = create_engine(engine_url)
Base = declarative_base()

class Countries(Base):

    __tablename__ = "countries"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(Text)
    code = Column(Text, nullable=True)

    def __init__(self, data):
        self.name = data['name']
        self.code = data['code']

    def __repr__(self):
        return "<Country(id={}, name={}, code={})>".format(
                self.id, self.name, self.code)

class Groups(Base):

    __tablename__ = "groups"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    parent_id = Column(BigInteger, nullable=True)
    name = Column(Text)
    code = Column(Text, nullable=True)

    def __init__(self, data):
        self.parent_id= data['parent_id']
        self.name = data['name']
        self.code = data['code']

    def __repr__(self):
        return "<Group(parent_id={}, name={}, code={})>".format(self.parent_id, self.name, self.code)

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
    description = Column(Text)

    def __init__(self, data):
        self.parent_id = data['parent_id']
        self.code = data['code']
        self.name = data['name']
        self.type = data['type']
        self.description = data['description']

    def __repr__(self):
        return "<Value(id={}, parent_id={}, code={}, name={}, type={},  description={})>".format(
                self.id, self.parent_id, self.code, self.name, self.type, self.description)

class DatapointValues(Base):

    __tablename__ = "datapoint_values"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    value_id = Column(BigInteger)
    datapoint_id = Column(BigInteger)

    def __init__(self, data):
        self.value_id = data['value_id']
        self.datapoint_id = data['datapoint_id']

    def __repr__(self):
        return "<DatapointValues(id={}, value_id={}, datapoint_id={})>".format(
                self.id, self.country_id, self.value_id)

class DatapointCountries(Base):

    __tablename__ = "datapoint_countries"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    country_id = Column(BigInteger)
    datapoint_id = Column(BigInteger)

    def __init__(self, data):
        self.country_id = data['country_id']
        self.datapoint_id = data['datapoint_id']

    def __repr__(self):
        return "<DatapointCountries(id={}, country_id={}, datapoint_id={})>".format(
                self.id, self.country_id, self.datapoint_id)


class Datapoints(Base):

    __tablename__ = "datapoints"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    uuid = Column(Text, nullable=False)
    phase = Column(Integer, nullable=False)
    funds = Column(BigInteger, nullable=True)
    contribution = Column(BigInteger, nullable=True)

    def __init__(self, data):
        self.uuid = data['uuid']
        self.funds = data['funds']
        self.contribution = data['contribution']
        self.phase = data['phase']

    def __repr__(self):
        return "<Datapoints(id={}, uuid={}, phase={}, funds={}, contribution={})>".format(
                self.id, self.uuid, self.phase, self.funds, self.contribution)


class Questions(Base):

    __tablename__ = "questions"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    parent_id = Column(BigInteger, nullable=True)
    value_id = Column(BigInteger, nullable=True)
    code = Column(Text)
    name = Column(Text)
    type = Column(Text)

    def __init__(self, data):
        self.parent_id = data['parent_id']
        self.value_id = data['value_id']
        self.code = data['code']
        self.name = data['name']
        self.type = data['type']

    def __repr__(self):
        return "<Questions(id={}, parent_id={}, value_id={}, code={}, name={}, type={})>".format(
                self.id, self.parent_id, self.value_id, self.code, self.name, self.type)


class Answers(Base):

    __tablename__ = "answers"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    datapoint_id = Column(BigInteger)
    question_id = Column(BigInteger)
    value = Column(Text, nullable=True)

    def __init__(self, data):
        self.datapoint_id = data['datapoint_id']
        self.question_id = data['question_id']
        self.value = data['value']

    def __repr__(self):
        return "<Answers(id={}, datapoint_id={}, question_id={}, value={})>".format(
                self.id, self.datapoint_id, self.question_id, self.value)

class Translations(Base):

    __tablename__ = "translations"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    translationable_type = Column(String)
    translationable_id = Column(BigInteger)
    lang = Column(Text)
    text = Column(Text)

    def __init__(self, data):
        self.translationable_type = data['type']
        self.translationable_id = data['translationable_id']
        self.lang = data['lang']
        self.text = data['text']

    def __repr__(self):
        return "<Translations(id={}, translationable_type={}, translationable_id={}, lang={}, text={})>".format(
                self.id, self.translationable_type, self.translationable_id, self.lang, self.text)
