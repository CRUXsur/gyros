*** Settings ***
Library    AppiumLibrary

*** Variables ***
${MAS_OPCIONES}         //android.widget.ImageView[@content-desc="Más opciones"]
${SALIR}                //android.widget.TextView[@resource-id="com.bancounion.unimovilplus:id/" and @text="Salir"]
${SALDO_ESPECIFICO}     //android.view.View[@resource-id="FormData"]//*[contains(@text, '.')]


*** Keywords ***
HomePage.Click_For_Mas_Opciones
    wait until element is visible   ${MAS_OPCIONES}
    click element   ${MAS_OPCIONES}

HomePage.Click_Salir
    wait until element is visible   ${SALIR}
    click element   ${SALIR}

HomePage.Get_Saldo
    [Documentation]    Obtiene el saldo de la cuenta desde la pantalla principal usando múltiples estrategias
    [Arguments]    ${timeout}=15
    
    Log    🔍 Iniciando búsqueda del saldo en contexto nativo...    CONSOLE
    
    # Esperar un poco para que cargue la pantalla
    sleep    3s
    
    # Estrategia 1: Buscar elementos con formato de saldo (números con punto decimal)
    ${saldo}=    Try Find Saldo By Decimal Pattern
    IF    '${saldo}' != 'NOT_FOUND'
        Log    ✅ Saldo encontrado por patrón decimal: ${saldo}    CONSOLE
        RETURN    ${saldo}
    END
    
    # Estrategia 2: Buscar elementos que contengan texto numérico
    ${saldo}=    Try Find Saldo By Numeric Text
    IF    '${saldo}' != 'NOT_FOUND'
        Log    ✅ Saldo encontrado por texto numérico: ${saldo}    CONSOLE
        RETURN    ${saldo}
    END
    
    # Estrategia 3: Buscar en elementos específicos de la app bancaria
    ${saldo}=    Try Find Saldo In Banking Elements
    IF    '${saldo}' != 'NOT_FOUND'
        Log    ✅ Saldo encontrado en elementos bancarios: ${saldo}    CONSOLE
        RETURN    ${saldo}
    END
    
    # Estrategia 4: Buscar en elementos específicos de la app UNI+
    ${saldo}=    Try Find Saldo In UNI Elements
    IF    '${saldo}' != 'NOT_FOUND'
        Log    ✅ Saldo encontrado en elementos UNI+: ${saldo}    CONSOLE
        RETURN    ${saldo}
    END
    
    # Estrategia 5: Buscar en todos los elementos visibles
    ${saldo}=    Try Find Saldo In All Visible Elements
    IF    '${saldo}' != 'NOT_FOUND'
        Log    ✅ Saldo encontrado en elementos visibles: ${saldo}    CONSOLE
        RETURN    ${saldo}
    END
    
    # Si no se encuentra, obtener información de debug
    Get Debug Info Native Context
    Fail    ❌ No se pudo encontrar el saldo en contexto nativo

Try Find Saldo By Decimal Pattern
    [Documentation]    Busca elementos que contengan números con punto decimal con mejor manejo de errores
    
    Log    🔍 Estrategia 1: Buscando elementos con patrón decimal...    CONSOLE
    
    TRY
        # Buscar elementos que contengan punto decimal
        ${elements}=    Get Webelements    //*[contains(@text, '.')]
        ${count}=    Get Length    ${elements}
        
        Log    📊 Elementos con punto encontrados: ${count}    CONSOLE
        
        IF    ${count} > 0
            FOR    ${i}    IN RANGE    0    ${count}
                ${element}=    Set Variable    ${elements}[${i}]
                ${text}=    Get Text    ${element}
                Log    🔍 Elemento ${i}: "${text}"    CONSOLE
                
                # Verificar si es un número válido con punto decimal
                ${is_decimal}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.[0-9]+$
                IF    ${is_decimal}
                    Log    ✅ Saldo decimal válido encontrado: "${text}"    CONSOLE
                    RETURN    ${text}
                END
            END
        END
    EXCEPT    AS    ${error}
        Log    ⚠️ Error en búsqueda decimal: ${error}    CONSOLE
    END
    
    RETURN    NOT_FOUND

Try Find Saldo By Numeric Text
    [Documentation]    Busca elementos que contengan solo números con mejor manejo de errores
    
    Log    🔍 Estrategia 2: Buscando elementos con texto numérico...    CONSOLE
    
    TRY
        # Buscar elementos que contengan solo números
        ${elements}=    Get Webelements    //*[@text]
        ${count}=    Get Length    ${elements}
        
        Log    📊 Total elementos con texto: ${count}    CONSOLE
        
        IF    ${count} > 0
            FOR    ${i}    IN RANGE    0    ${count}
                ${element}=    Set Variable    ${elements}[${i}]
                ${text}=    Get Text    ${element}
                
                # Verificar si es un número (con o sin punto decimal)
                ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.?[0-9]*$
                ${text_length}=    Get Length    ${text}
                IF    ${is_numeric} and ${text_length} > 2
                    Log    ✅ Saldo numérico válido encontrado: "${text}"    CONSOLE
                    RETURN    ${text}
                END
            END
        END
    EXCEPT    AS    ${error}
        Log    ⚠️ Error en búsqueda numérica: ${error}    CONSOLE
    END
    
    RETURN    NOT_FOUND

Try Find Saldo In Banking Elements
    [Documentation]    Busca en elementos específicos de aplicaciones bancarias
    
    Log    🔍 Estrategia 3: Buscando en elementos bancarios específicos...    CONSOLE
    
    # XPaths específicos para aplicaciones bancarias
    @{banking_xpaths}    Create List
    ...    //android.widget.TextView[contains(@text, '$')]
    ...    //android.widget.TextView[contains(@text, 'USD')]
    ...    //android.widget.TextView[contains(@text, 'COP')]
    ...    //android.view.View[contains(@text, '$')]
    ...    //android.view.View[contains(@text, 'USD')]
    ...    //android.view.View[contains(@text, 'COP')]
    ...    //*[contains(@text, '$')]
    ...    //*[contains(@text, 'USD')]
    ...    //*[contains(@text, 'COP')]
    
    FOR    ${xpath}    IN    @{banking_xpaths}
        Log    🔍 Probando xpath: ${xpath}    CONSOLE
        
        ${elements}=    Run Keyword And Return Status    Get Webelements    ${xpath}
        IF    ${elements}
            ${element_list}=    Get Webelements    ${xpath}
            ${count}=    Get Length    ${element_list}
            
            IF    ${count} > 0
                FOR    ${i}    IN RANGE    0    ${count}
                    ${element}=    Set Variable    ${element_list}[${i}]
                    ${text}=    Get Text    ${element}
                    Log    🔍 Elemento bancario ${i}: "${text}"    CONSOLE
                    
                    # Extraer solo la parte numérica
                    ${numeric_part}=    Extract Numeric From Text    ${text}
                    IF    '${numeric_part}' != 'NOT_FOUND'
                        Log    ✅ Saldo extraído de elemento bancario: "${numeric_part}"    CONSOLE
                        RETURN    ${numeric_part}
                    END
                END
            END
        END
    END
    
    RETURN    NOT_FOUND

Extract Numeric From Text
    [Documentation]    Extrae la parte numérica de un texto que puede contener símbolos de moneda
    
    [Arguments]    ${text}
    
    # Remover símbolos de moneda y espacios
    ${clean_text}=    Replace String    ${text}    $    ${EMPTY}
    ${clean_text}=    Replace String    ${clean_text}    USD    ${EMPTY}
    ${clean_text}=    Replace String    ${clean_text}    COP    ${EMPTY}
    ${clean_text}=    Replace String    ${clean_text}    ,    ${EMPTY}
    ${clean_text}=    Strip String    ${clean_text}
    
    Log    🔍 Texto limpio: "${clean_text}"    CONSOLE
    
    # Verificar si es numérico
    ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${clean_text}    ^[0-9]+\.?[0-9]*$
    IF    ${is_numeric}
        RETURN    ${clean_text}
    ELSE
        RETURN    NOT_FOUND
    END

Get Debug Info Native Context
    [Documentation]    Obtiene información de debug para contexto nativo
    
    Log    🔍 === DEBUG CONTEXTO NATIVO ===    CONSOLE
    
    # Obtener todos los elementos con texto
    ${all_elements}=    Run Keyword And Return Status    Get Webelements    //*[@text]
    IF    ${all_elements}
        ${elements}=    Get Webelements    //*[@text]
        ${count}=    Get Length    ${elements}
        Log    📊 Total elementos con texto: ${count}    CONSOLE
        
        FOR    ${i}    IN RANGE    0    ${count}
            ${element}=    Set Variable    ${elements}[${i}]
            ${text}=    Get Text    ${element}
            Log    📝 Elemento ${i}: "${text}"    CONSOLE
            IF    ${i} >= 15    # Limitar a 15 elementos
                BREAK
            END
        END
    END
    
    # Capturar screenshot
    Capture Page Screenshot    filename=debug_native_context.png
    Log    📸 Screenshot capturado: debug_native_context.png    CONSOLE
    
    Log    🔍 === FIN DEBUG NATIVO ===    CONSOLE

Try Find Saldo In UNI Elements
    [Documentation]    Busca en elementos específicos de la aplicación UNI+
    
    Log    🔍 Estrategia 4: Buscando en elementos UNI+ específicos...    CONSOLE
    
    # XPaths específicos para la aplicación UNI+
    @{uni_xpaths}    Create List
    ...    //android.widget.TextView[@resource-id="com.bancounion.unimovilplus:id/"]
    ...    //android.view.View[@resource-id="FormData"]
    ...    //android.widget.TextView[contains(@text, '27.00')]
    ...    //android.widget.TextView[contains(@text, '27,00')]
    ...    //android.widget.TextView[contains(@text, '27')]
    ...    //*[@resource-id="com.bancounion.unimovilplus:id/"]
    ...    //*[contains(@text, '27.00')]
    ...    //*[contains(@text, '27,00')]
    ...    //*[contains(@text, '27')]
    
    FOR    ${xpath}    IN    @{uni_xpaths}
        Log    🔍 Probando xpath UNI+: ${xpath}    CONSOLE
        
        TRY
            ${elements}=    Run Keyword And Return Status    Get Webelements    ${xpath}
            IF    ${elements}
                ${element_list}=    Get Webelements    ${xpath}
                ${count}=    Get Length    ${element_list}
                
                IF    ${count} > 0
                    FOR    ${i}    IN RANGE    0    ${count}
                        ${element}=    Set Variable    ${element_list}[${i}]
                        ${text}=    Get Text    ${element}
                        Log    🔍 Elemento UNI+ ${i}: "${text}"    CONSOLE
                        
                        # Verificar si es numérico
                        ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.?[0-9]*$
                        ${text_length}=    Get Length    ${text}
                        IF    ${is_numeric} and ${text_length} > 2
                            Log    ✅ Saldo encontrado en UNI+: "${text}"    CONSOLE
                            RETURN    ${text}
                        END
                    END
                END
            END
        EXCEPT    AS    ${error}
            Log    ⚠️ Error con xpath UNI+ ${xpath}: ${error}    CONSOLE
        END
    END
    
    RETURN    NOT_FOUND

Try Find Saldo In All Visible Elements
    [Documentation]    Busca en todos los elementos visibles de la pantalla
    
    Log    🔍 Estrategia 5: Buscando en todos los elementos visibles...    CONSOLE
    
    TRY
        # Obtener todos los elementos visibles
        ${elements}=    Get Webelements    //*
        ${count}=    Get Length    ${elements}
        
        Log    📊 Total elementos visibles: ${count}    CONSOLE
        
        IF    ${count} > 0
            FOR    ${i}    IN RANGE    0    ${count}
                ${element}=    Set Variable    ${elements}[${i}]
                
                TRY
                    ${text}=    Get Text    ${element}
                    
                    # Verificar si es numérico y tiene formato de saldo
                    ${is_numeric}=    Run Keyword And Return Status    Should Match Regexp    ${text}    ^[0-9]+\.?[0-9]*$
                    ${text_length}=    Get Length    ${text}
                    IF    ${is_numeric} and ${text_length} > 2 and ${text_length} < 10
                        Log    🔍 Elemento visible ${i}: "${text}"    CONSOLE
                        Log    ✅ Saldo encontrado en elemento visible: "${text}"    CONSOLE
                        RETURN    ${text}
                    END
                EXCEPT    AS    ${text_error}
                    # Ignorar elementos sin texto
                END
                
                # Limitar búsqueda para no saturar
                IF    ${i} >= 50
                    BREAK
                END
            END
        END
    EXCEPT    AS    ${error}
        Log    ⚠️ Error en búsqueda de elementos visibles: ${error}    CONSOLE
    END
    
    RETURN    NOT_FOUND







#HomePage.Search_Item
#    [Arguments]  ${TEXT}
#    wait until element is visible   ${SEARCH_BAR}
#    input text  ${SEARCH_BAR}  ${TEXT}
