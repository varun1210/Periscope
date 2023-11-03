import requests
import json
from datetime import datetime

from constant_variables import API_KEY
from constant_variables import API_HOST_NAME
from constant_variables import JOB_SEARCH_URL
from constant_variables import JOB_DETAILS_URL
from constant_variables import RAW_FILE_BASE_PATH
# from constant_variables import RAW_TEST_BASE_PATH


def find_job_ids(job_title, job_location):
    querystring = "{job_title}, {job_location}".format(job_title=job_title, job_location=job_location)
    url = JOB_SEARCH_URL
    querystring = {"query":"Software Engineer, United States","page":"1","num_pages":"10"}
    headers = {
	    "X-RapidAPI-Key": API_KEY,
	    "X-RapidAPI-Host": API_HOST_NAME
    }
    response = requests.get(url=url, headers=headers, params=querystring)
    job_postings = response.json()['data']
    job_ids = []
    for job_posting in job_postings:
        job_ids.append(job_posting['job_id'])
    return job_ids

def jobs_details(job_ids_list):
    # detailed_jobs_info = []
    url = JOB_DETAILS_URL
    detailed_jobs_list = []
    return_dict = {"status" : False, "data" : None}
    # job_ids_list = [job_ids_list[0]]
    # counter = 0
    for job_id in job_ids_list:
        # if(counter == 1):
        #     break
        # print("The job ID is: " + job_id)
        querystring = {"job_id":job_id, "extended_publisher_details":"false"}
        headers = {
	        "X-RapidAPI-Key": API_KEY,
	        "X-RapidAPI-Host": API_HOST_NAME
        }
        response = requests.get(url=url, headers=headers, params=querystring)
        # print(response.json())
        fetched_details = response.json()['data'][0]
        detailed_jobs_list.append(fetched_details)
        # pulled_jobs[counter] = return_json
        # counter += 1
    return_dict["status"] = True
    return_dict["data"] = detailed_jobs_list
    return return_dict
    # with open('result.json', 'w') as fp:
    # json.dump(sample, fp)

def write_to_file(formatted_api_return):
    with open('{raw_file_path}raw_dump_{current_date}.json'.format(raw_file_path=RAW_FILE_BASE_PATH, current_date=datetime.now().strftime("%d_%m_%Y")), 'w') as file:
        json.dump(formatted_api_return, file)
    return 

def generate_job_dump():
    search_params = {"job_title" : "Software Engineer", "job_location" : "United States"}
    job_ids = find_job_ids(search_params['job_title'], search_params['job_location'])
    job_details_dict = jobs_details(job_ids)
    write_to_file(job_details_dict)
    return True

# generate_job_dump()
    





    


    





