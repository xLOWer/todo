<?php

    include("../../classes/todolist.php");

    $status = $_POST['status'] == "true" ? "1" : "0"; // на какой статус меняем
    $login = $_POST['login'];
    $password = $_POST['password'];

    echo SetAllCheck($login, $password, $status);
?>