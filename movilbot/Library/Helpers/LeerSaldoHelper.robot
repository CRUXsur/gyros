*** Settings ***
Library    AppiumLibrary
Resource    ../Pages/HomePage.robot

*** Keywords ***
Leer Saldo
    [Arguments]  ${USUARIO}  ${PASSWORD}
    [Documentation]    Lee el saldo de la cuenta desde la aplicación móvil UNI+. NOTA: Asume que el login ya fue realizado previamente

    Log To Console    🚀 === INICIANDO PROCESO DE LECTURA DE SALDO ===
    Log To Console    👤 Usuario: ${USUARIO}

    # --- Esperar estabilización de la pantalla (login ya realizado) ---
    Log To Console    ⏳ Esperando carga de pantalla principal...
    Sleep    5s

    # --- Obtener saldo desde contexto nativo ---
    Log To Console    💰 Iniciando búsqueda de saldo...
    ${saldo}=    HomePage.Get_Saldo
    
    IF    '${saldo}' != '${EMPTY}'
        Log To Console    ✅ Saldo obtenido: ${saldo}
        RETURN    ${saldo}
    ELSE
        Log To Console    ❌ No se pudo obtener el saldo
        Fail    No se pudo obtener el saldo de la cuenta
    END

