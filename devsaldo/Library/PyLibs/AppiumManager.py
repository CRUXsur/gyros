import subprocess
from time import sleep


class AppiumManager:
    appium_process = None

    @staticmethod
    def start_appium_server(port):
        print(f"Starting Appium Server on port: {port}")
        AppiumManager.appium_process = subprocess.Popen(["appium", "-p", port], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        sleep(5)

    @staticmethod
    def kill_appium_server():
        print("Stopping Appium Server ..")
        AppiumManager.appium_process.terminate()
        sleep(5)