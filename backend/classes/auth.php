<?php
    include("Connect.php");


    function AddNewUser($login, $password)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("INSERT INTO Users (Login, Password, IsShared) VALUES ('{$login}', '{$password}', '0')");
    }


    function IsUserExists($login, $password)
    {
        $connect = new Connect('todolist');
        // конектимся к базе и дёргаем юзера для проверки
        $res = $connect->DoQuery("SELECT * FROM Users WHERE Login='$login' AND Password='$password'");
        //можно было бы и через SELECT COUNT(*) FROM Users WHERE Login='$login' AND Password='$password'

        $result = 0;
        while ($row = mysqli_fetch_array($res))
        {
            // выходим если чтото пошло не так или есть задвоение
            if($result > 1 || $result < 0) return false;
            $result++;//инкриментируем
        }
        //если вcё ок то выходим с true
        return $result != 1 ? false : true;

    }


    function IsLoginFree($login)
    {
        $connect = new Connect('todolist');
        // конектимся к базе и дёргаем юзера для проверки
        $res = $connect->DoQuery("SELECT * FROM Users WHERE Login='$login'");
        //можно было бы и через SELECT COUNT(*) FROM Users WHERE Login='$login' AND Password='$password'

        $result = 0;
        while ($row = mysqli_fetch_array($res))
        {
            // выходим если чтото пошло не так или есть задвоение
            if($result > 0) return false;
            $result++;//инкриментируем
        }
        //если вcё ок то выходим с true
        return $result == 0 ? true : false;

    }


    function IsAllowedLogin($login)
    {
        return count(preg_grep("/^[a-z0-9_-]{3,16}$/", explode("\n",$login))) == 1 ? true : false;
    }


    function IsAllowedPassword($password)
    {
        return count(preg_grep("/^[a-z0-9_-]{8,16}$/", explode("\n",$password))) == 1 ? true : false;
    }

?>