*** Variables ***
# XPaths dinámicos para buscar elementos de saldo
${SALDO_FORMDATA_XPATH}         //android.view.View[@resource-id="FormData"]//*[contains(@text, '.')]
${SALDO_NUMERIC_XPATH}          //*[contains(@text, '.') and re:match(@text, '^[0-9]+\.[0-9]+$')]
${SALDO_GENERIC_XPATH}          //*[contains(@text, '.')]

*** Keywords ***
Switch To WebView
    [Documentation]    Cambia el contexto de NATIVE_APP a WEBVIEW con mejor manejo de errores
    Log To Console    🔄 Iniciando cambio a WebView...
    
    # Esperar un momento para que los contextos se estabilicen
    Sleep    2s
    
    ${contexts}=    Get Contexts
    Log To Console    🌐 Contextos disponibles: ${contexts}
    
    ${webview_found}=    Set Variable    ${False}
    ${webview_context}=    Set Variable    ${EMPTY}
    
    # Buscar contexto WebView con diferentes variaciones
    FOR    ${ctx}    IN    @{contexts}
        Log To Console    🔍 Evaluando contexto: ${ctx}
        
        # Verificar diferentes variaciones de WebView
        ${is_webview1}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW
        ${is_webview2}=    Run Keyword And Return Status    Should Contain    ${ctx}    webview
        ${is_webview3}=    Run Keyword And Return Status    Should Contain    ${ctx}    WebView
        ${is_webview4}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW_
        
        IF    ${is_webview1} or ${is_webview2} or ${is_webview3} or ${is_webview4}
            Log To Console    ✅ Contexto WebView encontrado: ${ctx}
            ${webview_context}=    Set Variable    ${ctx}
            ${webview_found}=    Set Variable    ${True}
            BREAK
        END
    END
    
    IF    not ${webview_found}
        Log To Console    ❌ No se encontró contexto WebView disponible
        Log To Console    📋 Contextos disponibles: ${contexts}
        Log To Console    ⚠️ Intentando activar WebView...
        
        # Intentar activar WebView haciendo clic en elementos que podrían cargar contenido web
        ${webview_activated}=    Try Activate WebView
        IF    ${webview_activated}
            Log To Console    ✅ WebView activado exitosamente
            # Esperar a que se cargue el contexto WebView
            Sleep    3s
            ${contexts_retry}=    Get Contexts
            Log To Console    🌐 Contextos después de activar WebView: ${contexts_retry}
            
            FOR    ${ctx}    IN    @{contexts_retry}
                ${is_webview}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW
                IF    ${is_webview}
                    Log To Console    ✅ Contexto WebView encontrado después de activación: ${ctx}
                    ${webview_context}=    Set Variable    ${ctx}
                    ${webview_found}=    Set Variable    ${True}
                    BREAK
                END
            END
        END
        
        # Si aún no se encuentra, esperar más tiempo y reintentar
        IF    not ${webview_found}
            Log To Console    ⚠️ Esperando más tiempo para que aparezca WebView...
            Sleep    5s
            ${contexts_retry}=    Get Contexts
            Log To Console    🌐 Contextos después de esperar: ${contexts_retry}
            
            FOR    ${ctx}    IN    @{contexts_retry}
                ${is_webview}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW
                IF    ${is_webview}
                    Log To Console    ✅ Contexto WebView encontrado en reintento: ${ctx}
                    ${webview_context}=    Set Variable    ${ctx}
                    ${webview_found}=    Set Variable    ${True}
                    BREAK
                END
            END
        END
        
        IF    not ${webview_found}
            Log To Console    ❌ WebView no disponible después de todos los intentos
            RETURN    ${False}
        END
    END
    
    # Cambiar al contexto WebView
    TRY
        Log To Console    🔄 Cambiando a contexto: ${webview_context}
        Switch To Context    ${webview_context}
        
        # Verificar que el cambio fue exitoso
        Sleep    2s
        ${current_context}=    Get Current Context
        Log To Console    📱 Contexto actual después del cambio: ${current_context}
        
        IF    '${current_context}' == '${webview_context}'
            Log To Console    ✅ Cambio a WebView completado exitosamente
            RETURN    ${True}
        ELSE
            Log To Console    ⚠️ El contexto no cambió correctamente
            RETURN    ${False}
        END
        
    EXCEPT    AS    ${error}
        Log To Console    ❌ Error al cambiar contexto: ${error}
        RETURN    ${False}
    END

Get_Saldo_WebView
    [Documentation]    Devuelve el saldo leyendo el HTML dentro del WebView con múltiples estrategias mejoradas
    Log To Console    💰 Iniciando búsqueda de saldo en WebView...
    
    # Verificar que estamos en contexto WebView
    ${current_context}=    Get Current Context
    Log To Console    📱 Contexto actual en Get_Saldo_WebView: ${current_context}
    
    # Esperar a que la página cargue completamente
    Sleep    3s
    
    # Estrategia 1: Buscar en FormData
    ${saldo}=    Try Get Saldo From FormData
    IF    '${saldo}' != '${EMPTY}' and '${saldo}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo encontrado en FormData: ${saldo}
        RETURN    ${saldo}
    END
    
    # Estrategia 2: Buscar elementos numéricos en toda la página
    ${saldo}=    Try Get Saldo Generic
    IF    '${saldo}' != '${EMPTY}' and '${saldo}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo encontrado genéricamente: ${saldo}
        RETURN    ${saldo}
    END
    
    # Estrategia 3: Buscar usando selectores CSS (para WebView)
    ${saldo}=    Try Get Saldo With CSS Selectors
    IF    '${saldo}' != '${EMPTY}' and '${saldo}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo encontrado con CSS selectors: ${saldo}
        RETURN    ${saldo}
    END
    
    # Estrategia 4: Buscar en el código fuente HTML
    ${saldo}=    Try Get Saldo From HTML Source
    IF    '${saldo}' != '${EMPTY}' and '${saldo}' != 'NOT_FOUND'
        Log To Console    ✅ Saldo encontrado en HTML source: ${saldo}
        RETURN    ${saldo}
    END
    
    # Si no se encuentra saldo, lanzar error con información de debug
    Log To Console    ❌ No se pudo encontrar el saldo en WebView
    Get Debug Info WebView
    Fail    No se pudo encontrar el saldo en WebView

Try Get Saldo From FormData
    [Documentation]    Intenta obtener el saldo desde el contenedor FormData
    
    ${saldo_found}=    Run Keyword And Return Status    Wait Until Element Is Visible    ${SALDO_FORMDATA_XPATH}    5s
    
    IF    ${saldo_found}
        ${saldo}=    Get Text    ${SALDO_FORMDATA_XPATH}
        Log To Console    🔍 Texto encontrado en FormData: "${saldo}"
        
        # Validar que sea numérico
        ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${saldo}    ^[0-9]+\.?[0-9]*$
        IF    ${is_numeric}
            RETURN    ${saldo}
        ELSE
            Log To Console    ⚠️ Texto en FormData no es numérico: "${saldo}"
            RETURN    NOT_FOUND
        END
    ELSE
        Log To Console    ⚠️ No se encontró elemento en FormData
        RETURN    NOT_FOUND
    END

Try Get Saldo Generic
    [Documentation]    Busca elementos con punto decimal en toda la página
    
    ${elements}=    Get Webelements    ${SALDO_GENERIC_XPATH}
    ${count}=    Get Length    ${elements}
    
    Log To Console    📊 Elementos con punto encontrados: ${count}
    
    IF    ${count} > 0
        FOR    ${i}    IN RANGE    0    ${count}
            ${element}=    Set Variable    ${elements}[${i}]
            ${text}=    Get Text    ${element}
            Log To Console    🔍 Elemento ${i}: "${text}"
            
            # Verificar si es un número válido (formato de saldo)
            ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.[0-9]+$
            IF    ${is_numeric}
                Log To Console    ✅ Saldo numérico válido encontrado: "${text}"
                RETURN    ${text}
            END
        END
    END
    
    Log To Console    ❌ No se encontraron elementos numéricos válidos
    RETURN    NOT_FOUND

Get Debug Info WebView
    [Documentation]    Obtiene información de debug cuando no se encuentra el saldo
    
    Log To Console    🔍 === INFORMACIÓN DE DEBUG WEBVIEW ===
    
    # Obtener contexto actual
    ${current_context}=    Get Current Context
    Log To Console    📱 Contexto actual: ${current_context}
    
    # Intentar obtener código fuente de la página
    ${page_source}=    Run Keyword And Return Status    Get Source
    IF    ${page_source}
        ${source}=    Get Source
        Log To Console    📄 Código fuente disponible (primeros 500 caracteres)
        ${source_preview}=    Get Substring    ${source}    0    500
        Log To Console    ${source_preview}
    ELSE
        Log To Console    ❌ No se pudo obtener código fuente
    END
    
    # Buscar todos los elementos con texto
    ${all_elements}=    Run Keyword And Return Status    Get Webelements    //*[@text]
    IF    ${all_elements}
        ${elements}=    Get Webelements    //*[@text] 
        ${count}=    Get Length    ${elements}
        Log To Console    📊 Total elementos con texto: ${count}
        
        FOR    ${i}    IN RANGE    0    ${count}    
            ${element}=    Set Variable    ${elements}[${i}]
            ${text}=    Get Text    ${element}
            Log To Console    📝 Elemento ${i}: "${text}"
            IF    ${i} >= 10    # Limitar a 10 elementos para no saturar el log
                BREAK
            END
        END
    ELSE
        Log To Console    ❌ No se pudieron obtener elementos con texto
    END
    
    Log To Console    🔍 === FIN DEBUG WEBVIEW ===

Try Get Saldo With CSS Selectors
    [Documentation]    Intenta obtener el saldo usando selectores CSS específicos para WebView
    
    Log To Console    🔍 Estrategia CSS: Buscando saldo con selectores CSS...
    
    # Lista de selectores CSS para buscar saldo
    @{css_selectors}    Create List
    ...    [data-testid*="saldo"]
    ...    [class*="saldo"]
    ...    [id*="saldo"]
    ...    [class*="balance"]
    ...    [id*="balance"]
    ...    [class*="amount"]
    ...    [id*="amount"]
    ...    .saldo
    ...    .balance
    ...    .amount
    ...    #saldo
    ...    #balance
    ...    #amount
    ...    [data-testid*="amount"]
    ...    [class*="money"]
    ...    [id*="money"]
    
    FOR    ${selector}    IN    @{css_selectors}
        Log To Console    🔍 Probando selector CSS: ${selector}
        
        TRY
            ${element_exists}=    Run Keyword And Return Status    Get Webelements    css=${selector}
            IF    ${element_exists}
                ${elements}=    Get Webelements    css=${selector}
                ${count}=    Get Length    ${elements}
                
                IF    ${count} > 0
                    FOR    ${i}    IN RANGE    0    ${count}
                        ${element}=    Set Variable    ${elements}[${i}]
                        ${text}=    Get Text    ${element}
                        Log To Console    🔍 Elemento CSS ${i}: "${text}"
                        
                        # Verificar si es numérico
                        ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.?[0-9]*$
                        IF    ${is_numeric} and len('${text}') > 2
                            Log To Console    ✅ Saldo encontrado con CSS: "${text}"
                            RETURN    ${text}
                        END
                    END
                END
            END
        EXCEPT    AS    ${error}
            Log To Console    ⚠️ Error con selector ${selector}: ${error}
        END
    END
    
    RETURN    NOT_FOUND

Try Get Saldo From HTML Source
    [Documentation]    Intenta obtener el saldo analizando el código fuente HTML
    
    Log To Console    🔍 Estrategia HTML: Analizando código fuente...
    
    TRY
        ${source}=    Get Source
        Log To Console    📄 Código fuente obtenido (${len('${source}')} caracteres)
        
        # Buscar patrones numéricos en el HTML
        @{patterns}    Create List
        ...    (\d+\.\d{2})
        ...    (\d+\.\d{1})
        ...    (\d+\.\d+)
        ...    (\d+,\d{2})
        ...    (\d+,\d{1})
        ...    (\d+,\d+)
        ...    (\$\d+\.\d{2})
        ...    (USD\s*\d+\.\d{2})
        ...    (COP\s*\d+\.\d{2})
        
        FOR    ${pattern}    IN    @{patterns}
            Log To Console    🔍 Buscando patrón: ${pattern}
            
            # Usar regex para encontrar el patrón
            ${matches}=    Run Keyword And Return Status    Should Match Regexp    ${source}    ${pattern}
            IF    ${matches}
                # Extraer el primer match
                ${match}=    Get Regexp Matches    ${source}    ${pattern}    1
                IF    len('${match}') > 0
                    ${saldo_text}=    Set Variable    ${match}[0]
                    Log To Console    🔍 Match encontrado: "${saldo_text}"
                    
                    # Limpiar el texto de símbolos de moneda
                    ${clean_saldo}=    Replace String    ${saldo_text}    $    ${EMPTY}
                    ${clean_saldo}=    Replace String    ${clean_saldo}    USD    ${EMPTY}
                    ${clean_saldo}=    Replace String    ${clean_saldo}    COP    ${EMPTY}
                    ${clean_saldo}=    Replace String    ${clean_saldo}    ,    .
                    ${clean_saldo}=    Strip String    ${clean_saldo}
                    
                    # Verificar que sea numérico
                    ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${clean_saldo}    ^[0-9]+\.?[0-9]*$
                    IF    ${is_numeric} and len('${clean_saldo}') > 2
                        Log To Console    ✅ Saldo extraído del HTML: "${clean_saldo}"
                        RETURN    ${clean_saldo}
                    END
                END
            END
        END
        
    EXCEPT    AS    ${error}
        Log To Console    ⚠️ Error obteniendo código fuente: ${error}
    END
    
    RETURN    NOT_FOUND

Try Activate WebView
    [Documentation]    Intenta activar WebView haciendo clic en elementos que podrían cargar contenido web
    
    Log To Console    🔄 Intentando activar WebView...
    
    # Lista de elementos que podrían activar WebView
    @{webview_triggers}    Create List
    ...    //android.widget.Button[contains(@text, 'Consultar')]
    ...    //android.widget.Button[contains(@text, 'Ver')]
    ...    //android.widget.Button[contains(@text, 'Detalle')]
    ...    //android.widget.Button[contains(@text, 'Saldo')]
    ...    //android.widget.TextView[contains(@text, 'Consultar')]
    ...    //android.widget.TextView[contains(@text, 'Ver')]
    ...    //android.widget.TextView[contains(@text, 'Detalle')]
    ...    //android.widget.TextView[contains(@text, 'Saldo')]
    ...    //android.view.View[contains(@text, 'Consultar')]
    ...    //android.view.View[contains(@text, 'Ver')]
    ...    //android.view.View[contains(@text, 'Detalle')]
    ...    //android.view.View[contains(@text, 'Saldo')]
    ...    //*[contains(@text, 'Consultar')]
    ...    //*[contains(@text, 'Ver')]
    ...    //*[contains(@text, 'Detalle')]
    ...    //*[contains(@text, 'Saldo')]
    ...    //*[contains(@text, 'Más')]
    ...    //*[contains(@text, 'Opciones')]
    ...    //*[contains(@text, 'Menú')]
    ...    //*[contains(@text, 'Menu')]
    
    FOR    ${trigger}    IN    @{webview_triggers}
        Log To Console    🔍 Probando activador: ${trigger}
        
        TRY
            ${element_exists}=    Run Keyword And Return Status    Wait Until Element Is Visible    ${trigger}    2s
            IF    ${element_exists}
                Log To Console    ✅ Elemento encontrado, haciendo clic: ${trigger}
                Click Element    ${trigger}
                Sleep    2s
                
                # Verificar si WebView se activó
                ${contexts}=    Get Contexts
                FOR    ${ctx}    IN    @{contexts}
                    ${is_webview}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW
                    IF    ${is_webview}
                        Log To Console    ✅ WebView activado con: ${trigger}
                        RETURN    ${True}
                    END
                END
            END
        EXCEPT    AS    ${error}
            Log To Console    ⚠️ Error con activador ${trigger}: ${error}
        END
    END
    
    # Intentar hacer clic en el centro de la pantalla para activar WebView
    Log To Console    🔍 Intentando clic en centro de pantalla...
    TRY
        Click Element    //android.widget.FrameLayout[1]
        Sleep    2s
        
        # Verificar si WebView se activó
        ${contexts}=    Get Contexts
        FOR    ${ctx}    IN    @{contexts}
            ${is_webview}=    Run Keyword And Return Status    Should Contain    ${ctx}    WEBVIEW
            IF    ${is_webview}
                Log To Console    ✅ WebView activado con clic en pantalla
                RETURN    ${True}
            END
        END
    EXCEPT    AS    ${error}
        Log To Console    ⚠️ Error con clic en pantalla: ${error}
    END
    
    Log To Console    ❌ No se pudo activar WebView
    RETURN    ${False}
