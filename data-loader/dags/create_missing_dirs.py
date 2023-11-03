import os

from constant_variables import RAW_FILE_BASE_PATH
from constant_variables import PROCESSED_FILE_BASE_PATH

def create_raw_dir():
    if(os.path.exists(RAW_FILE_BASE_PATH)):
        return
    else:
        os.mkdir(RAW_FILE_BASE_PATH)
        return

def create_processed_dir():
    if(os.path.exists(PROCESSED_FILE_BASE_PATH)):
        return
    else:
        os.mkdir(PROCESSED_FILE_BASE_PATH)
        return
    
def create_missing_dirs():
    create_raw_dir()
    create_processed_dir()
    return



# def check_directory_exists()
