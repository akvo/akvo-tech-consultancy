<p align="center">
<img src="https://miro.medium.com/max/1076/1*k9poV1f4zjhkNS93jo2QTg@2x.png" width="400">
</p>

## Context

- Create a webhook using [Laravel Framework](https://laravel.com/docs) to interact with [Africastalking](https://africastalking.com)
- Fetch forms from Akvo Flow and convert it to the webhook responses message.
- Store the complete responses to database.
- Create cronjob to sync database to Akvo Flow.

<p align="center">
<img src="https://res.cloudinary.com/dbcrzw17s/image/upload/v1549388402/yoda%20course%20artwork/ussd-overview.png" width="600">
</p>



## Other Dependencies

- [GuzzlePHP](http://docs.guzzlephp.org/en/stable/).
- [AfricastalkingPHP](https://github.com/AfricasTalkingLtd/africastalking-php).

## Important Documentations

- [Migrations](https://laravel.com/docs/7.x/migrations).
- [Eloquent ORM](https://laravel.com/docs/7.x/eloquent).
- [Collections](https://laravel.com/docs/7.x/collections).
- [HTTP-Client](https://laravel.com/docs/7.x/http-client).
- [Queues](https://laravel.com/docs/7.x/queues).
- [Task Scheduling](https://laravel.com/docs/7.x/scheduling).
- [Logging](https://laravel.com/docs/7.x/logging).

## Notes
- This webhook should deployed to Kubernetes to perform [The Queues](https://laravel.com/docs/7.x/queues) feature which run by Supervisord.
- Because that, we need to think about where we store the database, pushing data to Flow directly will not sufficient for a huge traffic. MariaDB SQL is preferable instead of PostgreSQL.
