from sqlalchemy import create_engine, ForeignKey, Column, Integer, BigInteger, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from resources.connection import engine_url
import datetime

engine_url = engine_url()
engine = create_engine(engine_url)
Base = declarative_base()

class Forms(Base):

    __tablename__ = "form"

    id = Column(BigInteger, primary_key=True)
    survey_id = Column(BigInteger, ForeignKey('survey.id'))
    name = Column(Text)
    survey = relationship("Surveys")
    survey_instance = relationship("SurveyInstances")
    question_group = relationship("QuestionGroups")

    def __init__(self, data):
        self.id = int(data['id'])
        self.survey_id = int(data['survey_id'])
        self.name = data['name']

    def __repr__(self):
        return "<Forms(id={}, survey_id={}, name={})>".format(
            self.id, self.survey_id, self.name)

class Surveys(Base):

    __tablename__ = "survey"

    id = Column(BigInteger, primary_key=True)
    name = Column(Text)
    registration_id = Column(BigInteger, nullable=True)
    forms = relationship("Forms")

    def __init__(self, data):
        self.id = int(data['id'])
        self.name = data['name']
        self.registration_id = int(data['registrationFormId'])

    def __repr__(self):
        return "<Survey(id={}, name={}, registration_id={})>".format(
            self.id, self.name, self.registration_id)

class SurveyInstances(Base):

    __tablename__ = "survey_instance"

    id = Column(BigInteger, primary_key=True)
    identifier = Column(Text)
    form_id = Column(BigInteger, ForeignKey('form.id'))
    submitter = Column(Text)
    survey_time = Column(Integer)
    form = relationship('Forms')
    answers = relationship('Answers')

    def __init__(self, data):
        self.id = int(data['id'])
        self.identifier = data['identifier']
        self.form_id = int(data['formId'])
        self.submitter = data['submitter']
        self.survey_time = data['surveyalTime']

    def __repr__(self):
        return "<SurveyInstances(id={}, identifier={}, form_id={}, submitter={}, survey_time={})>".format(
            self.id, self.identifier, self.form_id, self.submitter, self.survey_time)


class QuestionGroups(Base):

    __tablename__ = "question_group"

    id = Column(BigInteger, primary_key=True)
    form_id = Column(BigInteger, ForeignKey('form.id'))
    repeat = Column(Boolean)
    name = Column(Text)
    questions = relationship('Questions', order_by='asc(Questions.id)')
    form = relationship('Forms')

    def __init__(self, data):
        self.id = int(data['id'])
        self.form_id = int(data['form_id'])
        self.repeat = data['repeatable']
        self.name = data['name']

    def __repr__(self):
        return "<QuestionGroups(id={}, form_id={}, repeat={}, name={})>".format(
            self.id, self.form_id, self.repeat, self.name)

class Questions(Base):

    __tablename__ = "question"

    id = Column(BigInteger, primary_key=True)
    form_id = Column(BigInteger, ForeignKey('form.id'))
    question_group_id = Column(BigInteger, ForeignKey('question_group.id'))
    name = Column(Text)
    type = Column(Text)
    question_group = relationship('QuestionGroups')
    form = relationship('Forms')
    answers = relationship('Answers', order_by='asc(Answers.repeat_index)')

    def __init__(self, data):
        self.id = int(data['id'])
        self.form_id = int(data['form_id'])
        self.question_group_id = int(data['group_id'])
        self.name = data['name']
        self.type = data['type']

    def __repr__(self):
        return "<Questions(id={}, form_id={}, question_group_id={}, name={}, type={})>".format(
            self.id, self.form_id, self.question_group_id, self.name, self.type)

class Answers(Base):

    __tablename__ = "answer"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    survey_instance_id = Column(BigInteger, ForeignKey('survey_instance.id'))
    question_id = Column(BigInteger, ForeignKey('question.id'))
    value = Column(Text, nullable=True)
    repeat_index = Column(Integer, nullable=True)
    question = relationship('Questions', order_by='Questions.question_group_id')
    survey_instance = relationship('SurveyInstances')

    def __init__(self, data):
        self.survey_instance_id = int(data['survey_instance_id'])
        self.question_id = int(data['question_id'])
        self.value = str(data['value']) if data['value'] != None else None
        self.repeat_index = str(data['repeat_index']) if data['value'] != None else None

    def __repr__(self):
        return "<Answers(survey_instance_id={}, question_id={}, value={}, repeat_index={})>".format(
            self.survey_instance_id, self.question_id, self.value, self.repeat_index)

class Sync(Base):

    __tablename__ = "sync"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    url = Column(Text)
    data = Column(JSON)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __init__(self, url, data):
        self.url = int(url)
        self.data = data

    def __repr__(self):
        return "<Sync(id={}, url={}, data={} updated_at={})>".format(
            self.id, self.url, self.data, self.updated_at)
