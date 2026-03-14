<?php
// save_design.php — Saves a sneaker customizer design to the database

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ── Database Configuration ──────────────────────────────────────────────────
$db_host = 'localhost';
$db_user = 'root'; // Default XAMPP MySQL user
$db_pass = ''; // Default XAMPP MySQL password (empty)
$db_name = 'user_designs';

// ── Connect ─────────────────────────────────────────────────────────────────
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// ── Only accept POST ─────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ── Read & sanitize input ────────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    // Fall back to form-encoded POST
    $input = $_POST;
}

$username = $conn->real_escape_string(trim($input['username'] ?? 'guest'));
$gender = $conn->real_escape_string(trim($input['gender'] ?? ''));
$sneaker_size = $conn->real_escape_string(trim($input['sneaker_size'] ?? ''));
$sneaker_color = $conn->real_escape_string(trim($input['sneaker_color'] ?? ''));
$fabric = $conn->real_escape_string(trim($input['fabric'] ?? ''));
$motif = $conn->real_escape_string(trim($input['motif'] ?? ''));
$lace = $conn->real_escape_string(trim($input['lace'] ?? ''));
$background_color = $conn->real_escape_string(trim($input['background_color'] ?? ''));
$design_name = $conn->real_escape_string(trim($input['design_name'] ?? 'My Design'));

// ── Insert ───────────────────────────────────────────────────────────────────
$sql = "INSERT INTO saved_options
            (username, gender, sneaker_size, sneaker_color, fabric, motif, lace, background_color, design_name, created_at)
        VALUES
            ('$username', '$gender', '$sneaker_size', '$sneaker_color', '$fabric', '$motif', '$lace', '$background_color', '$design_name', NOW())";

if ($conn->query($sql)) {
    $new_id = $conn->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Design saved successfully!'
    ]);
}
else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save design: ' . $conn->error
    ]);
}

$conn->close();
?>