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
* Running on http://127.0.0.1:5000
* type $ sh kill.sh to stop the program

// stop the app 
$ sh kill.sh 
* Stopping the program
```

## Alternative Installation 
```
// using docker
$ docker-compose up 
```

## List of Endpoint
```
// Show folders
$ curl http://127.0.0.1:5000/folders
[
  {
    "link": "http://localhost:5000/folder/XXX",
    "name": "Soil Testing"
  },
  {
    "link": "http://localhost:5000/folder/XXX",
    "name": "Baseline"
  },
  {
    "link": "http://localhost:5000/folder/XXX",
    "name": "Farmer Profiles"
  },
]
```

```
// Show folder content (Survey)
$ curl http://127.0.0.1:5000/folder/<FOLDER_ID>
[
  {
    "created_at": "Wed, 11 Jul 2018 15:35:25 GMT",
    "link": "http://localhost:5000/survey/XXX",
    "modified_at": "Wed, 11 Jul 2018 15:38:02 GMT",
    "name": "XXX"
  },
  {
    "created_at": "Wed, 11 Jul 2018 15:29:34 GMT",
    "link": "http://localhost:5000/survey/XXX",
    "modified_at": "Wed, 11 Jul 2018 15:30:20 GMT",
    "name": "XXX"
  }
]
```

```
// Show survey
$ curl http://127.0.0.1:5000/survey/<SURVEY_ID>
{
  "createdAt": "2018-07-11T15:29:34.887Z",
  "forms": Array[1][
    {
      "name": "Price",
      "path": "http://localhost:5000/collections/34070002/20730003",
      "questionnaire": Array[1][
        {
          "createdAt": "2018-07-11T15:29:47.364Z",
          "id": "30010001",
          "modifiedAt": "2018-07-11T15:29:47.364Z",
          "name": "Add New",
          "questions": Array[4][
            {
              "createdAt": "2018-07-11T15:29:51.252Z",
              "id": "22450001",
              "modifiedAt": "2018-07-11T15:33:12.871Z",
              "name": "Date",
              "order": 1,
              "type": "DATE",
              "variableName": "date"
            },
            {
              "createdAt": "2018-07-11T15:33:04.086Z",
              "id": "26300001",
              "modifiedAt": "2018-07-11T15:33:04.086Z",
              "name": "Details",
              "order": 2,
              "type": "CASCADE",
              "variableName": "details"
            },
            {
              "createdAt": "2018-07-11T15:29:52.656Z",
              "id": "26310001",
              "modifiedAt": "2018-07-11T15:29:52.656Z",
              "name": "Minimum Price",
              "order": 3,
              "type": "NUMBER",
              "variableName": "min_price"
            },
            {
              "createdAt": "2018-07-11T15:29:53.291Z",
              "id": "25600001",
              "modifiedAt": "2018-07-11T15:29:53.291Z",
              "name": "Maximum Price",
              "order": 4,
              "type": "NUMBER",
              "variableName": "max_price"
            }
          ],
          "repeatable": false
        }
      ]
    }
  ],
  "id": "34070002",
  "meta_url": "http://localhost:5000/datapoint/34070002",
  "modifiedAt": "2018-07-11T15:30:20.684Z",
  "name": "admin_10",
  "registrationFormId": ""
}
```

```
// Update Price 
$ curl http://127.0.0.1:5000/collections/<SURVEY_ID>/<FORM_ID>
{
    "device": "Greencoffee - XXX",
    "id": "24450005",
    "identifier": "tb41-n8v1-1hva",
    "login": {
      "id": "XXX",
      "name": "XXX",
      "pass": "XXX"
    },
    "payload": "keymd5=c946415addc376cc50c91956a51823f1&ACC_ID=231&Date_var=12%2F07%2F2018&ID_Commodity=14&ID_Agency=21&min_price=89898.0&max_price=66666.0",
    "response": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<string xmlns=\"http://tempuri.org/\">28226</string>",
    "submited_at": "2018-07-11T18:14:00Z",
    "submitter": "admin"
}
```
...on progress
