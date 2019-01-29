import pandas as pd
from datetime import datetime

file = [
    'gc_2019-01-29T18:31:38.568Z_11_thuy.csv',
    'gc_2019-01-29T18:31:38.568Z_217_nguyen.csv',
    'gc_2019-01-29T18:31:38.568Z_222_hoan.csv',
    'gc_2019-01-29T18:31:38.568Z_226_thuyhangdili.csv',
    'gc_2019-01-29T18:31:38.568Z_228_myhieu25021988.csv',
    'gc_2019-01-29T18:31:38.568Z_230_caoduongthanhhnd.csv',
    'gc_2019-01-29T18:31:38.568Z_231_trang123.csv',
    'gc_2019-01-29T18:31:38.568Z_233_hai123.csv',
    'gc_2019-01-29T18:31:38.568Z_234_phuc123.csv',
    'gc_2019-01-29T18:31:38.568Z_235_myhoa.csv',
    'gc_2019-01-29T18:31:38.568Z_236_duc123.csv',
    'gc_2019-01-29T18:31:38.568Z_237_Trung123.csv',
    'gc_2019-01-29T18:31:38.568Z_238_Linh123.csv',
    'gc_2019-01-29T18:31:38.568Z_239_xuan123.csv',
    'gc_2019-01-29T18:31:38.568Z_240_adminxk.csv',
    'gc_2019-01-29T18:31:38.568Z_9_camau.csv',
]

def converter(source):
    new_name = 'rev/gc_' + datetime.strftime(datetime.now(), format='%Y-%m-%d') + '_' + source.split('_')[3]
    df = pd.read_csv(source,names=['id','name','aid','agency','cid','commodity','cids','unit'])
    new_col = ['a','comm','price_type']
    vs = df['commodity'].str.split(',', expand=True).rename(columns = lambda x: new_col[x])
    res = pd.concat([df, vs], axis=1, join='inner')
    res = res[['aid','agency','cid','comm','price_type']]
    data = []
    cid = 0

    for index, row in res.iterrows():
        if cid is not 0:
            cids = str(cid) + '-' + str(row['cid'])
            data.append({'aid':row['aid'], 'agency':row['agency'], 'cid':cids, 'commodity':row['comm']})
            cid = 0
        else:
            cid = row['cid']

    result = pd.DataFrame(data)
    final_data = result.reindex(['aid','agency','cid','commodity'], axis=1)
    final_data.to_csv(new_name, encoding='utf-8', index=False)
    print(new_name + ', saved!')
    return True

for fl in file:
    converter('csv/'+fl)

