*** Settings ***
Library    AppiumLibrary

*** Variables ***
${TITLE_TEXT_BOX}   com.google.android.keep:id/editable_title
${NOTE_ITEM_BOX}    //android.widget.EditText[@resource-id='com.google.android.keep:id/description']
${ADD_NEXT_ITEM}    com.google.android.keep:id/add_item_text_view
#${SAVE_AND_GOHOME}  //android.widget.ImageButton[@content-desc='Open navigation drawer']
${SAVE_AND_GOHOME}  //android.widget.ImageButton[@content-desc="Navegar hacia arriba"]

*** Keywords ***
AddNotePage.Enter_Title
    [Arguments]  ${TITLE}
    wait until element is visible   ${TITLE_TEXT_BOX}
    input text  ${TITLE_TEXT_BOX}   ${TITLE}

AddNotePage.Enter_Item
    [Arguments]  ${ITEM}  ${INDEX}
    @{elements}     get webelements     ${NOTE_ITEM_BOX}
    input text  ${elements}[${INDEX}]   ${ITEM}

AddNotePage.Enable_Next_Item
    wait until element is visible  ${ADD_NEXT_ITEM}
    click element   ${ADD_NEXT_ITEM}

AddNotePage.Click_Save_Button
    wait until element is visible   ${SAVE_AND_GOHOME}
    click element   ${SAVE_AND_GOHOME}