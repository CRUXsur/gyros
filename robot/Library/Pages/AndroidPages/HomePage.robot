*** Settings ***
Library    AppiumLibrary

*** Variables ***
${ADD_NEW_NOTE_ICON}    com.google.android.keep:id/new_list_button
${PLUS}                 com.google.android.keep:id/speed_dial_create_close_button
${ADD_NEW_TEXT_ICON}    com.google.android.keep:id/new_note_button
${ADD_NEW_DRAW_ICON}    com.google.android.keep:id/new_drawing_button
${ADD_NEW_AUDIO_ICON}   com.google.android.keep:id/new_audio_note_button
${ADD_NEW_PHOTO_ICON}   com.google.android.keep:id/new_photo_note
${SEARCH_BAR}           com.google.android.keep:id/open_search_bar_text_view

*** Keywords ***
HomePage.Wait_For_Home_Page
    wait until element is visible   ${PLUS}

#HomePage.Click_Add_New_Note_Icon
#    wait until element is visible   ${ADD_NEW_NOTE_ICON}
#    click element   ${ADD_NEW_NOTE_ICON}

HomePage.Click_Add_New_Text_Icon
    wait until element is visible   ${ADD_NEW_TEXT_ICON}
    click element   ${ADD_NEW_TEXT_ICON}

HomePage.Click_Add_New_Draw_Icon
    wait until element is visible   ${ADD_NEW_DRAW_ICON}
    click element   ${ADD_NEW_DRAW_ICON}

HomePage.Click_Add_New_Audio_Icon
    wait until element is visible   ${ADD_NEW_AUDIO_ICON}
    click element   ${ADD_NEW_AUDIO_ICON}

HomePage.Click_Add_New_Photo_Icon
    wait until element is visible   ${ADD_NEW_PHOTO_ICON}
    click element   ${ADD_NEW_PHOTO_ICON}

HomePage.Search_Item
    [Arguments]  ${TEXT}
    wait until element is visible   ${SEARCH_BAR}
    input text  ${SEARCH_BAR}  ${TEXT}
