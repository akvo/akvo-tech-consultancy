import os
import smtplib
import subprocess
import sys
from glob import glob
from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart

sender = os.environ['KEYCLOAK_USER']
gmail_password = os.environ['KEYCLOAK_PWD']
zip_password = os.environ['ZIP_PWD']
files = glob('./result/*.*')
zip_file = 'testing.zip'

recipients = ['deden@akvo.org']
outer = MIMEMultipart()
outer['Subject'] = 'Title Email'
outer['To'] = ', '.join(recipients)
outer['From'] = sender
outer.preamble = 'You will not see this in a MIME-aware mail reader.\n'
body = 'Hi Bro,\n This is Deden!\n'
body = MIMEText(body)

rc = subprocess.call(['7z', 'a', '-p' + zip_password, '-y', zip_file] + files)
attachments = [zip_file]

for file in attachments:
    try:
        with open(file, 'rb') as fp:
            msg = MIMEBase('application', "octet-stream")
            msg.set_payload(fp.read())
            encoders.encode_base64(msg)
            msg.add_header('Content-Disposition', 'attachment', filename=os.path.basename(file))
            outer.attach(msg)
    except:
        print("Unable to open one of the attachments. Error: ", sys.exc_info()[0])
        raise

outer.attach(body)
composed = outer.as_string()

try:
    with smtplib.SMTP('smtp.gmail.com', 587) as s:
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(sender, gmail_password)
            s.sendmail(sender, recipients, composed)
            s.quit()
    print("Email sent!")
except:
    print("Unable to send the email. Error: ", sys.exc_info()[0])
    raise
