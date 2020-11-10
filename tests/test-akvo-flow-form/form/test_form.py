from setup_data import Setup

import pytest


@pytest.fixture(scope="class")
def setup():
    data = Setup(356020954)
    data.read_xml()
    data.fetch_webform()
    return data


class TestForm:
    def test_webform_connection(self, setup):
        assert setup.webform.status_code == 200

    def test_element_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for element in xmlData:
            index = element.replace("@", "")
            assert index in jsonData

    def test_value_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for element in xmlData:
            if xmlData[element] is not None:
                assert jsonData[element.replace("@", "")] is not None

    def test_json_data_type_match(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()

        for element in xmlData:
            assert isinstance(
                jsonData[element.replace("@", "")], type(xmlData[element]))

    def test_translation_exists(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()
        assert 1

    def test_list_with_single_element(self, setup):
        xmlData = setup.xmldata["survey"]
        jsonData = setup.webform.json()
        assert 1
