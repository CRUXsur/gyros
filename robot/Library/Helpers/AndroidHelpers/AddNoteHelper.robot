*** Settings ***
Library    AppiumLibrary
Resource    ./Library/Pages/AndroidPages/HomePage.robot
Resource    ./Library/Pages/AndroidPages/AddNotePage.robot

*** Keywords ***
Add New Note With Two Items
    [Arguments]  ${TITLE}  ${ITEM-1}  ${ITEM-2}

    HomePage.Click_Add_New_Note_Icon
    AddNotePage.Enter_Title  ${TITLE}
    AddNotePage.Enter_Item  ${ITEM-1}   0
#    AddNotePage.Enable_Next_Item
#    AddNotePage.Enter_Item  ${ITEM-2}   1
    AddNotePage.Click_Save_Button
#    HomePage.Wait_For_Home_Page

