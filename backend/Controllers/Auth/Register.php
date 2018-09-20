<?php

    include("../../classes/auth.php");

    $login = $_POST['login'];
    $password = $_POST['password'];

    if(IsLoginFree($login))
    {
        //ограничиваем количество регистраций в сутки
        if(isset($_COOKIE['register_count']) && $_COOKIE['register_count'] > 5)
            echo "FAIL";

        setcookie ("register_count", isset($_COOKIE['register_count'])?$_COOKIE['register_count']+1:"1", time() + 60*60*24, '/todo-list/');
        AddNewUser($login, $password);
    }
    else echo "FAIL";


?>