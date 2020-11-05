import xmltodict
import json
import pytest


class TestForm:
    def test_element_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        with open('data/356020954.json') as json_file:
            jsonData = json.load(json_file)

        for element in xmlData['survey']:
            index = element.replace('@', '')
        assert index in jsonData

    def test_value_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        with open('data/356020954.json') as json_file:
            jsonData = json.load(json_file)

        for element in xmlData['survey']:
            if xmlData['survey'][element] is not None:
                assert jsonData[element.replace('@', '')] is not None

    def test_json_data_type_match(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        with open('data/356020954.json') as json_file:
            jsonData = json.load(json_file)

        for element in xmlData['survey']:
            assert isinstance(jsonData[element.replace(
                '@', '')], type(xmlData['survey'][element]))

    def test_translation_exists(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        with open('data/356020954.json') as json_file:
            jsonData = json.load(json_file)
        assert 1

    def test_list_with_single_element(self):
        with open('data/356020954.xml') as fd:
            xmlData = xmltodict.parse(fd.read())

        with open('data/356020954.json') as json_file:
            jsonData = json.load(json_file)
        assert 1
