# Flow Bulk Image Downloader


## Requirements:

- Python 3.6 >
- [Python Pandas](https://pypi.org/project/pandas/)

## Insallation:

```

$ pip install -r requirements.txt 

```

## Usage

- Edit Config

```
# In file flow_image_downloader.py

FOLDER_PATH = ''
DATA_CLEANING = ''
IMAGE_QUESTION = '111340928|Take a picture of the house'
FILENAME_FORMAT = ['Display Name','Submission Date', IMAGE_QUESTION]

```

- Run the task

```

$ python flow_image_downloader.py

```
