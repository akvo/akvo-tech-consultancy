OPENID=$(curl -s -d "client_id=curl"\
    -d "username=$KEYCLOAK_USER" \
    -d "password=$KEYCLOAK_PWD" \
    -d "grant_type=password" \
    -d "scope=openid" \
    "https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token")

ACCESS_TOKEN=$(echo $OPENID | jq '.access_token')
REFRESH_TOKEN=$(echo $OPENID | jq '.refresh_token')

#echo "\n"
#echo "ACCESS TOKEN:" $ACCESS_TOKEN
#echo "\n"
#echo "REFRESH TOKEN:" $REFRESH_TOKEN
#echo "\n"
echo $OPENID | jq
