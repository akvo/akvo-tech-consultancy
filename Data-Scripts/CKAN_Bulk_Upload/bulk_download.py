{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 53,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import pandas as pd\n",
    "import requests as r\n",
    "from ckanapi import RemoteCKAN, NotAuthorized"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 54,
   "metadata": {},
   "outputs": [],
   "source": [
    "CKAN_APIKEY = os.environ['DEVDATASHARE_APIKEY'] # change with yours\n",
    "CKAN_URL = 'https://dev-datashare.org'"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 55,
   "metadata": {},
   "outputs": [],
   "source": [
    "ua = 'ckanapi/1.0'\n",
    "demo = RemoteCKAN(CKAN_URL, apikey=CKAN_APIKEY, user_agent=ua)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 56,
   "metadata": {},
   "outputs": [],
   "source": [
    "groups = demo.action.group_list()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def reformat(x):\n",
    "    return x.replace('.','-').replace(' ','_').lower()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "for group in groups:\n",
    "    if not os.path.exists(group):\n",
    "        os.makedirs(group)\n",
    "    data = demo.action.group_package_show(id=group)\n",
    "    pd.DataFrame(data).to_excel(group + '/' + group '-info.xlsx', index=None)\n",
    "    for package in data:\n",
    "        subfolder = group + '/' + reformat(package['title'])\n",
    "        if not os.path.exists(subfolder):\n",
    "            os.makedirs(subfolder)\n",
    "            for resource in package['resources']:\n",
    "                filename = subfolder + '/' + resource['name']\n",
    "                file = r.get(resource['url'])\n",
    "                open(filename, 'wb').write(file.content)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.5"
  },
  "toc": {
   "base_numbering": 1,
   "nav_menu": {},
   "number_sections": true,
   "sideBar": true,
   "skip_h1_title": false,
   "title_cell": "Table of Contents",
   "title_sidebar": "Contents",
   "toc_cell": false,
   "toc_position": {},
   "toc_section_display": true,
   "toc_window_display": false
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
