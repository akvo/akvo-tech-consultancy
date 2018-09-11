# LUMEN TRIGGER UPDATE

Updating Lumen Dataset within Dataset ID `https://<instance_id>.akvolumen.org/api/<dataset_id>` Based on [Update API endpoint #1733](https://github.com/akvo/akvo-lumen/issues/1377). The job is running everyday at **03.00 UTC**. It runs sequently with interval 60 seconds each datasets update and will throws an error when it reach the limit, see **Usage Limits**.

## Usage
Add your instance and dataset id to `datasets.csv`
```
// Clone repository
$ git clone -b develop https://github.com/akvo/akvo-tech-consultancy
// Checkout to your local branch 
$ cd akvo-tech-consultancy
$ git checkout -b feature/<your_branch>
// Edit Datasets
$ vim lumen-api/lumen-trigger-update/datasets.csv
// Push and set upstream
$ git add lumen-api/lumen-trigger-update/datasets.csv
$ git push --set-upstream origin feature/<your_branch>
```
At this point, you are ready to make a pull request to the original repository.


## Usage Limits 
Since Flow API also will also involved during updating process in the background, then we must aware of the usage limits in Lumen's side. Current limit is 5 updates per-instance.
