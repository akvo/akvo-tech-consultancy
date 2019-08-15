## List of API

| Usage | Endpoint | List of Important Data |
|--|--|--|
| Dropdown, Table Headers | [https://rsr.akvo.org/rest/v1/results_framework/?project=7283](https://rsr.akvo.org/rest/v1/results_framework/?project=7283)  | Result Title, Child Projects, Parent Project, Indicator Title, Dimension Name, Dimension Value, Indicator Periods, Baseline Year |
| Table Value | [https://rsr.test.akvo.org/rest/v1/indicator_period/?limit=100&format=json&indicator__result__project=7283](https://rsr.test.akvo.org/rest/v1/indicator_period/?limit=100&format=json&indicator__result__project=7283)  | Disaggregation and Disaggregation Target, Period Start, Period End |

## Output Report

![Image of Results](https://raw.githubusercontent.com/akvo/akvo-tech-consultancy/master/sites/akvo-rsr-appsa/images/table-results.png)

## Requirement and Feature Request 

- Sync RSR Production to Develop to get new feature of development product along with the project schema that Anabelle set.
- Disaggreation Data (Dimensions) doesn't have clear example JSON Schema unless we fill the data manually.
- List of disagregation childrens. **TBC**
