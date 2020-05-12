pip install -r requirements.txt
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
echo $TOKEN_PICKLE | base64 -d > token.pickle
python app.py
