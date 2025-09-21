import subprocess
from time import sleep


class AppiumManager:
    appium_process = None

    @staticmethod
    def start_appium_server(port):
        appium_arg_string = "-p " + port
        print("Starting Appium Server with args : " + appium_arg_string)
        AppiumManager.appium_process = subprocess.Popen(["appium", appium_arg_string], stdout=subprocess.DEVNULL)
        sleep(5)

    @staticmethod
    def kill_appium_server():
        print("Stopping Appium Server ..")
        AppiumManager.appium_process.terminate()
        sleep(5)
