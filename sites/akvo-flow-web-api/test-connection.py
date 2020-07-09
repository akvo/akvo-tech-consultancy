import psycopg2
import os
import time

wait_in_seconds = 2
i = 1
max_attempts = 5
success = False

while i <= max_attempts:
    time.sleep(wait_in_seconds * i)
    try:
        conn = psycopg2.connect(os.environ['SQLALCHEMY_DATABASE_URI'])
        if conn:
            success = True
            break
    except:
        i += 1
if success:
    print('OK')
else:
    print('KO')
