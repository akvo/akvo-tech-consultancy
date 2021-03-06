import re
import pandas as pd
from sqlalchemy import inspect
import logging
import json
from pandas.io import sql
from collections import ChainMap
from resources.models import Surveys, Forms, QuestionGroups, Questions, SurveyInstances

def write_data(session, input_data, info, log):
    try:
        session.add(input_data)
        if log:
            logging.warn('SAVING: {} '.format(log))
        return session.commit()
    except:
        if log:
            print('ERROR: ABORTING {} '.format(log))
        session.rollback()
        raise

def table_column_regex(name, id):
    regex = re.compile('[,-\.!?%()""]')
    name = regex.sub('', name).lower()
    name = ' '.join(name.split()).replace(' ','_')
    return '{}_{}'.format(id, name)

def get_summary(session):
    total_surveys = session.query(Surveys).count()
    total_forms = session.query(Forms).count()
    total_question_groups = session.query(QuestionGroups).count()
    total_questions = session.query(Questions).count()
    total_survey_instances = session.query(SurveyInstances).count()
    print(
        'DATABASE SUMMARY: {}\n\n'\
        '{} SURVEYS\n'\
        '{} FORMS\n'\
        '{} QUESTION GROUPS\n'\
        '{} QUESTIONS\n'\
        '{} SURVEY INSTANCES\n'\
        .format(total_surveys,total_forms,total_question_groups,total_questions, total_survey_instances)
    )

def clear_schema(engine):
    inspector = inspect(engine)
    available_table = inspector.get_table_names(schema='public')
    ignore_table = ['migrate_version','question','survey','form','question_group','answer','survey_instance', 'sync', 'spatial_ref_sys']
    delete_table = list(filter(lambda x: x not in ignore_table, available_table))
    view_list = inspector.get_view_names(schema='public')
    new_views = []
    for view_name in view_list:
        default_views = ['geography_columns','geometry_columns','raster_columns','raster_overviews']
        if view_name not in default_views:
            view_definition = inspector.get_view_definition(view_name, schema='public')
            view_definition = 'CREATE OR REPLACE VIEW ' + view_name + ' AS ' + view_definition
            new_views.append(view_definition)
            sql.execute('DROP VIEW IF EXISTS ' + view_name, engine)
    for tbl in delete_table:
        sql.execute('DROP TABLE IF EXISTS "{}"'.format(tbl), engine)
    return new_views

def repeat_marker(x):
    repeat = x.repeat_index
    col_name = table_column_regex(x.question.name, x.question.id)
    return {col_name:x.value, 'repeat':repeat}

def check_caddisfly(rows):
    for row in rows:
        caddisflies = []
        deletes = []
        for key in row:
            try:
                caddisfly = re.sub(r"([A-Za-z]+)'([A-Za-z]+)", r'', row[key])
                caddisfly = caddisfly.replace("'", "\"")
                caddisfly = json.loads(caddisfly)
                if (caddisfly['type'] == "caddisfly"):
                    deletes.append(key)
                    for cad in caddisfly['result']:
                        name = table_column_regex(cad['name'],key.split('_')[0])
                        if cad['value'] != '':
                            value = '{} {}'.format(cad['value'],cad['unit'])
                            caddisflies.append({name: value})
                    try:
                        name = '{}_caddisfly_image'.format(key)
                        caddisflies.append({name:caddisfly['image']})
                    except:
                        pass
            except:
                pass
        if len(caddisflies) > 0:
            for cad in caddisflies:
                row.update(cad)
        for delete in deletes:
            del row[delete]
    return rows


def generate_pandas_sql(data, table_name, engine):
    data = check_caddisfly(data)
    df = pd.DataFrame(data)
    df = df[sorted(list(df))]
    column_name = dict(ChainMap(*[{x:x.replace('0_','')} for x in list(df)]))
    df = df.rename(columns=column_name)
    df.to_sql(table_name, engine)
    return True

def schema_generator(session, engine):
    table_views = clear_schema(engine)
    form_list = session.query(Forms).all()
    for fm in form_list:
        table_name = table_column_regex(fm.name, fm.id)
        rows = []
        group_rows = {}
        for qg in fm.question_group:
            if qg.repeat:
                qg_ids = [table_column_regex(q.name, q.id) for q in qg.questions]
                qg_name = str(fm.id) + '_repeat_' + table_column_regex(qg.name, qg.id)
                group_rows.update({qg.id:{'ids':qg_ids, 'data':[],'name':qg_name}})
        data = session.query(SurveyInstances).filter(SurveyInstances.form_id == fm.id)
        for dt in data:
            row = list(map(lambda x: repeat_marker(x), dt.answers))
            repeat_row = []
            for a in row:
                if a['repeat'] != 0:
                    repeat_index = a['repeat']
                    repeat_name = [*a][0]
                    repeat_value = {repeat_name : a[repeat_name]}
                    if len(repeat_row) < repeat_index:
                        repeat_row.append(repeat_value)
                    else:
                        index = repeat_index - 1
                        repeat_value.update(repeat_row[index])
                        repeat_row[index].update(repeat_value)
                else:
                    del a['repeat']
            row = dict(ChainMap(*row))
            if len([*group_rows]) > 0:
                for gr in [*group_rows]:
                    for ids in group_rows[gr]['ids']:
                        row[ids] = group_rows[gr]['name']
            row.update({
                '0_identifier':dt.identifier,
                '0_submission_date':dt.submission_date,
                '0_submitter':dt.submitter,
                '0_survey_time':dt.survey_time,
                '0_device':dt.device
            })
            rows.append(row)
            for repeated in repeat_row:
                for gr in [*group_rows]:
                    repeated_instance = {}
                    for ids in group_rows[gr]['ids']:
                        try:
                            repeated_instance.update({ids:repeated[ids]})
                        except:
                            pass
                    repeated_instance.update({
                        '0_identifier':dt.identifier,
                        '0_submission_date':dt.submission_date,
                        '0_submitter':dt.submitter,
                        '0_survey_time':dt.survey_time,
                        '0_device':dt.device
                    })
                    group_rows[gr]['data'].append(repeated_instance)
        if len(rows) > 0:
            generate_pandas_sql(rows, table_name, engine)
            for group_id in [*group_rows]:
                group_data_rows = group_rows[group_id]['data']
                generate_pandas_sql(group_data_rows, group_rows[group_id]['name'], engine)
    if len(table_views) > 0:
        for new_view in table_views:
            sql.execute(new_view, engine)
