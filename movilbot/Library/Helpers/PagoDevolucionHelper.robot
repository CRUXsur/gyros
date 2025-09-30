*** Settings ***
Library    AppiumLibrary
Resource    ../Pages/HomePage.robot
Resource    ../Pages/LoginPage.robot
Resource    ../Pages/PagoPage.robot
Resource    ./LeerSaldoHelper.robot


*** Keywords ***
Pago Devolucion
    [Arguments]    ${USUARIO}    ${PASSWORD}    ${BS}    ${GLOSA}

    #Login___________________________________________________________
    LoginPage.Enter_usuario     ${USUARIO}
    LoginPage.Click_Iniciar_Sesion_Btn
    Sleep    2s
    LoginPage.Click_Permitir_Notificacion
    Sleep    2s
    LoginPage.CheckBox_Ok
    Sleep    1s
    LoginPage.Enter_password    ${PASSWORD}
    Sleep    1s
    LoginPage.Click_Btn_Inicio
    Sleep    1s
    #HomePage.Click_Main_Screen
    
    #SaldoInicial____________________________________________________
    Log    💰 === LECTURA DE SALDO INICIAL ===    CONSOLE
    ${saldo_inicial}=    Leer Saldo    ${USUARIO}    ${PASSWORD}
    Log    💰 SALDO INICIAL OBTENIDO: ${saldo_inicial}    CONSOLE
    Set Global Variable    ${SALDO_INICIAL}    ${saldo_inicial}

    #Pago____________________________________________________________
    HomePage.Click_Menu
    PagoPage.Click_Transf_Interbanco
    PagoPage.Click_ACH
    Sleep    2s
    PagoPage.Click_Seleccionar
    PagoPage.Click_Select_Banco

    #PagoPage.Click_Select_Cta_Debito
    #Sleep    1s
    #PagoPage.Click_Select_No_Cta_Debito
    # Hacer scroll para llegar al elemento Monto
    Swipe    500    1200    500    100    1000
    Sleep    2s

    PagoPage.Click_Select_Cta_Debito
    PagoPage.Click_Select_No_Cta_Debito

    PagoPage.Enter_bs    ${BS}

    PagoPage.Click_Select_Moneda
    PagoPage.Click_Bolivianos

    #Sleep    1s
    PagoPage.Enter_glosa    ${GLOSA}

    # Hacer scroll para llegar al elemento Continuar
    #Swipe    500    1200    500    50    1000
    #Sleep    2s
    PagoPage.Click_Continuar
    Sleep    1s


    PagoPage.Click_Permitir_Una_Vez
    Sleep    1s
    
    
    # Hacer scroll para llegar al elemento Confirmar
    Swipe    500    1200    500    200    1000
    Sleep    3s

    PagoPage.Click_Confirmar
    Sleep    3s
    
    PagoPage.Click_Home

    #Devolucion______________________________________________________


    #SaldoFinal______________________________________________________
    Log    💰 === LECTURA DE SALDO INICIAL ===    CONSOLE
    ${saldo_final}=    Leer Saldo    ${USUARIO}    ${PASSWORD}
    Log    💰 SALDO FINAL OBTENIDO: ${saldo_final}    CONSOLE
    Set Global Variable    ${SALDO_FINAL}    ${saldo_final}

    #Logout__________________________________________________________
    Sleep    5s
    HomePage.Click_Off





