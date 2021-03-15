#!/usr/bin/env python

import pandas as pd
import requests as r
import sys
import os
global questions
global trans

lang = {"name": "deutsch", "id": "de"}
gtrans = "g-" + lang["name"]
qtrans = "q-" + lang["name"]
qotrans = "o-" + lang["name"]
qttrans = "t-" + lang["name"]

if 'INSTANCE' not in os.environ or 'FID' not in os.environ:
    print("Wrong Input")
    print("Example: -e INSTANCE=<instance_name> -e FID=<form_id>")
    exit(0)


questions = []
form_instance = os.environ['INSTANCE']
form_id = os.environ['FID']

api = "https://tech-consultancy.akvo.org/akvo-flow-web-api"
form = r.get("{}/{}/{}/update".format(api,form_instance,form_id))
form = form.json()

def remove_html_markup(s):
    tag = False
    quote = False
    out = ""
    for c in s:
            if c == '<' and not quote:
                tag = True
            elif c == '>' and not quote:
                tag = False
            elif (c == '"' or c == "'") and tag:
                quote = not quote
            elif not tag:
                out = out + c
    return out

def get_tooltip(qst):
    helper = "";
    try:
        helper = qst["help"]["text"]
        for custom in ["##MULTICASCADE##","##UNIT##"]:
            if custom in helper:
                helper = helper.split(custom)[0]
    except:
        pass
    return helper

def get_trans(data):
    otrans = None
    try:
        otrans = data["altText"]["text"]
    except:
        pass
    try:
        otrans_arr = data["altText"][0]["text"]
        otrans = otrans_arr
    except:
        pass
    try:
        otrans_arr = data["altText"][1]["text"]
        otrans = otrans_arr
    except:
        pass
    return otrans

def get_question(q, qg, qgi):
    global questions
    global lang
    qgi = qgi + 1
    tooltip = get_tooltip(q)
    dependency = None
    dependency_answer = None
    trans = get_trans(q)
    help_trans = None
    try:
        dependency = q["dependency"]["question"]
        dependency_answer = q["dependency"]["answer-value"]
    except:
        pass
    try:
        help_trans = get_trans(q["help"])
    except:
        pass
    qtype = q["type"]
    if q["type"] == "option":
        qtype = "option"
        if type(q["options"]["option"]) == list:
            for io, o in enumerate(q["options"]["option"]):
                questions.append({
                    "gid": qgi,
                    "gname": qg["heading"],
                    gtrans: get_trans(qg),
                    "repeat": qg["repeatable"],
                    "id": int(q["id"]),
                    "order": int(q["order"]),
                    "qname": q["text"],
                    qtrans: trans,
                    "type": qtype,
                    "tooltip": tooltip,
                    qttrans: help_trans,
                    "option_id": io + 1,
                    "option": o["text"],
                    qotrans: get_trans(o),
                    "dependency": dependency,
                    "dependency_answer": dependency_answer
                })
        if type(q["options"]["option"]) == dict:
            questions.append({
                "gid": qgi,
                "gname": qg["heading"],
                gtrans: get_trans(qg),
                "repeat": qg["repeatable"],
                "id": int(q["id"]),
                "order": int(q["order"]),
                "qname": q["text"],
                qtrans: trans,
                "type": qtype,
                "tooltip": tooltip,
                qttrans: help_trans,
                "option_id": 1,
                "option": q["options"]["option"]["text"],
                qotrans: get_trans(q["option"]["option"]),
                "dependency": dependency,
                "dependency_answer": dependency_answer
            })
    if q["type"] == "free":
        qtype = "free"
        try:
            qtype = q["validationRule"]["validationType"]
            if q["validationRule"]["allowDecimal"] == True:
                qtype = "decimal"
        except:
            pass
    if qtype == "free" or qtype == "geo" or qtype == "numeric" or qtype == "decimal" or qtype == "cascade":
        questions.append({
            "gid": qgi,
            "gname": qg["heading"],
            gtrans: get_trans(qg),
            "repeat": qg["repeatable"],
            "id": int(q["id"]),
            "order": int(q["order"]),
            "qname": q["text"],
            qtrans: trans,
            "type": qtype,
            "tooltip": tooltip,
            qttrans: help_trans,
            "option_id": None,
            "option": None,
            qotrans: None,
            "dependency": dependency,
            "dependency_answer": dependency_answer
        })

if type(form["questionGroup"]) == list:
    for qgi, qg in enumerate(form["questionGroup"]):
        if type(qg["question"]) == list:
            for q in qg["question"]:
                get_question(q, qg, qgi)
        if type(qg["question"]) == dict:
            get_question(qg["question"], qg, qgi)
if type(form["questionGroup"]) == dict:
    if type(form["questionGroup"]["question"]) == list:
        for q in form["questionGroup"]["question"]:
            get_question(q, form["questionGroup"], 0)
    if type(form["questionGroup"]["question"]) == dict:
        get_question(form["questionGroup"]["question"], form["questionGroup"], 0)

form = pd.DataFrame(questions).sort_values(by=['order','option_id']).fillna(" - ").groupby(
    ['gid','gname',gtrans,'repeat','order','id','qname',qtrans, 'tooltip',qttrans,'type','dependency','dependency_answer','option_id','option',qotrans]
).first()

form.to_excel("{}/{}_form_{}.xlsx".format(os.getcwd(),form_instance,form_id))
