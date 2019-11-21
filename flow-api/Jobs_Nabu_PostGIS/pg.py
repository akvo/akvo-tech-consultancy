import json
import os

import psycopg2
import psycopg2.extras

conn = psycopg2.connect(database=os.environ['POSTGRES_DB'], user=os.environ['POSTGRES_USER'],
                        password=os.environ['POSTGRES_PASSWORD'], host=os.environ['POSTGRES_HOST'],
                        port=os.environ['POSTGRES_PORT'])

with open('data-formatted.json', 'r') as f:
    lumen = json.loads(f.read())

cols = lumen['columns']
rows = lumen['rows']

column_types = {
    'text': 'text',
    'date': 'timestamptz',
    'number': 'numeric',
    'geopoint': 'geometry(POINT, 4326)',
}


def primary_key(c):
    if c['key']:
        return ' primary key'
    else:
        return ''


def column_ddl(columns):
    return list(map(lambda x: '"' + x['title'] + '" ' + column_types[x['type']] + primary_key(x), columns))


def gist_index(table_name, column_title):
    return 'CREATE INDEX ON ' + table_name + ' USING GIST ("' + column_title + '");'


def index_ddl(table_name, columns):
    geo = list(filter(lambda x: x['type'] == 'geopoint', columns))
    idxs = list(map(lambda x: gist_index(table_name, x['title']), geo))
    return "\n".join(idxs)


def table_ddl(table_name, columns):
    ddl = 'CREATE TABLE "' + table_name + '" ( '
    ddl += ','.join(column_ddl(columns))
    ddl += ' );\n'
    ddl += index_ddl(table_name, columns)
    return ddl


def cast_value(c):
    if c['type'] == 'date':
        return 'to_timestamp(%s/1000)'
    elif c['type'] == 'geopoint':
        return 'ST_GeomFromText(%s, 4326)'
    return '%s'


def values_template(columns):
    tpl = '('
    tpl += ','.join(list(map(lambda x: cast_value(x), columns)))
    tpl += ')'
    return tpl


def insert_dml(table_name, columns):
    dml = 'INSERT INTO "' + table_name + '" ('
    dml += ','.join(list(map(lambda x: '"' + x['title'] + '"', columns)))
    dml += ')\n'
    dml += 'VALUES %s'
    return dml


def insert_data(table_name, columns, rows):
    cur = conn.cursor()
    sql = insert_dml(table_name, columns)
    template = values_template(columns)
    psycopg2.extras.execute_values(
        cur, sql, rows, template, page_size=100
    )
    conn.commit()

#insert_data('test_3', cols, rows)
