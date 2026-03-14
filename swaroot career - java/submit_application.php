<?php
header('Content-Type: application/json');

$link = mysqli_connect("localhost", "root", "", "svaroots");

if (!$link) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$first_name = isset($_POST['first_name']) ? mysqli_real_escape_string($link, trim($_POST['first_name'])) : '';
$last_name  = isset($_POST['last_name'])  ? mysqli_real_escape_string($link, trim($_POST['last_name']))  : '';
$email      = isset($_POST['email'])      ? mysqli_real_escape_string($link, trim($_POST['email']))      : '';
$phone      = isset($_POST['phone'])      ? mysqli_real_escape_string($link, trim($_POST['phone']))      : '';

if (!$first_name || !$last_name || !$email || !$phone) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit;
}

$cv_filename = '';

if (isset($_FILES['cv']) && $_FILES['cv']['error'] === 0) {

    $allowed_types = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    $max_size      = 25 * 1024 * 1024; // 25 MB

    if (!in_array($_FILES['cv']['type'], $allowed_types)) {
        echo json_encode(["success" => false, "error" => "Invalid file type"]);
        exit;
    }

    if ($_FILES['cv']['size'] > $max_size) {
        echo json_encode(["success" => false, "error" => "File too large (max 25MB)"]);
        exit;
    }

    $upload_dir = __DIR__ . "/uploads/";

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $cv_filename = time() . "_" . basename($_FILES["cv"]["name"]);

    if (!move_uploaded_file($_FILES["cv"]["tmp_name"], $upload_dir . $cv_filename)) {
        echo json_encode(["success" => false, "error" => "File upload failed"]);
        exit;
    }

} else {
    echo json_encode(["success" => false, "error" => "CV file is required"]);
    exit;
}

$query = "INSERT INTO applications (first_name, last_name, email, phone, cv_file)
          VALUES ('$first_name', '$last_name', '$email', '$phone', '$cv_filename')";

$result = mysqli_query($link, $query);

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($link)]);
}

mysqli_close($link);
?>