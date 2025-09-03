import random
import string
from datetime import datetime


def get_random_string(length, prefix=None):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(int(length)))
    if prefix:
        return prefix + "_" + result_str
    return result_str


def get_current_time_stamp():
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    return timestamp



