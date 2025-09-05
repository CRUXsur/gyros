
*** Settings ***
Library     AppiumLibrary
Resource    ../Library/Helpers/AndroidHelpers/AppHelper.robot
Resource    ../Library/Helpers/AndroidHelpers/AddNoteHelper.robot

Resource    ../Library/Pages/AndroidPages/HomePage.robot
Resource    ../Library/Pages/AndroidPages/AddNotePage.robot

Library     ../Library/PyLibs/Utility.py

Resource    ../Library/Resource/BaseTest.robot
Library     ../Library/PyLibs/Utility.py

Suite Setup         BeforeSuite     GOOGLE_KEEP_NOTE
Suite Teardown      AfterSuite      GOOGLE_KEEP_NOTE

Test Setup          BeforeTest


*** Test Cases ***
AddNewNoteWithMultipleItems
    ${title}  get_random_string    5  Title
    ${item1}  get_random_string    3  Item
    ${item2}  get_random_string    3  Item


    Add New Note With Two Items     ${title}   ${item1}   ${item2}




