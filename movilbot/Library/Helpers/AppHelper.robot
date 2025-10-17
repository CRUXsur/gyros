*** Settings ***
Library    AppiumLibrary

*** Variables ***
${PERMISO}          //android.widget.Button[@resource-id="com.bancounion.unimovilplus:id/" and @text="OK"]
${PERMITIR}         //android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]
${INGRESE_USUARIO}  //android.widget.EditText[@resource-id="com.bancounion.unimovilplus:id/"]


*** Keywords ***
Open Uni Movil Plus App
    [Arguments]  ${APPIUM-PORT}  ${DEVICE_UDID}  ${DEVICE_NAME}  ${PLATFORM_VERSION}

    Open Application    http://localhost:${APPIUM-PORT}
    ...     platformName=Android
    ...     platformVersion=${PLATFORM_VERSION}
    ...     deviceName=${DEVICE_NAME}
    ...     automationName=uiautomator2
    ...     appPackage=com.bancounion.unimovilplus
    ...     appActivity=com.bancounion.unimovil.activity.SplashActivity

Close Uni Movil Plus App
    Close Application

Launch Uni Movil Plus
    Activate Application        com.bancounion.unimovilplus
    wait until element is visible   ${PERMISO}
    click element   ${PERMISO}
    wait until element is visible   ${PERMITIR}
    click element   ${PERMITIR}
    wait until element is visible   ${INGRESE_USUARIO}
