<?php
    include("Connect.php");


    function GetUserId($login, $password)
    {
        $connect = new Connect('todolist');
        $res = $connect->DoQuery("SELECT Id FROM Users WHERE Login='$login' AND Password='$password'");

        $id = "";
        while ($row = mysqli_fetch_array($res))
            $id = $row{'Id'};

        return $id;
    }


    function Read($login, $password)
    {
        $connect = new Connect('todolist');
        $res = $connect->DoQuery("SELECT * FROM TodoListItems WHERE OwnerId in (SELECT Id FROM Users WHERE Login='$login' AND Password='$password')");
        $json = array();

        while ($row = mysqli_fetch_array($res))
        {
            $json[] = ["Id" => $row{'Id'},
                "OwnerId" => $row{'OwnerId'},
                "Text" => $row{'Text'},
                "IsChecked" => $row{'IsChecked'}];
        }

        return json_encode($json);
    }


    function Update($login, $password, $id, $text)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("UPDATE TodoListItems SET Text='$text' WHERE OwnerId='".GetUserId($login, $password)."' AND Id='$id'");
    }


    function Create($login, $password, $text)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("INSERT INTO TodoListItems (OwnerId, Text, IsChecked) VALUES(".GetUserId($login, $password).",'$text', 0)");
    }


    function Delete($login, $password, $id)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("DELETE FROM TodoListItems WHERE OwnerId='".GetUserId($login, $password)."' AND Id='$id'");
    }


    function SetAllCheck($login, $password, $status)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("UPDATE TodoListItems SET IsChecked='$status' WHERE OwnerId='".GetUserId($login, $password)."'");
    }


    function DeleteAllChecked($login, $password)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("DELETE FROM TodoListItems WHERE OwnerId='".GetUserId($login, $password)."' AND IsChecked=1");
    }


    function SetOneCheck($login, $password, $id, $status)
    {
        $connect = new Connect('todolist');
        return $connect->Execute("UPDATE TodoListItems SET IsChecked='$status' WHERE OwnerId='".GetUserId($login, $password)."' AND Id='$id'");
    }


?>