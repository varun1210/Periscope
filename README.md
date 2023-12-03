# Periscope

Periscope is a full-stack web application where users can find jobs from leading job boards that best match their resume. I am building this to experiment with different tech stacks and concepts that I learn.

Periscope is a project that has been broken up into three major components - frontend, backend, and data loader.


# Components

## 1. Data Loader

### 1.1 Data Loader Overview
* Two kinds of data are currently used to power the backend - jobs data obtained from the LinkedIn job board, and user data that drives the functionality for the users. This component focuses on collecting and publishing the job data by extracting it from the job board.
* To obtain the data, I use [this](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/) API to periodically fetch and refresh the database. In the future, I plan to change this to be scraped directly from the job board.
* The data is fetched and loaded into a MongoDB Atlas data store by a data pipeline that I have built using Apache Airflow on Docker.
* Although the data comes mostly cleaned, some preprocessing has been done to make sure the data that is fetched can be used for searches.

### 2. Data Loader Architecture


