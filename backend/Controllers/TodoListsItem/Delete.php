<?php

    include("../../classes/todolist.php");

    $id = $_POST['id']; // id чего удаляем
    $login = $_POST['login'];
    $password = $_POST['password'];

    echo Delete($login, $password, $id);
?>