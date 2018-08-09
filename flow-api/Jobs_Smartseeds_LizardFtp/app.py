import os
from ftplib import FTP

ftp_user = os.environ('FTP_USER')
ftp_pwd = os.environ('FTP_PWD')
session = FTP('ftp.nelen-schuurmans.nl',ftp_pwd,ftp_pwd)
json_file = './result/test.txt'

file = open(json_file,'rb')
session.storbinary('STOR /incoming/02_AKVO/' + json_file, file)
file.close()
session.quit()

