<?php
// BIT3208: Advanced Web Design and Development
// Week 7: User Authentication and Session Management
// Protected Dashboard

session_start();

// Redirect to login if user is not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_name = $_SESSION['user_name'];
$user_email = $_SESSION['user_email'];
$user_role = $_SESSION['user_role'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Smart Wholesaler</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container-dashboard">
        <header class="dashboard-header">
            <div>
                <h1>🏪 Smart Wholesaler Portal</h1>
                <p style="color: var(--color-text-secondary); font-size: 0.9rem;">Week 7 Secure Session Management Dashboard</p>
            </div>
            <a href="logout.php" id="logout-btn" class="btn btn-secondary">Logout</a>
        </header>

        <div class="card">
            <h2>Welcome back, <?php echo htmlspecialchars($user_name); ?>!</h2>
            <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">You have successfully authenticated via a secure PHP Session.</p>

            <div class="user-info">
                <div class="avatar">
                    <?php echo strtoupper(substr($user_name, 0, 1)); ?>
                </div>
                <div>
                    <h3 style="font-size: 1.1rem; font-weight: 600;"><?php echo htmlspecialchars($user_name); ?></h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.25rem;"><?php echo htmlspecialchars($user_email); ?></p>
                    <span class="badge badge-<?php echo ($user_role === 'distributor') ? 'distributor' : 'retailer'; ?>">
                        <?php echo htmlspecialchars($user_role); ?>
                    </span>
                </div>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--color-text-primary);">Role-Based Authorization Privileges:</h4>
                
                <?php if ($user_role === 'distributor'): ?>
                    <div style="background: rgba(108, 99, 255, 0.05); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-accent);">
                        <p style="font-size: 0.9rem; color: var(--color-text-secondary);">
                            <strong>Distributor Mode Enabled:</strong> You have full write permissions to manage the global wholesale catalog, adjust bulk pricing, check warehouse stock inventories, and handle incoming retailer orders.
                        </p>
                    </div>
                <?php else: ?>
                    <div style="background: rgba(16, 185, 129, 0.05); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-success);">
                        <p style="font-size: 0.9rem; color: var(--color-text-secondary);">
                            <strong>Retailer Mode Enabled:</strong> You have permissions to browse products, select wholesale items, customize order quantities, build shopping carts, and place dynamic supply orders.
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
