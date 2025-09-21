*** Settings ***
Library    AppiumLibrary
Resource    ../../Pages/AndroidPages/HomePage.robot
Resource    ../../Pages/AndroidPages/AddNotePage.robot

*** Keywords ***
Add New Note With Two Items
    [Arguments]  ${TITLE}  ${ITEM-1}  ${ITEM-2}

    HomePage.Click_Add_New_Text_Icon
    AddNotePage.Enter_Title  ${TITLE}
    AddNotePage.Enter_Item  ${ITEM-1}   0
#    AddNotePage.Enable_Next_Item
#    AddNotePage.Enter_Item  ${ITEM-2}   1
#    AddNotePage.Click_Save_Button
    AddNotePage.Back_Arrow
    HomePage.Wait_For_Home_Page

