

*** Settings ***
Library    AppiumLibrary

*** Variables ***
${SKIP_WELCOME}     com.google.android.keep:id/skip_welcome
${CONTINUE}         //android.widget.Button[@resource-id="android:id/button1"]
${PERMITIR}         //android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]
${PLUS}             com.google.android.keep:id/speed_dial_create_close_button

*** Keywords ***
Open Google Keep Note App
    [Arguments]  ${APPIUM-PORT}  ${DEVICE_UDID}  ${DEVICE_NAME}  ${PLATFORM_VERSION}

    Open Application    http://localhost:${APPIUM-PORT}
    ...     platformName=Android
    ...     platformVersion=${PLATFORM_VERSION}
    ...     deviceName=${DEVICE_NAME}
    ...     automationName=uiautomator2
    ...     appPackage=com.google.android.keep
    ...     appActivity=com.google.android.keep.activities.BrowseActivity

Close Google Keep Note App
    Close Application

Launch Google Keep Note
    Activate Application        com.google.android.keep
    click element   ${SKIP_WELCOME}
    click element   ${CONTINUE}
    wait until element is visible   ${PERMITIR}
    click element   ${PERMITIR}
    wait until element is visible   ${PLUS}
    click element   ${PLUS}


