from datetime import datetime
import pandas as pd

class Printer:

    def get_time(self):
        now = datetime.now().time().strftime("%H:%M:%S")
        return now

    def get_path(self, base_url):
        path = ''
        if base_url == 'tech-consultancy.akvotest.org':
            path = '/appsa-api'
        return path

    def get_uuid(self, data):
        self.data = data
        validator = list(filter(None, data))
        validator = pd.DataFrame(validator).dropna().drop(columns=['type']).groupby(
            ['result','indicator_id','dimension','period','country']
        ).first().reset_index()
        input_index = ['result','indicator_id','period']
        validator = validator[input_index].sort_values(input_index).astype(str)
        validator['validator'] = validator.apply('-'.join, axis=1)
        validator = validator['validator'].to_list()
        return validator
