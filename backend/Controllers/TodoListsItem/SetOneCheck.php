<?php

    include("../../classes/todolist.php");

    $id = $_POST['id']; // id чего меняем статус
    $status = $_POST['status'] == "true" ? "1" : "0";; // на какой статус меняем
    $login = $_POST['login'];
    $password = $_POST['password'];

    echo SetOneCheck($login, $password, $id, $status);
?>