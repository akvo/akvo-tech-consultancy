## Description 

This services has responsibility to:
- Filter data from Akvo Flow Coffee Price Survey by: User, Sub-Agency, and Date (latest post if has duplicated value)
- Transforming parameters to IPSARD API format 
- As a hooks to trigger the bulk upload in case any update after automatic trigger task is done.

Survey setup:
- Download [Akvo Flow Apps](https://greencoffee.akvoflow.org/app2)
- Create Assignment for all the Device to access specific surveys based on Admin username.

Script expects 
*KEYCLOAK_USER* and *KEYCLOAK_PWD* set as env variables
