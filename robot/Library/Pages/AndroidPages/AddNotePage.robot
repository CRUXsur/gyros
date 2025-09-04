*** Settings ***
Library    AppiumLibrary

*** Variables ***
${TITLE_TEXT_BOX}   com.google.android.keep:id/editable_title
${NOTE_ITEM_BOX}    //android.widget.EditText[@resource-id='com.google.android.keep:id/description']
${ITEM_BOX}         com.google.android.keep:id/edit_note_text
${ADD_NEXT_ITEM}    com.google.android.keep:id/add_item_text_view
${BACK_ARROW}       //android.widget.ImageButton[@content-desc="Navegar hacia arriba"]
${DESHACER}         com.google.android.keep:id/snackbar_action
${SAVE}             com.google.android.keep:id/menu_archive
#${SAVE_AND_GOHOME}  //android.widget.ImageButton[@content-desc='Open navigation drawer']
${SAVE_AND_GOHOME}  //android.widget.ImageButton[@content-desc="Navegar hacia arriba"]

*** Keywords ***
AddNotePage.Enter_Title
    [Arguments]  ${TITLE}
    wait until element is visible   ${TITLE_TEXT_BOX}
    input text  ${TITLE_TEXT_BOX}   ${TITLE}

AddNotePage.Enter_Item
    [Arguments]  ${ITEM}  ${INDEX}
    wait until element is visible   ${ITEM_BOX}
    input text  ${ITEM_BOX}   ${ITEM}

#AddNotePage.Enable_Next_Item
#    wait until element is visible  ${ADD_NEXT_ITEM}
#    click element   ${ADD_NEXT_ITEM}

AddNotePage.Deshacer
    wait until element is visible  ${DESHACER}
    click element   ${DESHACER}

AddNotePage.Back_Arrow
    wait until element is visible  ${BACK_ARROW}
    click element   ${BACK_ARROW}

#AddNotePage.Click_Save_Button
#    wait until element is visible   ${SAVE}
#    click element   ${SAVE}