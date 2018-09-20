<?php

    include("../../classes/todolist.php");

    $login = $_POST['login'];
    $password = $_POST['password'];
    $text = $_POST['text'];

    echo Create($login, $password, $text);
?>