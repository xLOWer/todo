<?php
class Connect
{
    private $link;
    private $user='root';
    private $server = 'localhost';
    private $database;
    private $password;
    private $key;
    private $iv;
    private $crypt;

    private $query_utf8= "SET character_set_results = 'utf8',character_set_client = 'utf8',
							character_set_connection = 'utf8',character_set_database = 'utf8',character_set_server = 'utf8'";

    function __construct($database)
    {
        $this->database = $database;
        $this->SetPassword();
    }

    private function SetPassword()
    {
        $this->key = substr(sha1($this->server, true), 0, 16);
        $this->iv = openssl_random_pseudo_bytes(16)
            or die("CONNECTION ERROR: SetPassword()->openssl_random_pseudo_bytes()");
        $this->crypt = openssl_encrypt(utf8_decode('some_crypted_password_phrase'), // do not forget override password
            'AES-128-CBC', $this->key, OPENSSL_RAW_DATA, $this->iv)
            or die("CONNECTION ERROR: SetPassword()->openssl_encrypt()");
        $this->password=openssl_decrypt($this->crypt,
            'AES-128-CBC',
            $this->key,
            OPENSSL_RAW_DATA, $this->iv);
    }

    public function DoQuery($query)
    {
        //if($query == "" ||$query == '')die("CONNECTION ERROR: DoQuery(): please setup correct QUERY argument");

        $this->link = mysqli_connect($this->server, $this->user, $this->password, $this->database)
            or die('CONNECTION ERROR: DoQuery(): Could not connect to '.$this->server);
        mysqli_query($this->link, $this->query_utf8) or die("CONNECTION ERROR: DoQuery()->mysqli_query(): set UTF8");
        $result = mysqli_query($this->link, $query) or die("CONNECTION ERROR: DoQuery()->mysqli_query()");
        mysqli_close($this->link) or die("CONNECTION ERROR: DoQuery()->mysqli_close()");

        return $result;
    }

    public function Execute($query)
    {
        $this->link = mysqli_connect($this->server, $this->user, $this->password, $this->database)
        or die('CONNECTION ERROR: DoQuery(): Could not connect to '.$this->server);
        mysqli_query($this->link, $this->query_utf8) or die("CONNECTION ERROR: DoQuery()->mysqli_query(): set UTF8");
        $prepare = $this->link->prepare($query) or die("CONNECTION ERROR: DoQuery()->prepare()");
        $result = $prepare->execute() or die("CONNECTION ERROR: DoQuery()->execute() <br>".$prepare->error);

        return $result;
    }
}