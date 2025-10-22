*** Settings ***
Library    AppiumLibrary


*** Variables ***
${USUARIO_TEXT_BOX}     //android.widget.EditText[@resource-id="com.bancounion.unimovilplus:id/"]
${TIB}                  //android.widget.LinearLayout[@resource-id="com.bancounion.unimovilplus:id/"][4]/android.widget.RelativeLayout
${ACH}                  //android.widget.RelativeLayout[@resource-id="com.bancounion.unimovilplus:id/"][2]
${SELECCIONAR}          //android.view.View[@resource-id="Bancos_Banco"]
${BNB}                  //android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="BANCO NACIONAL DE BOLIVIA"]
${CTA_DEBITO}           //android.view.View[@resource-id="CuentaOrigens_CuentaOrigen"]
${NO_CTA_DEBITO}        //android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="10000063665168"]
${MONTO}                //android.widget.EditText[@resource-id="Monto"]
${SELECT_MONEDA}        //android.view.View[@resource-id="Monedas_Moneda"]
${MONEDA}               //android.widget.CheckedTextView[@resource-id="android:id/text1" and @text="BOLIVIANOS"]
${GLOSAxpath}           //android.widget.EditText[@resource-id="Glosa"]
${CONTINUAR}            //android.widget.Button[@resource-id="btn-continuar"]
${CONFIRMAR}            //android.widget.Button[@resource-id="btn-confirmar"]
${UNA_VEZ}              //android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_one_time_button"]
${HOME}                 //android.widget.ImageButton[@resource-id="com.bancounion.unimovilplus:id/"]


*** Keywords ***
PagoPage.Click_Transf_Interbanco
    wait until element is visible   ${TIB}
    click element   ${TIB}

PagoPage.Click_ACH
    wait until element is visible   ${ACH}
    click element   ${ACH}

PagoPage.Click_Seleccionar
    wait until element is visible   ${SELECCIONAR}
    click element   ${SELECCIONAR}

PagoPage.Click_Select_Banco
    wait until element is visible   ${BNB}
    click element   ${BNB}

PagoPage.Click_Select_Cta_Debito
    wait until element is visible   ${CTA_DEBITO}
    click element   ${CTA_DEBITO}

PagoPage.Click_Select_No_Cta_Debito
    wait until element is visible   ${NO_CTA_DEBITO}
    click element   ${NO_CTA_DEBITO}        

PagoPage.Enter_bs    
    [Arguments]  ${BS}
    wait until element is visible   ${MONTO}
    input text  ${MONTO}   ${BS}

PagoPage.Click_Select_Moneda
    wait until element is visible   ${SELECT_MONEDA}
    click element   ${SELECT_MONEDA}

PagoPage.Click_Bolivianos
    wait until element is visible   ${MONEDA}
    click element   ${MONEDA}

PagoPage.Enter_glosa
    [Arguments]  ${GLOSA}
    wait until element is visible   ${GLOSAxpath}
    input text  ${GLOSAxpath}   ${GLOSA}

PagoPage.Click_Continuar
    wait until element is visible   ${CONTINUAR}
    click element   ${CONTINUAR}

PagoPage.Click_Confirmar
    wait until element is visible   ${CONFIRMAR}
    click element   ${CONFIRMAR}
     
PagoPage.Click_Permitir_Una_Vez
    wait until element is visible   ${UNA_VEZ}
    click element   ${UNA_VEZ}     

PagoPage.Click_Home
    wait until element is visible   ${HOME}
    click element   ${HOME}     
