<?php
// BIT3208: Advanced Web Design and Development
// Week 7: User Authentication and Session Management
// User Registration System

include("db.php");

$errors = [];
$success = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $role = $_POST['role'];

    // Validation
    if (empty($fullname)) { $errors[] = "Full Name is required."; }
    if (empty($email)) { $errors[] = "Email is required."; }
    if (empty($password)) { $errors[] = "Password is required."; }
    if (strlen($password) < 6) { $errors[] = "Password must be at least 6 characters long."; }
    if ($role !== 'distributor' && $role !== 'retailer') { $errors[] = "Invalid user role selected."; }

    // Check if email already exists
    if (empty($errors)) {
        $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_stmt->store_result();
        if ($check_stmt->num_rows > 0) {
            $errors[] = "Email is already registered.";
        }
        $check_stmt->close();
    }

    // Insert user with hashed password
    if (empty($errors)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $fullname, $email, $hashed_password, $role);

        if ($stmt->execute()) {
            $success = "Registration successful! You can now log in.";
            // Redirect to login after 2 seconds
            header("refresh:2;url=login.php");
        } else {
            $errors[] = "Registration failed: " . $stmt->error;
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | Smart Wholesaler</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join Smart Wholesaler Portal (Secure-Duka)</p>
        </div>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger" id="error-list">
                <ul style="padding-left: 1rem; margin: 0;">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if (!empty($success)): ?>
            <div class="alert alert-success" id="success-message">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>

        <div class="card">
            <form action="register.php" method="POST" id="register-form">
                <div class="form-group">
                    <label for="fullname">Full Name</label>
                    <input type="text" name="fullname" id="fullname" placeholder="e.g. Alice Kamau" required value="<?php echo isset($_POST['fullname']) ? htmlspecialchars($_POST['fullname']) : ''; ?>">
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" name="email" id="email" placeholder="name@company.com" required value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" required>
                </div>

                <div class="form-group">
                    <label for="role">Select Account Type</label>
                    <select name="role" id="role" required>
                        <option value="retailer" <?php echo (isset($_POST['role']) && $_POST['role'] == 'retailer') ? 'selected' : ''; ?>>Retailer (Buyer)</option>
                        <option value="distributor" <?php echo (isset($_POST['role']) && $_POST['role'] == 'distributor') ? 'selected' : ''; ?>>Distributor (Merchant)</option>
                    </select>
                </div>

                <button type="submit" id="register-btn" class="btn btn-primary">Register</button>
            </form>
        </div>

        <div class="auth-footer">
            Already have an account? <a href="login.php" id="login-link">Log In</a>
        </div>
    </div>
</body>
</html>
