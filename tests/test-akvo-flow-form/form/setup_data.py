class Setup:
    def __init__(self, form_id):
        self.form_id = str(form_id)

    def read_xml(self):
        import xmltodict
        with open("data/" + self.form_id + ".xml") as fd:
            self.xmldata = xmltodict.parse(fd.read())

    def fetch_webform(self):
        import requests
        self.webform = requests.get("https://tech-consultancy.akvo.org/akvo-flow-web-api/seap/" + self.form_id + "/update")
