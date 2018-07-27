## Description 

This services has responsibility to:
- Filter data from Akvo Flow Coffee Price Survey by: User, Sub-Agency, and Date (Latest post if has duplicated value)
- Transforming parameters to API Requirements 
- POST collected data to Green Coffee DB, and returning an ID.

Survey setup:
- Download [Akvo Flow Apps](https://greencoffee.akvoflow.org/app2)
- Create Assignment for all the Device to access specific surveys based on Admin username.
- Start Survey before Cron Job running.

## Pre-Installation
- Conda or Miniconda, see [Conda Docs](https://conda.io/docs/)

## Configuration File
mail to [deden@akvo.org](mailto:deden@akvo.org) to get the configuration file.

## Installation
```
// clone source
$ git clone https://github.com/dedenbangkit/greencoflow

// install environment
$ conda env create -f green-coffee.yml

```

## Usage 
```
// start the app 
$ sh run.sh 
```

## Alternative Installation 
```
// using docker
$ docker run greencoffee 
```

## CI Config 

Deploy when merge develop branch to master.
Running the Job Daily at 03:00 UTC.

Partner:

![Agro Info](https://raw.githubusercontent.com/akvo/akvo-tech-consultancy/develop/api/logo.png)
