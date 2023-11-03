from datetime import datetime
from datetime import timedelta

from airflow.decorators import task
from airflow.decorators import dag

import create_missing_dirs
import generate_raw_dump
import parse_raw_dump
import mongo_write

@dag(
    dag_id="mongo_data_loader",
    start_date=datetime(2023, 1, 1),
    schedule="45 16 10 * *",
    default_args={
        "retry_delay": timedelta(minutes=5)
    }
)

def load_to_mongo():


    @task(task_id="create_dirs")
    def create_dirs():
        create_missing_dirs.create_missing_dirs()
    create_missing_dirs_task = create_dirs()


    @task(task_id="generate_dump")
    def generate_dump():
        generate_raw_dump.generate_job_dump()
    generate_raw_data_task = generate_dump()


    @task(task_id="parse_dump")
    def parse_dump():
        parse_raw_dump.process_raw_dump()
    generate_processed_data_task = parse_dump()


    @task(task_id="write_to_mongo")
    def write_to_mongo():
        mongo_write.insert_to_mongo()
    write_to_mongo_task = write_to_mongo()
        

    create_missing_dirs_task >> generate_raw_data_task >>  generate_processed_data_task >> write_to_mongo_task

load_to_mongo_dag = load_to_mongo()
