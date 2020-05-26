echo PUBLIC_URL=$PUBLIC_URL > .env
echo REACT_APP_STATIC_USER=$REACT_APP_STATIC_USER >> .env
echo REACT_APP_STATIC_PWD=$REACT_APP_STATIC_PWD >> .env

yarn build
rsync --archive --compress --progress ./build/ siteground:/home/tcakvo/public_html/portfolio
