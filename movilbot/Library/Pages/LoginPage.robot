*** Settings ***
Library    AppiumLibrary


*** Variables ***
${USUARIO_TEXT_BOX}     //android.widget.EditText[@resource-id="com.bancounion.unimovilplus:id/"]
${INICIAR_SESION}       //android.widget.Button[@resource-id="com.bancounion.unimovilplus:id/"]
${PERMITIRnot}          //android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]
${FRASE}                //android.widget.CheckBox[@resource-id="com.bancounion.unimovilplus:id/"]
${PASSWORD_TEXT_BOX}    //android.widget.EditText[@resource-id="com.bancounion.unimovilplus:id/"]
${BOTON_INICIO}         //android.widget.Button[@resource-id="com.bancounion.unimovilplus:id/" and @text="INICIAR SESIÓN"]


*** Keywords ***
LoginPage.Enter_usuario
    [Arguments]  ${USUARIO}
    wait until element is visible   ${USUARIO_TEXT_BOX}
    input text  ${USUARIO_TEXT_BOX}   ${USUARIO}

LoginPage.Click_Iniciar_Sesion_Btn
    wait until element is visible   ${INICIAR_SESION}
    click element   ${INICIAR_SESION}

LoginPage.Click_Permitir_Notificacion
    wait until element is visible   ${PERMITIRnot}
    click element   ${PERMITIRnot}

LoginPage.CheckBox_Ok
    wait until element is visible   ${FRASE}
    click element   ${FRASE}

LoginPage.Enter_password
    [Arguments]  ${PASSWORD}
    wait until element is visible   ${PASSWORD_TEXT_BOX}
    input text  ${PASSWORD_TEXT_BOX}   ${PASSWORD}

LoginPage.Click_Btn_Inicio
    wait until element is visible   ${BOTON_INICIO}
    click element   ${BOTON_INICIO}


