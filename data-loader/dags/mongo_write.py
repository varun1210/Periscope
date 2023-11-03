from datetime import datetime
import certifi
import json

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from constant_variables import PROCESSED_FILE_BASE_PATH
from constant_variables import MONGO_USERNAME
from constant_variables import MONGO_PASSWORD
from constant_variables import MONGO_DATABASE_NAME
from constant_variables import MONGO_COLLECTION_NAME
# from constant_variables import PROCESSED_TEST_BASE_PATH


def read_json():
    with open('{processed_file_path}processed_{current_date}.json'.format(processed_file_path=PROCESSED_FILE_BASE_PATH, current_date=datetime.now().strftime("%d_%m_%Y")), 'r') as file:
        processed_contents = json.load(file)
        jobs_list = processed_contents['data']
        return jobs_list


def insert_to_mongo():
    connection_uri = "mongodb+srv://{username}:{password}@backenddatacluster.4jq8lxk.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp".format(username=MONGO_USERNAME, password=MONGO_PASSWORD)
    client = MongoClient(connection_uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())
    jobs_db = client[MONGO_DATABASE_NAME]
    jobs_collection = jobs_db[MONGO_COLLECTION_NAME]
    jobs_dict_list = read_json()
    jobs_collection.insert_many(jobs_dict_list)
    return True

# insert_to_mongo()
    



    