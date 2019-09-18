from datetime import datetime

class Printer:

    def get_time(self):
        now = datetime.now().time().strftime("%H:%M:%S")
        return now

    def get_path(self, base_url):
        path = ''
        if base_url == 'tech-consultancy.akvotest.org':
            path = '/appsa-api'
        return path
