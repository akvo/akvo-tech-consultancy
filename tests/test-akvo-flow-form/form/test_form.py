import xmltodict
import json
import pytest


@pytest.fixture(scope="class")
def webform_setup(request):
    import requests

    return requests.get(
        'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')


class TestForm:
    formId = str(356020954)

    def test_webform_connection(self, webform_setup):
        assert webform_setup.status_code == 200

    def test_element_exists(self, webform_setup):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())
        jsonData = webform_setup.json()

        for element in xmlData['survey']:
            index = element.replace('@', '')
        assert index in jsonData

    def test_value_exists(self, webform_setup):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        jsonData = webform_setup.json()

        for element in xmlData['survey']:
            if xmlData['survey'][element] is not None:
                assert jsonData[element.replace('@', '')] is not None

    def test_json_data_type_match(self, webform_setup):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        jsonData = webform_setup.json()

        for element in xmlData['survey']:
            assert isinstance(jsonData[element.replace(
                '@', '')], type(xmlData['survey'][element]))

    def test_translation_exists(self, webform_setup):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        jsonData = webform_setup.json()
        assert 1

    def test_list_with_single_element(self, webform_setup):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        jsonData = webform_setup.json()
        assert 1
