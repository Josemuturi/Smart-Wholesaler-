<?php
// BIT3208: Advanced Web Design and Development
// Week 6: Database Integration and CRUD Operations
// Database Connection Configuration

$host = "localhost";
$username = "root";
$password = "";
$dbname = "smart_wholesaler_db";

// Connect to MySQL
$conn = mysqli_connect($host, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
