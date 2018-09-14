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

## Running App

```
$ php artisan serve
Laravel development server started: <http://127.0.0.1:8000>
```
Otherwise, you can setup your virtual hosts with this value
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
