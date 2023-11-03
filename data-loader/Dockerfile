FROM apache/airflow:2.7.1
COPY requirements.txt /
ENV AIRFLOW_VERSION=2.7.1
RUN python -m pip install pymongo
RUN pip install --no-cache-dir "apache-airflow==${AIRFLOW_VERSION}" -r /requirements.txt