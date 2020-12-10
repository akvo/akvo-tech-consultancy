import json
from util.rsr import Rsr

class Project:
    def __init__(self, id):
        self.id = str(id)

class Cached:
    def __init__(self, project_id):
        self.project = Project(project_id)
        self.project.related_project = self.readcache('related_project/related_project/'+self.project.id)
        self.project.results_framework = self.readcache('results_framework/project/'+self.project.id)
    
    def readcache(self, filename):
        with open('cache/'+filename+'.json', 'r') as f:
            return json.load(f)
    

class Fetched:
    def __init__(self, project_id):
        rsr = Rsr()

        self.project = Project(project_id)
        self.project.related_project = rsr.api('related_project','related_project',project_id)
        self.project.results_framework = rsr.api('results_framework','project',project_id)

class Setup:
    def __init__(self, project_id):
        self.cached = Cached(project_id)
        self.fetched = Fetched(project_id)

        #self.project_id = str(project_id)
        #self.cached = rsr.read('cache/' + self.project_id + '.json')
        #self.fetched = rsr.api('related_project','related_project',project_id)
