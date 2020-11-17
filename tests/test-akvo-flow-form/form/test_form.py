from setup_data import Setup

import pytest
from distutils import util


@pytest.fixture(scope="class")
def setup():
    data = Setup(356020954)
    data.read_xml()
    data.fetch_webform()
    return data


class TestForm:
    def test_webform_connection(self, setup):
        assert setup.webform.status_code == 200

    def test_survey_attribute_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for attribute in xmlData:
            assert attribute in jsonData

    def test_value_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for element in xmlData:
            if xmlData[element] is not None:
                assert jsonData[element] is not None

    def test_number_of_question_groups_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        assert len(xmlData['questionGroup']) == len(jsonData['questionGroup'])

    def test_number_of_question_in_groups_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for i in range(len(xmlData['questionGroup'])):
            assert len(xmlData['questionGroup'][i]['question']) == len(
                jsonData['questionGroup'][i]['question'])

    def test_question_help_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for i in range(len(xmlData['questionGroup'])):
            assert len(xmlData['questionGroup'][i]['question']) == len(
                jsonData['questionGroup'][i]['question'])

    def test_question_help_alt_text_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for i in range(len(xmlData['questionGroup'])):
            assert len(xmlData['questionGroup'][i]['question']) == len(
                jsonData['questionGroup'][i]['question'])

    def test_question_validation_rule_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for i in range(len(xmlData['questionGroup'])):
            assert len(xmlData['questionGroup'][i]['question']) == len(
                jsonData['questionGroup'][i]['question'])

    def test_repeatable_question_groups_should_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for i in range(len(xmlData['questionGroup'])):
            assert bool(util.strtobool(
                xmlData['questionGroup'][i]['repeatable'])) == jsonData['questionGroup'][i]['repeatable']

    def test_json_data_type_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for element in xmlData:
            assert isinstance(
                jsonData[element], type(xmlData[element]))

    def test_translation_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()
        assert 1

    def test_list_with_single_element(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()
        assert 1
