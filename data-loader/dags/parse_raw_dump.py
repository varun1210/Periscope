from datetime import datetime
import json

from constant_variables import RAW_FILE_BASE_PATH
from constant_variables import PROCESSED_FILE_BASE_PATH
# from constant_variables import RAW_TEST_BASE_PATH
# from constant_variables import PROCESSED_TEST_BASE_PATH


def process_raw_dump():

    with open('{raw_file_path}raw_dump_{current_date}.json'.format(raw_file_path=RAW_FILE_BASE_PATH, current_date=datetime.now().strftime("%d_%m_%Y")), 'r') as file:
        job_dump = json.load(file)

    # job_details_list = []

    return_dict = {
        "status" : False,
        "data" : None
    }

    return_data = []

    for item in job_dump["data"]:

        job_location = None
        if(item["job_is_remote"] == "false"):
            job_location = "Remote"
        else:
            job_location = item["job_city"]

        this_job_details = {
            "company_name" : item["employer_name"],
            "company_website" : item["employer_website"],
            "industry" : item["employer_company_type"],
            "posting_website" : item["job_publisher"],
            "job_title" : item["job_title"],
            "job_apply_link" : item["job_apply_link"],
            "job_description" : item["job_description"],
            "job_location" : job_location,
            "job_state" : item["job_state"],
            "job_country" : item["job_country"],
            "required_experience" : item["job_required_experience"],
            "required_skills" : item["job_required_skills"],
            "required_education" : item["job_required_education"],
            "experience_in_place_of_education" : item["job_experience_in_place_of_education"],
            # "estimated_salaries" : job_dump[item][0]["estimated_salaries"],
            "min_salary" : item["job_min_salary"],
            "max_salary" : item["job_max_salary"]
        }

        return_data.append(this_job_details)

    return_dict["status"] = True
    return_dict["data"] = return_data

    with open('{processed_file_path}processed_{current_date}.json'.format(processed_file_path=PROCESSED_FILE_BASE_PATH, current_date=datetime.now().strftime("%d_%m_%Y")), 'w') as file:
        job_dump = json.dump(return_dict, file)

    return True

# process_raw_dump()



    # print(return_dict)

    # job_details = job_details_list[0]
    # for item in job_details:
    #     print(item)


    # print(job_details_list[0])
    # print(type(job_details_list[0]))
    # job_dump = json.load("./job_dump.json")
    # print(job_dump)
