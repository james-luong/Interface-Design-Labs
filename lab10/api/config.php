<?php
// ============================================================
// Database configuration
// EDIT these values before deploying to Mercury
// ============================================================

// ── LOCAL (XAMPP) settings ────────────────────────────────
define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3306);
define('DB_USER', 'root');
define('DB_PASS', '');           // XAMPP default is no password
define('DB_NAME', 'lab10_travel');

// ── MERCURY settings (swap these in when deploying) ───────
// define('DB_HOST', 'feenix-mariadb.swin.edu.au');
// define('DB_PORT', 3306);
// define('DB_USER', 's104070337');
// define('DB_PASS', '111004');
// define('DB_NAME', 's104070337_db');

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
