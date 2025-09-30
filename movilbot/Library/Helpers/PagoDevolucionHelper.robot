*** Settings ***
Library    AppiumLibrary
Resource    ../Pages/HomePage.robot
Resource    ../Pages/LoginPage.robot
Resource    ../Pages/WebViewKeywords.robot
Resource    ./LeerSaldoHelper.robot


*** Keywords ***
Pago Devolucion
    [Arguments]    ${USUARIO}    ${PASSWORD}    ${BS}    ${GLOSA}

    #Login________________________________
    LoginPage.Enter_usuario     ${USUARIO}
    LoginPage.Click_Iniciar_Sesion_Btn
    Sleep    1s
    LoginPage.Click_Permitir_Notificacion
    Sleep    1s
    LoginPage.CheckBox_Ok
    Sleep    1s
    LoginPage.Enter_password    ${PASSWORD}
    Sleep    1s
    LoginPage.Click_Btn_Inicio
    Sleep    1s
    #HomePage.Click_Main_Screen
    
    #SaldoInicial_________________________
    Log    💰 === LECTURA DE SALDO INICIAL ===    CONSOLE
    ${saldo_inicial}=    Leer Saldo    ${USUARIO}    ${PASSWORD}
    Log    💰 SALDO INICIAL OBTENIDO: ${saldo_inicial}    CONSOLE
    Set Global Variable    ${SALDO_INICIAL}    ${saldo_inicial}

    #Pago_________________________________


    #Devolucion___________________________


    #SaldoFinal___________________________


    #Logout_______________________________
    Sleep    5s
    HomePage.Click_Off





