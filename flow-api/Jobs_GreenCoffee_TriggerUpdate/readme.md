
![Agro Info](https://raw.githubusercontent.com/akvo/akvo-tech-consultancy/develop/flow-api/Jobs_GreenCoffee_TriggerUpdate/app/logo.png)

## Description 

This services has responsibility to:
- Filter data from Akvo Flow Coffee Price Survey by: User, Sub-Agency, and Date (Latest post if has duplicated value)
- Transforming parameters to API Requirements 
- POST collected data to Green Coffee DB, and returning an ID.

Survey setup:
- Download [Akvo Flow Apps](https://greencoffee.akvoflow.org/app2)
- Create Assignment for all the Device to access specific surveys based on Admin username.
- Start Survey before Cron Job running.

Script expects 
KEYCLOAK_USER
KEYCLOAK_PWD
set as env variables

## CI Config 

- Deploy when merge develop branch to master.
- Running the Job Daily at 03:00 UTC.
