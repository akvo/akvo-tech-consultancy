import os;

def engine_url():
    return "mysql+pymysql://{user}:{pw}@localhost/{db}".format(
            user = "root",
            pw = os.environ["PSQL_PWD"],
            db = "unep")

def write_data(session, input_data, info, log):
    try:
        session.add(input_data)
        if log:
            print('SAVING: {} '.format(log))
        return session.commit()
    except:
        if log:
            print('ERROR: ABORTING {} '.format(log))
        session.rollback()
        raise
