from setup_data import Setup

import pytest


@pytest.fixture(scope="class")
def setup():
    return Setup(6275403559731200)


class TestCascade:
    def test_web_cascade_connection(self, setup):
        assert setup.fetch_api(0).status_code == 200

    def test_db_cascade_root_exists(self, setup):
        assert len(setup.db_exec(
            'SELECT * FROM nodes WHERE parent=0').fetchall()) > 0

    def test_number_of_rows_should_match(self, setup):
        db_rows = len(setup.db_exec(
            'SELECT * FROM nodes WHERE parent=0').fetchall())
        json_rows = len(setup.fetch_api(0).json())
        assert db_rows == json_rows

    def test_column_names_should_match(self, setup):
        db_row = setup.db_exec(
            'SELECT * FROM nodes WHERE parent=0', True).fetchone()
        json_row = setup.fetch_api(0).json()[0]

        for column in db_row.keys():
            assert column in json_row

    def test_column_values_should_match(self, setup):
        db_row = setup.db_exec(
            'SELECT * FROM nodes WHERE parent=0', True).fetchone()
        json_row = setup.fetch_api(0).json()[0]

        for column in db_row.keys():
            assert db_row[column] == json_row[column]
