
*** Settings ***
Library     AppiumLibrary
Resource    ../Library/Helpers/AndroidHelpers/AppHelper.robot
Resource    ../Library/Helpers/AndroidHelpers/AddNoteHelper.robot

Resource    ../Library/Pages/AndroidPages/HomePage.robot
Resource    ../Library/Pages/AndroidPages/AddNotePage.robot

Library     ../Library/PyLibs/Utility.py

Resource    ../Library/Resource/BaseTest.robot
Library     ../Library/PyLibs/Utility.py

Suite Setup         BeforeSuite     GOOGLE_KEEP_NOTE
Suite Teardown      AfterSuite      GOOGLE_KEEP_NOTE

Test Setup          BeforeTest


*** Test Cases ***
AddNewNoteWithMultipleItems
    [Documentation]    Test para agregar una nueva nota con múltiples items. 
    ...                Antes de ejecutar se verifica que hay un dispositivo conectado.
    
    Log    =========================================    CONSOLE
    Log    🧪 INICIANDO TEST: Add New Note With Multiple Items    CONSOLE
    Log    =========================================    CONSOLE
    
    # Verificar que el dispositivo está correctamente detectado y conectado
    Log    🔍 Verificando configuración del dispositivo...    CONSOLE
    Log    📱 Device UDID: ${DEVICE_UDID}    CONSOLE
    Log    📱 Device NAME: ${DEVICE_NAME}    CONSOLE
    Should Not Be Empty    ${DEVICE_UDID}    msg=Device ID no puede estar vacío
    Log    ✅ Dispositivo válido confirmado    CONSOLE
    
    # Generar datos de prueba
    Log    📝 Generando datos de prueba...    CONSOLE
    ${title}  get_random_string    5  Title
    ${item1}  get_random_string    3  Item
    ${item2}  get_random_string    3  Item
    
    Log    🔹 Título generado: ${title}    CONSOLE
    Log    🔹 Item 1 generado: ${item1}    CONSOLE
    Log    🔹 Item 2 generado: ${item2}    CONSOLE
    
    Log    🚀 Iniciando test principal en dispositivo ${DEVICE_UDID}...    CONSOLE

    # Ejecutar el test principal
    Add New Note With Two Items     ${title}   ${item1}   ${item2}
    
    Log    ✅ TEST COMPLETADO EXITOSAMENTE    CONSOLE
    Log    =========================================    CONSOLE




