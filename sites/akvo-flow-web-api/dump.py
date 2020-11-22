#!/usr/bin/env python

import pandas as pd
import requests as r
import sys
import os
global questions

if len(sys.argv) < 2:
    print("Wrong Input")
    print("Example: dump.py <instance_name> <form_id>")
    exit(0)


questions = []
form_instance = sys.argv[1]
form_id = sys.argv[2]

api = "https://tech-consultancy.akvo.org/akvo-flow-web-api"
form = r.get("{}/{}/{}/update".format(api,form_instance,form_id))
form = form.json()

def get_question(q, qg):
    global questions
    dependency = "None"
    dependency_answer = "None"
    try:
        dependency = q["dependency"]["question"]
        dependency_answer = q["dependency"]["answer-value"]
    except:
        pass
    qtype = "free"
    if q["type"] == "geo":
        qtype = "geo"
    if q["type"] == "free":
        qtype = "free"
        try:
            qtype = q["validationRule"]["validationType"]
            if q["validationRule"]["allowDecimal"] == True:
                qtype = "decimal"
        except:
            pass
    if q["type"] == "option":
        qtype = "option"
        if type(q["options"]["option"]) == list:
            for o in q["options"]["option"]:
                questions.append({
                    "gid": qgi,
                    "gname": qg["heading"],
                    "qname": q["text"],
                    "id": q["id"],
                    "type": qtype,
                    "options": o["text"],
                    "dependency": dependency,
                    "dependency_answer": dependency_answer
                })
        else:
            questions.append({
                "gid": qgi,
                "gname": qg["heading"],
                "qname": q["text"],
                "id": q["id"],
                "type": qtype,
                "options": q["options"]["option"]["text"],
                "dependency": dependency,
                "dependency_answer": dependency_answer
            })
    if qtype == "free" or qtype == "geo":
        questions.append({
            "gid": qgi,
            "gname": qg["heading"],
            "id": q["id"],
            "qname": q["text"],
            "type": qtype,
            "options": "None",
            "dependency": dependency,
            "dependency_answer": dependency_answer
        })

if type(form["questionGroup"]) == list:
    for qgi, qg in enumerate(form["questionGroup"]):
        if type(qg["question"]) == list:
            for q in qg["question"]:
                get_question(q, qg)
        if type(qg["question"]) == dict:
            get_question(qg["question"], qg)
if type(form["questionGroup"]) == dict:
    if type(form["questionGroup"]["question"]) == list:
        for q in form["questionGroup"]["question"]:
            get_question(q, form["questionGroup"])
    if type(form["questionGroup"]["question"]) == dict:
        get_question(form["questionGroup"]["question"], form["questionGroup"])

form = pd.DataFrame(questions).groupby(
    ['gid','gname','id','qname','type','dependency','dependency_answer','options']
).first()

form.to_excel("{}/{}_form_{}.xlsx".format(os.getcwd(),form_instance,form_id))

