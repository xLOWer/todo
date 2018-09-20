<?php
    include("../../classes/auth.php");


    if(isset($_COOKIE['login']) && isset($_COOKIE['password']))
    {
        $login = $_COOKIE['login'];
        $password = $_COOKIE['password'];

        if(IsUserExists($login, $password))
        {
            setcookie ("login", $login, time() + 360, '/todo-list/');
            setcookie ("password", $password, time() + 360, '/todo-list/');
        }
        else echo "FAIL";
    }
    else
    {
        $login = $_POST['login'];
        $password = $_POST['password'];

        if(IsUserExists($login, $password))
        {
            setcookie ("login", $login, time() + 360, '/todo-list/');
            setcookie ("password", $password, time() + 360, '/todo-list/');
        }
        else echo "FAIL";
    }

?>