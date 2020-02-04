import pandas as pd

pd.options.display.max_columns = 99
df = pd.read_csv('./data-example.csv')
column_names = list(df)

def word_count(strings):
    words = strings.split(' ')
    return len(words)

def category_count(words):
    counts = dict()
    for word in words:
        if word in counts:
            counts[word] += 1
        else:
            counts[word] = 1
    return counts

def get_column_info(df, data):
    col_id = None
    col_name = data
    if '.' in data:
        column = data.split(' ')
        col_id = column[0].replace('.','').upper()
        col_name = ' '.join(column[1:-1])
    col_type = str(df[data].dtypes)
    col_category = []
    if col_type == 'object':
        categories = df[data].unique().tolist()
        for value in categories:
            if type(value) == str:
                if '://' in value or 'UTC' in value or 'www' in value:
                    value = ''
                value = value.replace(' / ','/')
            if type(value) == float:
                pass
            elif '|' in value and type(value) == str:
                categories = value.split('|')
                for cat in categories:
                    col_category.append(cat)
            elif value == '' and value == None:
                pass
            else:
                words = word_count(str(value))
                if words > 30:
                    pass
                else:
                    col_category.append(value)
    if 'link' in data:
        col_category = []
    col_category = '#'.join(col_category)
    col_category = col_category.replace('#',',')
    col_category = col_category.replace('/',',')
    col_category = col_category.replace('),,',')#')
    col_category = col_category.replace(').',')#')
    col_category = col_category.replace('),',')#')
    if '(' in col_category:
        col_category = col_category.split('#')
    else:
        col_category = col_category.split(',')
    category = []
    for cat in col_category:
        if cat == '':
            pass
        else:
            category.append(cat.strip())
    if col_name == 'Unique Response Number':
        category = []
    category = category_count(category)
    col_category = []
    for v in category:
        col_category = col_category
        col_category.append({
            'name':v.strip(','),
            'total': category[v]
        })
    if len(col_category) == 0:
        col_category = None
    return {
        'id': col_id,
        'name': col_name,
        'type': col_type,
        'categories': col_category
    }

col_info = [get_column_info(df, x) for x in column_names]
pd.DataFrame(col_info).to_json('data-info.json', orient='records')
pd.DataFrame(col_info).to_dict('records')

