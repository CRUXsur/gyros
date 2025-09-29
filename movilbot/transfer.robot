*** Settings ***
Library     AppiumLibrary
Resource    ./Library/Helpers/AppHelper.robot
Resource    ./Library/Helpers/PagoDevolucionHelper.robot

Resource    ./Library/Pages/HomePage.robot
Resource    ./Library/Pages/LoginPage.robot

Library     ./Library/PyLibs/Utility.py


Resource    ./Library/Resource/Base.robot
Library     ./Library/PyLibs/Utility.py

Suite Setup         BeforeSuite     GIROS_PAGO_DEVOLUCION
Suite Teardown      AfterSuite      GIROS_PAGO_DEVOLUCION

Test Setup          BeforeTest


*** Test Cases ***
GirosPagosDevolucionesClientes
    #[Documentation]    Leer el saldo de la cta-oficina UNImovilPlus. 
    #...                Antes de ejecutar se verifica que hay un dispositivo conectado.

    Log    🚀 INICIAMOS SCRIPT GIROS_PAGO_DEVOLUCION    CONSOLE
    Log    =========================================    CONSOLE


    Log    ==========================================    CONSOLE
    Log    🧪 INICIANDO : Giros Pagos Devoluciones       CONSOLE
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
    # Ejemplo de uso: robot -v usuario:3136202m -v password:Andres2013. -v bs:1 -v glosa:25092025 transfer.robot
    
    # Validar que las variables requeridas estén definidas
    Should Not Be Empty    ${usuario}    msg=Variable 'usuario' es requerida. Use: -v usuario:valor
    Should Not Be Empty    ${password}   msg=Variable 'password' es requerida. Use: -v password:valor
    Should Not Be Empty    ${bs}         msg=Variable 'bs' es requerida. Use: -v bs:valor
    Should Not Be Empty    ${glosa}      msg=Variable 'glosa' es requerida. Use: -v glosa:valor
    
    Log    🔹 Usuario: ${usuario}    CONSOLE
    Log    🔹 Password:              CONSOLE
    Log    🔹 Bs: ${bs}              CONSOLE
    Log    🔹 Glosa: ${glosa}        CONSOLE
    
    Log    🚀 Iniciando Giros en dispositivo ${DEVICE_UDID}...    CONSOLE

    # Ejecutar el script principal
    Pago Devolucion    ${usuario}    ${password}   ${bs}   ${glosa}
    
    Log    ✅ SCRIPT COMPLETADO EXITOSAMENTE    CONSOLE
    Log    =========================================    CONSOLE
