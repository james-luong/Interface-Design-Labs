<?php
// ============================================================
// Database configuration
// EDIT these values before deploying to Mercury
// ============================================================

define('DB_HOST', 'feenix-mariadb.swin.edu.au');
define('DB_PORT', '3306');
define('DB_USER', 's104070337');
define('DB_PASS', '111004');
define('DB_NAME', 's104070337_db');
// If connection fails with "No such file or directory", set this to the
// socket path shown by: mysql -u s104070337 -p then SHOW VARIABLES LIKE 'socket';
// define('DB_SOCKET', '/var/lib/mysql/mysql.sock');   // e.g. '/var/run/mysqld/mysqld.sock'

function getConnection() {
    if (DB_SOCKET) {
        // Connect via Unix socket (needed when TCP is unavailable)
        $conn = new mysqli(null, DB_USER, DB_PASS, DB_NAME, null, DB_SOCKET);
    } else {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    }
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
