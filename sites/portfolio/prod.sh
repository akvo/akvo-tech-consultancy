echo PUBLIC_URL=$PORTFOLIO_PUBLIC_URL > .env
echo REACT_APP_STATIC_USER=$PORTFOLIO_REACT_APP_STATIC_USER >> .env
echo REACT_APP_STATIC_PWD=$PORTFOLIO_REACT_APP_STATIC_PWD >> .env

yarn build
rsync --archive --compress --progress ./build/ siteground:/home/tcakvo/public_html/portfolio
