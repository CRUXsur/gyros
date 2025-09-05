*** Settings ***
Library     ../Library/PyLibs/Utility.py

*** Test Cases ***
Test Device Detection
    [Documentation]    Test simple para verificar la detección de dispositivos USB
    [Tags]    device_detection
    
    Log    === INICIANDO TEST DE DETECCIÓN DE DISPOSITIVOS ===    INFO
    
    # Obtener device ID del dispositivo conectado
    ${device_id}=    get_connected_device_id
    Log    Device ID detectado: ${device_id}    INFO
    Should Not Be Empty    ${device_id}    msg=No se detectó ningún dispositivo
    
    # Validar conexión del dispositivo
    validate_device_connection    ${device_id}
    Log    Dispositivo validado correctamente    INFO
    
    # Obtener información del dispositivo
    get_device_info    ${device_id}
    
    Log    === TEST DE DETECCIÓN COMPLETADO EXITOSAMENTE ===    INFO

Test Multiple Device Detection Calls
    [Documentation]    Test para verificar múltiples llamadas de detección
    [Tags]    device_detection
    
    Log    Probando múltiples llamadas de detección...    INFO
    
    # Primera detección
    ${device_id_1}=    get_connected_device_id
    Log    Primera detección: ${device_id_1}    INFO
    
    # Segunda detección (debe ser el mismo)
    ${device_id_2}=    get_connected_device_id
    Log    Segunda detección: ${device_id_2}    INFO
    
    Should Be Equal    ${device_id_1}    ${device_id_2}    msg=Las detecciones deben retornar el mismo device ID
    
    Log    Múltiples detecciones funcionan correctamente    INFO
