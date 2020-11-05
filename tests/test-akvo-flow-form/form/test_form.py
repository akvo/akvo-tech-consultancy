import xmltodict
import json
import pytest
import requests as r


class TestForm:
    formId = str(356020954)

    def test_webform_connection(self):
        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        assert webform.status_code == 200

    def test_element_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        jsonData = webform.json()

        for element in xmlData['survey']:
            index = element.replace('@', '')
        assert index in jsonData

    def test_value_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        jsonData = webform.json()

        for element in xmlData['survey']:
            if xmlData['survey'][element] is not None:
                assert jsonData[element.replace('@', '')] is not None

    def test_json_data_type_match(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        jsonData = webform.json()

        for element in xmlData['survey']:
            assert isinstance(jsonData[element.replace(
                '@', '')], type(xmlData['survey'][element]))

    def test_translation_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        jsonData = webform.json()
        assert 1

    def test_list_with_single_element(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        webform = r.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
        jsonData = webform.json()
        assert 1
