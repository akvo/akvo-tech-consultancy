import os

import psycopg2
import psycopg2.extras

conn = psycopg2.connect(database=os.environ['POSTGRES_DB'], user=os.environ['POSTGRES_USER'],
                        password=os.environ['POSTGRES_PASSWORD'], host=os.environ['POSTGRES_HOST'],
                        port=os.environ['POSTGRES_PORT'])

column_types = {
    'text': 'text',
    'date': 'timestamptz',
    'number': 'numeric',
    'geopoint': 'geometry(POINT, 4326)',
    'geoshape': 'geometry(GEOMETRY, 4326)',
    'multiple': 'jsonb',
}


def primary_key(c):
    if 'key' in c and c['key']:
        return ' primary key'
    else:
        return ''


def column_ddl(columns):
    return list(map(lambda x: '"' + x['title'] + '" ' + column_types[x['type']] + primary_key(x), columns))


def gist_index(schema, table_name, column_title):
    return 'CREATE INDEX ON ' + schema + '."' + table_name + '" USING GIST ("' + column_title + '");'


def index_ddl(schema, table_name, columns):
    geo = list(filter(lambda x: x['type'] == 'geopoint', columns))
    idxs = list(map(lambda x: gist_index(schema, table_name, x['title']), geo))
    return "\n".join(idxs)


def table_ddl(schema, table_name, columns):
    ddl = 'CREATE TABLE ' + schema + '."' + table_name + '" ( '
    ddl += ','.join(column_ddl(columns))
    ddl += ' );\n'
    ddl += index_ddl(schema, table_name, columns)
    return ddl


def create_table(schema, table_name, columns):
    cur = conn.cursor()
    sql = table_ddl(schema, table_name, columns)
    cur.execute(sql)
    conn.commit()


def cast_value(c):
    if c['type'] == 'date':
        return 'to_timestamp(%s/1000)'
    elif c['type'] == 'geopoint':
        return 'ST_GeomFromText(%s, 4326)'
    elif c['type'] == 'geoshape':
        return 'ST_GeomFromText(%s, 4326)'
    return '%s'


def values_template(columns):
    tpl = '('
    tpl += ','.join(list(map(lambda x: cast_value(x), columns)))
    tpl += ')'
    return tpl


def insert_dml(schema, table_name, columns):
    dml = 'INSERT INTO ' + schema + '."' + table_name + '" ('
    dml += ','.join(list(map(lambda x: '"' + x['title'] + '"', columns)))
    dml += ')\n'
    dml += 'VALUES %s'
    return dml


def insert_data(schema, table_name, columns, rows):
    cur = conn.cursor()
    sql = insert_dml(schema, table_name, columns)
    template = values_template(columns)
    psycopg2.extras.execute_values(
        cur, sql, rows, template, page_size=200
    )
    conn.commit()


def create_view(view_name, table_name):
    cur = conn.cursor()
    sql = 'CREATE OR REPLACE VIEW public."{}" AS SELECT * FROM import."{}"'.format(view_name, table_name)
    cur.execute(sql)
    conn.commit()


def distinct_location_values(table_name, column_name):
    cur = conn.cursor()
    sql = """
    SELECT DISTINCT split_part("{}",'|',1) AS location
    FROM "{}"
    WHERE "{}" IS NOT NULL;
    """.format(column_name, table_name, column_name)
    cur.execute(sql)
    return cur


def create_location_view(new_view, base_view, location_column, value):
    cur = conn.cursor()
    sql = """
    CREATE OR REPLACE VIEW "{}" AS
    SELECT * FROM "{}" WHERE split_part("{}",'|',1) = '{}';
    """.format(new_view, base_view, location_column, value)
    cur.execute(sql)
    conn.commit()
