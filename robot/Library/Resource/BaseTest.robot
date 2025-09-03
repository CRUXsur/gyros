*** Settings ***
Library     ../PyLibs/AppiumManager.py
Resource    ../Helpers/AndroidHelpers/AppHelper.robot

*** Variables ***
${APPIUM-PORT}          4723
${DEVICE_UDID}          9A09A324-9959-4204-A8B2-19F4F23A29DD
${DEVICE_NAME}          NBA34BOAC5036471
${PLATFORM_VERSION}     13.0
${PLATFORM_Name}        Android
${AUTOMATION_NAME}      uiautomator2

*** Keywords ***
BeforeSuite
    [Arguments]  ${SUITE_NAME}
#    ${APPIUM-PORT}  start_appium_server     ${SUITE_NAME}
    start_appium_server    ${APPIUM-PORT}
    Open Google Keep Note App    ${APPIUM-PORT}  ${DEVICE_UDID}  ${DEVICE_NAME}  ${PLATFORM_VERSION}

AfterSuite
    [Arguments]  ${SUITE_NAME}
    Close Google Keep Note App
#    kill_appium_server  ${SUITE_NAME}
    kill_appium_server

BeforeTest
    Launch Google Keep Note




