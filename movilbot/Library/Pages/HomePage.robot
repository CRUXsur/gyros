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


