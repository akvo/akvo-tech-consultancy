class Setup:
    def __init__(self, form_id):
        self.form_id = form_id

    def read_xml(self):
        import xmltodict
        with open('data/356020954.xml') as fd:
            self.xmldata = xmltodict.parse(fd.read())

    def fetch_webform(self):
        import requests
        self.webform = requests.get(
            'https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/356020954/update')
