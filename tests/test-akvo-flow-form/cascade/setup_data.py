import sqlite3


class Setup:
    def __init__(self, cascade_id):
        self.cascade_id = str(cascade_id)
        self.db_connection = sqlite3.connect(
            'data/cascade-'+self.cascade_id+'-v1.sqlite')

    def db_exec(self, query, use_row_factory=False):
        if use_row_factory:
            self.db_connection.row_factory = sqlite3.Row
        cursor = self.db_connection.cursor()
        cursor.execute(query)
        return cursor

    def fetch_api(self, parent_id):
        import requests
        return requests.get('https://tech-consultancy.akvo.org/akvo-flow-web-api/cascade/seap/cascade-6275403559731200-v1.sqlite/0')
