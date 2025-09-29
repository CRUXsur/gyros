*** Settings ***
Library    AppiumLibrary
Resource    ../Pages/HomePage.robot
Resource    ../Pages/LoginPage.robot


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

    #Pago_________________________________


    #Devolucion___________________________


    #Logout_______________________________
    Sleep    5s
    HomePage.Click_Off
