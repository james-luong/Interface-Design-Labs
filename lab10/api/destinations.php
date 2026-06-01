<?php
// ============================================================
// REST API: /api/destinations.php
// ============================================================

// Suppress PHP notices/warnings so they never corrupt JSON output
error_reporting(0);
ini_set('display_errors', '0');
ob_start(); // buffer any accidental output

header('Content-Type: application/json; charset=utf-8');
// Allow requests from the same origin (and dev proxy)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;
$conn   = getConnection();

switch ($method) {

    // ----------------------------------------------------------
    case 'GET':
    // ----------------------------------------------------------
        if ($id) {
            // Fetch single record
            $stmt = $conn->prepare('SELECT * FROM destinations WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            if ($row) {
                echo json_encode($row);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Destination not found']);
            }
        } else {
            // Paginated list with optional search and category filter
            $page     = max(1, (int) (isset($_GET['page'])     ? $_GET['page']     : 1));
            $limit    = max(1, (int) (isset($_GET['limit'])    ? $_GET['limit']    : 5));
            $search   = trim(isset($_GET['search'])   ? $_GET['search']   : '');
            $category = trim(isset($_GET['category']) ? $_GET['category'] : '');
            $offset   = ($page - 1) * $limit;

            // Build WHERE clause
            $where  = [];
            $params = [];
            $types  = '';

            if ($search !== '') {
                $like = "%{$search}%";
                $where[]  = '(name LIKE ? OR country LIKE ? OR description LIKE ?)';
                $params   = array_merge($params, [$like, $like, $like]);
                $types   .= 'sss';
            }
            if ($category !== '') {
                $where[]  = 'category = ?';
                $params[] = $category;
                $types   .= 's';
            }

            $w = $where ? 'WHERE ' . implode(' AND ', $where) : '';

            // Total count (with filters)
            // Use call_user_func_array to avoid spread operator compatibility issues
            $countSql  = "SELECT COUNT(*) AS c FROM destinations $w";
            $countStmt = $conn->prepare($countSql);
            if ($types && count($params) > 0) {
                $bindArgs = array_merge([$types], $params);
                $refs = [];
                foreach ($bindArgs as $k => $v) { $refs[$k] = &$bindArgs[$k]; }
                call_user_func_array([$countStmt, 'bind_param'], $refs);
            }
            $countStmt->execute();
            $total = (int) $countStmt->get_result()->fetch_assoc()['c'];

            // Paginated rows
            $dataSql   = "SELECT * FROM destinations $w ORDER BY id LIMIT ? OFFSET ?";
            $dataStmt  = $conn->prepare($dataSql);
            $allTypes  = $types . 'ii';
            $allParams = array_merge($params, [$limit, $offset]);
            $bindArgs  = array_merge([$allTypes], $allParams);
            $refs = [];
            foreach ($bindArgs as $k => $v) { $refs[$k] = &$bindArgs[$k]; }
            call_user_func_array([$dataStmt, 'bind_param'], $refs);
            $dataStmt->execute();
            $result = $dataStmt->get_result();

            $rows = [];
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            // Response format matches what the Vue frontend expects
            echo json_encode([
                'data'       => $rows,
                'pagination' => [
                    'total'      => $total,
                    'page'       => $page,
                    'limit'      => $limit,
                    'totalPages' => (int) ceil($total / max($limit, 1)),
                ],
            ]);
        }
        break;

    // ----------------------------------------------------------
    case 'POST':
    // ----------------------------------------------------------
        $input = json_decode(file_get_contents('php://input'), true);

        if (!validateInput($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: name, country, category, rating']);
            break;
        }

        $stmt = $conn->prepare(
            'INSERT INTO destinations (name, country, category, description, rating)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->bind_param(
            'ssssd',
            $input['name'],
            $input['country'],
            $input['category'],
            $input['description'],
            $input['rating']
        );

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['id' => $conn->insert_id, 'message' => 'Destination created']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create destination']);
        }
        break;

    // ----------------------------------------------------------
    case 'PUT':
    // ----------------------------------------------------------
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required for update']);
            break;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!validateInput($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: name, country, category, rating']);
            break;
        }

        $stmt = $conn->prepare(
            'UPDATE destinations
             SET name=?, country=?, category=?, description=?, rating=?
             WHERE id=?'
        );
        $stmt->bind_param(
            'ssssdi',
            $input['name'],
            $input['country'],
            $input['category'],
            $input['description'],
            $input['rating'],
            $id
        );

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Destination updated']);
        } elseif ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Destination not found']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update destination']);
        }
        break;

    // ----------------------------------------------------------
    case 'DELETE':
    // ----------------------------------------------------------
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required for delete']);
            break;
        }

        $stmt = $conn->prepare('DELETE FROM destinations WHERE id = ?');
        $stmt->bind_param('i', $id);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Destination deleted']);
        } elseif ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Destination not found']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete destination']);
        }
        break;

    // ----------------------------------------------------------
    default:
    // ----------------------------------------------------------
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();

// ----------------------------------------------------------
// Helper: validate required fields
// ----------------------------------------------------------
function validateInput($input) {
    if (!$input || !is_array($input)) return false;
    foreach (array('name', 'country', 'category', 'rating') as $field) {
        if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
            return false;
        }
    }
    $rating = (float) $input['rating'];
    return $rating >= 0.0 && $rating <= 5.0;
}
