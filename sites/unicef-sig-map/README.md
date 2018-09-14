# SIG MAP
Built with Laravel 5.6, LeafletJS, D3JS, Echart & Jquery

## Requirements
- PHP >= 7.1.3
- OpenSSL PHP Extension
- PDO PHP Extension
- Mbstring PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension
- Ctype PHP Extension
- JSON PHP Extension
- Composer
- NodeJS v8.12.0 (Latest & LTS)

## Installation

```
// Installing Package Dependencies
$ composer install
$ npm install

// Compiling Assets
$ npm run production

// Generate Key
$ php artisan key:generate
```
## Test
```
// Code Clean & Controversial
$ composer unicef-test

// Standard Eslint
$ npm run unicef-test
```

## Running App

### Development / Test
```
$ php artisan serve
Laravel development server started: <http://127.0.0.1:8000>
```

### Production

**Using HTTPD or Apache 2**

Setup the virtual hosts with this value
Example setup:
```
<VirtualHost *:80>
    	DocumentRoot "/Users/yourname/Sites/unicef-sig-map/public"
	    ServerName localhost
	<directory "/Users/yourname/Sites/unicef-sig-map/public">
		AllowOverride All
		Order allow,deny
		Allow from all
	</directory>
</VirtualHost>
```
Assuming that you have this folder inside Sites folder.

**Using NGINX**

If you are deploying your application to a server that is running Nginx, you may use the following configuration file as a starting point for configuring your web server. Most likely, this file will need to be customized depending on your server's configuration.
Example setup:
```
server {
    listen 80;
    server_name example.org;
    root /unicef-sig-map/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
