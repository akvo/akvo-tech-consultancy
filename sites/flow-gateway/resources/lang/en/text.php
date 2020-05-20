<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Text shown as Question Instructions Language Lines
    |--------------------------------------------------------------------------
    |
    |
    */

    "welcome" => "Welcome to Akvo Flow Survey",
    "end" => "Thanks for completing the survey!",
    "error" => "error input, please recheck your input.",
    "cascade" => "Type the code inside the bracket.",
    "validate" => [
        "options" => "* Please select a response from the available options. *",
        "numeric" => "* Please input a numeric value. *",
    ],
    "ask" => [
        "hi" => "Hi :phone",
        "info" => "You haven't finished the :name survey.",
        "continue" => "Would you like to continue?",
        "response" => ["y" => "Yes (Y)", "n" => "No (N)"],
    ],
    "destroy" => [
        "success" => "Your previous incomplete submission has been deleted.",
        "info" => "Please redial the number to start a new submission.",
    ],
    "start" => [
        "info" => "Please reply with the following format to start new survey session:",
        "format" => "*INSTANCE_NAME#FORM_ID*",
    ],
    "session" => [
        "info" => "You have the unfinished session, ",
        "remove" => "If you wish to remove the session, please type:",
        "show" => "If you want to show the last question from the last session, please type:",
        "restart" => "Your session restarted, ",
    ],
];
