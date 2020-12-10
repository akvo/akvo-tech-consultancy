from setup_data import Setup

import pytest

@pytest.fixture(scope="class")
def setup():
    return Setup(7950)

class TestForm:
    def test_both_cached_and_fetched_should_have_same_id(self, setup):
        assert setup.cached.project.id==setup.fetched.project.id

    def test_both_cached_and_fetched_should_have_same_related_project(self, setup):
        assert setup.cached.project.related_project==setup.fetched.project.related_project

    def test_both_cached_and_fetched_should_have_same_related_project(self, setup):
        assert setup.cached.project.results_framework==setup.fetched.project.results_framework


    
    
        

    
