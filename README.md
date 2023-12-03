# Periscope

Periscope is a full-stack web application where users can find jobs from leading job boards that best match their resume. The purpose of this build is to apply my experience with different tech stacks and concepts that I have worked with, and also to experiment with tech stacks and concepts that I am continuously learning.

Periscope is a project that has been broken up into three major components (or sub-projects) - frontend, backend, and data loader.

A brief description of the project components is provided below. I will try to update the documentation with every major commit, but it is possible that the documentation may not be up to date with the minute features that I incrementally add.




# Components

## 1. Data Loader

### 1.1. Overview
* Two kinds of data are currently used to power the backend - jobs data obtained from the LinkedIn job board, and user data that drives the functionality for the users. This component focuses on collecting and publishing the job data by extracting it from the job board.
* To obtain the data, I use [this](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/) API to periodically fetch and refresh the database. In the future, I plan to change this to be scraped directly from the job board.
* The data is fetched and loaded into a MongoDB Atlas data store by a data pipeline that I have built using Apache Airflow on Docker.
* Although the data comes mostly cleaned, some preprocessing has been done to make sure the data that is fetched can be used for searches.

### 1.2. Tech Stack
* [Apache Airflow](https://airflow.apache.org/)
* [MongoDB Atlas](https://www.mongodb.com/atlas)
* [Docker](https://www.docker.com/)

### 1.3. Architecture
![ALT Data Loader Architecture Image](https://github.com/varun1210/Periscope/blob/main/data-loader/data_loader.jpg)
* At its core, the data loader is a scheduled Apache Airflow data pipeline that migrates data from an API to a Collection in a MongoDB Atlas data store.
* The data is fetched from the API, preprocessed, timestamped, and loaded to the database every month. The frequency of the update has been arbitrarily chosen.
* The DAG for the pipeline has been represented above. Essentially, it is broken up into four stages. Each of these stages has been modularized into a separate Python script and triggered sequentially.


