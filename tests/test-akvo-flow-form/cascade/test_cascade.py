from setup_data import Setup

import pytest


@pytest.fixture(scope="class")
def setup():
    return Setup(6275403559731200)


class TestCascade:
    def test_web_cascade_connection(self, setup):
        assert setup.fetch_api(0).status_code == 200

    def test_db_cascade_root_exists(self, setup):
        cursor = setup.db_exec('SELECT * FROM nodes WHERE parent=0')
        assert len(cursor.fetchall()) > 0
