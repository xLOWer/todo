<?php

    include("../../classes/todolist.php");

    $login = $_POST['login'];
    $password = $_POST['password'];

    echo DeleteAllChecked($login, $password);
?>