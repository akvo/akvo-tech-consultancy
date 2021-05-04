# Beyond Chocolate

## Development

To startup the application stack, run

```
docker-compose up --detach --build
```


To shutdown the application stack, run

```
docker-compose down
```

## Production

The following environment variable is required for the authentication system to work (https://laravel.com/docs/8.x/sanctum).

```sh
SANCTUM_STATEFUL_DOMAINS={full.including.sub.domain.name}
```
