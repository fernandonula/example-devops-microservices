<?php
class DbManager {

private $conn;

function __construct(){
    //Connecting to MongoDB
    try {
        //Establish database connection
        $this->conn = new MongoDB\Driver\Manager('mongodb+srv://thinkontmp:kwKjDt6NMv3AoS8B@cluster0.7h8q462.mongodb.net/?retryWrites=true&w=majority');
    }catch (MongoDBDriverExceptionException $e) {
        echo $e->getMessage();
        echo nl2br("n");
    }
}

function getConnection() {
    return $this->conn;
}

}
?>