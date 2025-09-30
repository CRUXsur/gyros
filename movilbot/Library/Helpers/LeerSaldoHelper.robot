*** Settings ***
Library    AppiumLibrary
Resource    ../Pages/LoginPage.robot
Resource    ../Pages/WebViewKeywords.robot
Resource    ../Pages/HomePage.robot

*** Keywords ***
Leer Saldo
    [Arguments]  ${USUARIO}  ${PASSWORD}
    [Documentation]    Lee el saldo de la cuenta desde la aplicación móvil UNI+ usando múltiples estrategias. NOTA: Asume que el login ya fue realizado previamente

    Log To Console    🚀 === INICIANDO PROCESO DE LECTURA DE SALDO ===
    Log To Console    👤 Usuario: ${USUARIO}

    # --- Esperar estabilización de la pantalla (login ya realizado) ---
    Log To Console    ⏳ Esperando carga de pantalla principal...
    Sleep    5s

    # --- Intentar múltiples estrategias para obtener el saldo ---
    Log To Console    💰 Iniciando búsqueda de saldo...

    # Estrategia 1: Intentar desde contexto nativo primero
    ${saldo_nativo}=    Try Get Saldo Native Context
    IF    '${saldo_nativo}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo obtenido desde contexto nativo: ${saldo_nativo}
        RETURN    ${saldo_nativo}
    END

    # Estrategia 2: Cambiar a WebView y buscar saldo
    ${saldo_webview}=    Try Get Saldo WebView Context
    IF    '${saldo_webview}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo obtenido desde WebView: ${saldo_webview}
        RETURN    ${saldo_webview}
    END

    # Si ninguna estrategia funciona, lanzar error
    Log To Console    ❌ No se pudo obtener el saldo con ninguna estrategia
    Get Final Debug Info
    Fail    No se pudo obtener el saldo de la cuenta

Try Get Saldo Native Context
    [Documentation]    Intenta obtener el saldo desde el contexto nativo
    
    Log To Console    📱 Intentando obtener saldo desde contexto nativo...
    
    TRY
        ${saldo}=    HomePage.Get_Saldo
        IF    '${saldo}' != '${EMPTY}'
            Log To Console    ✅ Saldo encontrado en contexto nativo: ${saldo}
            RETURN    ${saldo}
        ELSE
            Log To Console    ⚠️ No se encontró saldo en contexto nativo
            RETURN    NOT_FOUND
        END
    EXCEPT    AS    ${error}
        Log To Console    ⚠️ Error en contexto nativo: ${error}
        RETURN    NOT_FOUND
    END

Try Get Saldo WebView Context
    [Documentation]    Intenta obtener el saldo cambiando a contexto WebView con mejor manejo de errores
    
    Log To Console    🌐 Intentando obtener saldo desde WebView...
    
    TRY
        # Cambiar a WebView
        ${webview_success}=    Switch To WebView
        
        IF    not ${webview_success}
            Log To Console    ❌ No se pudo cambiar a contexto WebView
            RETURN    NOT_FOUND
        END
        
        # Buscar saldo en WebView
        ${saldo}=    Get_Saldo_WebView
        
        IF    '${saldo}' != '${EMPTY}' and '${saldo}' != 'NOT_FOUND'
            Log To Console    ✅ Saldo encontrado en WebView: ${saldo}
            RETURN    ${saldo}
        ELSE
            Log To Console    ⚠️ No se encontró saldo en WebView
            RETURN    NOT_FOUND
        END
        
    EXCEPT    AS    ${error}
        Log To Console    ⚠️ Error en WebView: ${error}
        RETURN    NOT_FOUND
    END

Get Final Debug Info
    [Documentation]    Obtiene información final de debug cuando todas las estrategias fallan
    
    Log To Console    🔍 === INFORMACIÓN FINAL DE DEBUG ===
    
    # Obtener contextos disponibles
    TRY
        ${contexts}=    Get Contexts
        Log To Console    📋 Contextos disponibles: ${contexts}
        
        ${current_context}=    Get Current Context
        Log To Console    📱 Contexto actual: ${current_context}
    EXCEPT    AS    ${context_error}
        Log To Console    ❌ Error obteniendo contextos: ${context_error}
    END
    
    # Intentar screenshot para análisis posterior
    TRY
        Capture Page Screenshot    filename=debug_saldo_error.png
        Log To Console    📸 Screenshot capturado: debug_saldo_error.png
    EXCEPT    AS    ${screenshot_error}
        Log To Console    ⚠️ No se pudo capturar screenshot: ${screenshot_error}
    END
    
    Log To Console    🔍 === FIN DEBUG FINAL ===
