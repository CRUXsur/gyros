*** Settings ***
Library     AppiumLibrary
Resource    ./Library/Helpers/AppHelper.robot
Resource    ./Library/Helpers/DevuelveSaldoHelper.robot
Resource    ./Library/Helpers/LeerSaldoHelper.robot

Resource    ./Library/Pages/HomePage.robot
Resource    ./Library/Pages/LoginPage.robot

Library     ./Library/PyLibs/Utility.py


Resource    ./Library/Resource/Base.robot
Library     ./Library/PyLibs/Utility.py

Suite Setup         BeforeSuite     DEV_SALDO
Suite Teardown      AfterSuite      DEV_SALDO

Test Setup          BeforeTest


*** Test Cases ***
DevuelveSaldo
    #[Documentation]    Leer el saldo de la cta-oficina UNImovilPlus. 
    #...                Antes de ejecutar se verifica que hay un dispositivo conectado.

    Log    🚀 INICIAMOS SCRIPT DEV_SALDO                CONSOLE
    Log    =========================================    CONSOLE


    Log    ==========================================    CONSOLE
    Log    🧪 INICIANDO : Lee Saldo Cuenta               CONSOLE
    Log    ==========================================    CONSOLE
    
    # Verificar que el dispositivo está correctamente detectado y conectado
    Log    🔍 Verificando configuración del dispositivo...    CONSOLE
    Log    📱 Device UDID: ${DEVICE_UDID}    CONSOLE
    Log    📱 Device NAME: ${DEVICE_NAME}    CONSOLE
    Should Not Be Empty    ${DEVICE_UDID}    msg=Device ID no puede estar vacío
    Log    ✅ Dispositivo válido confirmado    CONSOLE
    
    ## Datos de prueba recibidos desde terminal
    #📝 Usando datos de prueba desde argumentos...    CONSOLE

    # Las variables se reciben como argumentos desde la terminal
    # Ejemplo de uso: robot -v usuario:3136202m -v password:Andres2013. devsaldo.robot
    
    # Validar que las variables requeridas estén definidas
    Should Not Be Empty    ${usuario}    msg=Variable 'usuario' es requerida. Use: -v usuario:valor
    Should Not Be Empty    ${password}   msg=Variable 'password' es requerida. Use: -v password:valor
    
    Log    🔹 Usuario: ${usuario}    CONSOLE
    Log    🔹 Password:              CONSOLE
    
    Log    🚀 Iniciando Lee el saldo en dispositivo ${DEVICE_UDID}...    CONSOLE

    # Ejecutar el script principal
    Lee Saldo    ${usuario}    ${password} 
    
    Log    ✅ SCRIPT COMPLETADO EXITOSAMENTE    CONSOLE
    Log    =========================================    CONSOLE
