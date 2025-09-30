*** Settings ***
Library    AppiumLibrary

*** Variables ***
${REFRESH}              //android.widget.ImageButton[@resource-id="com.bancounion.unimovilplus:id/"][4]
${MAS_OPCIONES}         //android.widget.ImageView[@content-desc="Más opciones"]
${SALIR}                //android.widget.TextView[@resource-id="com.bancounion.unimovilplus:id/" and @text="Salir"]
${OFF}                  //android.widget.ImageView[@resource-id="com.bancounion.unimovilplus:id/"][2]
${MENU}                 //android.widget.ImageButton[@content-desc="Open navigation drawer"]

*** Keywords ***
HomePage.Click_Main_Screen
    wait until element is visible   ${OFF}

HomePage.Click_For_Mas_Opciones
    wait until element is visible   ${MAS_OPCIONES}
    click element   ${MAS_OPCIONES}

HomePage.Click_Menu
    wait until element is visible   ${MENU}
    click element   ${MENU}

HomePage.Click_Off
    wait until element is visible   ${OFF}
    click element   ${OFF}

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



