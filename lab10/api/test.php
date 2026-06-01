<?php
// DIAGNOSTIC SCRIPT - delete this file after fixing the connection
// Upload to Mercury and visit: /api/test.php

error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain');

echo "=== PHP Version ===\n";
echo PHP_VERSION . "\n\n";

echo "=== MySQL socket paths to try ===\n";
$sockets = array(
    '/var/run/mysqld/mysqld.sock',
    '/tmp/mysql.sock',
    '/var/lib/mysql/mysql.sock',
    '/var/mysql/mysql.sock',
);
foreach ($sockets as $s) {
    echo $s . ' : ' . (file_exists($s) ? 'EXISTS' : 'not found') . "\n";
}

echo "\n=== php.ini MySQL default socket ===\n";
echo ini_get('mysqli.default_socket') . "\n";
echo ini_get('mysql.default_socket') . "\n";

echo "\n=== Trying connection methods ===\n";

$user = 's104070337';
$pass = '111004';
$db   = 's104070337_db';

$hosts = array(
    'localhost',
    '127.0.0.1',
    'mercury.swin.edu.au',
    'mercury',
    'db.mercury.swin.edu.au',
    'mysql.swin.edu.au',
    'mysql',
    gethostname(),
);

foreach ($hosts as $host) {
    $c = @new mysqli($host, $user, $pass, $db);
    echo str_pad($host, 30) . ': ' . ($c->connect_error ? $c->connect_error : '*** OK ***') . "\n";
}

echo "\n=== Server hostname ===\n";
echo gethostname() . "\n";
echo php_uname('n') . "\n";

foreach ($sockets as $s) {
    $c = @new mysqli(null, $user, $pass, $db, null, $s);
    echo "socket $s : " . ($c->connect_error ? $c->connect_error : 'OK') . "\n";
}

echo "\n=== Done ===\n";
echo "Delete this file after fixing config.php!\n";
