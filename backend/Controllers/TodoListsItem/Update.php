<?php

    include("../../classes/todolist.php");

    $id = $_POST['id']; // id чего меняем статус
    $text = $_POST['text']; // на какой текст меняем
    $login = $_POST['login'];
    $password = $_POST['password'];

    echo Update($login, $password, $id, $text);

?>