*** Settings ***
Library     ../PyLibs/AppiumManager.py
Library     ../PyLibs/Utility.py
Resource    ../Helpers/AndroidHelpers/AppHelper.robot

*** Variables ***
${APPIUM-PORT}          4723
${DEVICE_UDID}          # Se obtendrá dinámicamente
${DEVICE_NAME}          # Se obtendrá dinámicamente  
${PLATFORM_VERSION}     13.0
${PLATFORM_Name}        Android
${AUTOMATION_NAME}      uiautomator2

*** Keywords ***
BeforeSuite
    [Arguments]  ${SUITE_NAME}
    # Detectar dispositivo conectado automáticamente
    Detect And Validate Connected Device
    # Iniciar servidor Appium
    start_appium_server    ${APPIUM-PORT}
    # Abrir aplicación en el dispositivo detectado
    Open Google Keep Note App    ${APPIUM-PORT}  ${DEVICE_UDID}  ${DEVICE_NAME}  ${PLATFORM_VERSION}

AfterSuite
    [Arguments]  ${SUITE_NAME}
    Close Google Keep Note App
#    kill_appium_server  ${SUITE_NAME}
    kill_appium_server

BeforeTest
    Launch Google Keep Note

Detect And Validate Connected Device
    [Documentation]    Detecta automáticamente el dispositivo Android conectado por USB y valida la conexión
    
    Log    =====================================    CONSOLE
    Log    🚀 INICIANDO DETECCIÓN DE DISPOSITIVO    CONSOLE
    Log    =====================================    CONSOLE
    
    # Obtener device ID del dispositivo conectado
    Log    📱 Paso 1: Detectando dispositivo USB conectado...    CONSOLE
    ${detected_device_id}=    get_connected_device_id
    
    Log    📋 Paso 2: Configurando variables globales...    CONSOLE
    Log    🔹 DEVICE_UDID configurado como: ${detected_device_id}    CONSOLE
    Log    🔹 DEVICE_NAME configurado como: ${detected_device_id}    CONSOLE
    Set Global Variable    ${DEVICE_UDID}    ${detected_device_id}
    Set Global Variable    ${DEVICE_NAME}    ${detected_device_id}
    
    # Validar que el dispositivo esté accesible
    Log    🔍 Paso 3: Validando conexión del dispositivo...    CONSOLE
    validate_device_connection    ${DEVICE_UDID}
    
    # Obtener y mostrar información del dispositivo
    Log    📊 Paso 4: Obteniendo información detallada...    CONSOLE
    ${device_info}=    get_device_info    ${DEVICE_UDID}
    
    Log    ==========================================    CONSOLE
    Log    ✅ DETECCIÓN COMPLETADA EXITOSAMENTE    CONSOLE
    Log    🎯 Dispositivo listo: ${DEVICE_UDID}    CONSOLE
    Log    ==========================================    CONSOLE




