export KEYCLOAK_USER="KEYCLOAK_USER"
export KEYCLOAK_PWD="KEYCLOAK_PWD"
export TWILLIO_SID="TWILLIO_SID"
export TWILLIO_TOKEN="TWILLIO_TOKEN"
nohup python chatbot.py & echo -e kill $! "\n"rm kill.sh > kill.sh
