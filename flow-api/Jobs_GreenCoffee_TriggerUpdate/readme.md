## Pre-Installation
- Conda or Miniconda, see [Conda Docs](https://conda.io/docs/)
- NodeJS v7 or above, see [NodeJS Docs](https://nodejs.org/en/)

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

## List of Endpoint
```
// Show folders
$ curl http://127.0.0.1:5000/folders
$ curl http://127.0.0.1:5000/folder/<FOLDER_ID>

// Show survey
$ curl http://127.0.0.1:5000/survey/<SURVEY_ID>

// Show Datapoint 
$ curl http://127.0.0.1:5000/datapoint/<DATAPOINT_ID>

// Show Answers 
$ curl http://127.0.0.1:5000/collections/<SURVEY_ID>/<FORM_ID>

// Download Data 
$ curl http://127.0.0.1:5000/download/<SURVEY_ID>/

// Add Price 
$ curl http://127.0.0.1:5000/addprice/

```
...on progress
