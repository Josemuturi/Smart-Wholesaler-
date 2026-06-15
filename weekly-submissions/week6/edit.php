<?php
// BIT3208: Advanced Web Design and Development
// Week 6: Database Integration and CRUD Operations
// Update (Edit) Product

include("db.php");

$errors = [];
$success = "";

// Check if id is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: index.php?err=Invalid product ID.");
    exit();
}

$id = intval($_GET['id']);

// Fetch existing product data
$stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
$stmt->close();

if (!$product) {
    header("Location: index.php?err=Product not found.");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $sku = trim($_POST['sku']);
    $category = trim($_POST['category']);
    $unit = trim($_POST['unit']);
    $unit_price = trim($_POST['unit_price']);
    $min_order_qty = trim($_POST['min_order_qty']);
    $stock_qty = trim($_POST['stock_qty']);
    $description = trim($_POST['description']);

    // Validation
    if (empty($name)) { $errors[] = "Product name is required."; }
    if (empty($sku)) { $errors[] = "SKU code is required."; }
    if (empty($category)) { $errors[] = "Category is required."; }
    if (empty($unit)) { $errors[] = "Packaging unit is required."; }
    
    if (!is_numeric($unit_price) || $unit_price < 0) {
        $errors[] = "Unit price must be a positive number.";
    }
    if (!is_numeric($min_order_qty) || $min_order_qty < 1) {
        $errors[] = "Minimum order quantity must be at least 1.";
    }
    if (!is_numeric($stock_qty) || $stock_qty < 0) {
        $errors[] = "Stock quantity cannot be negative.";
    }

    // Check unique SKU (excluding current product)
    if (empty($errors)) {
        $sku_check_stmt = $conn->prepare("SELECT id FROM products WHERE sku = ? AND id != ?");
        $sku_check_stmt->bind_param("si", $sku, $id);
        $sku_check_stmt->execute();
        $sku_check_stmt->store_result();
        if ($sku_check_stmt->num_rows > 0) {
            $errors[] = "A product with this SKU already exists.";
        }
        $sku_check_stmt->close();
    }

    // If no errors, update using prepared statements (SQL injection prevention)
    if (empty($errors)) {
        $update_stmt = $conn->prepare("UPDATE products SET name = ?, sku = ?, category = ?, unit = ?, unit_price = ?, min_order_qty = ?, stock_qty = ?, description = ? WHERE id = ?");
        $update_stmt->bind_param("ssssdiisi", $name, $sku, $category, $unit, $unit_price, $min_order_qty, $stock_qty, $description, $id);

        if ($update_stmt->execute()) {
            header("Location: index.php?msg=Product updated successfully!");
            exit();
        } else {
            $errors[] = "Database update error: " . $update_stmt->error;
        }
        $update_stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Product | Smart Wholesaler</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container" style="max-width: 700px;">
        <header>
            <div>
                <h1>📝 Edit Product Details</h1>
                <p class="subtitle">Modify product fields below and save changes</p>
            </div>
            <a href="index.php" class="btn btn-secondary">Back to Catalog</a>
        </header>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger" id="error-list">
                <ul style="padding-left: 1.25rem;">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <div class="card">
            <form action="edit.php?id=<?php echo $id; ?>" method="POST" id="edit-product-form">
                <div class="grid">
                    <div class="form-group">
                        <label for="name">Product Name *</label>
                        <input type="text" name="name" id="name" required placeholder="e.g. Kabras Sugar" value="<?php echo htmlspecialchars($product['name']); ?>">
                    </div>
                    <div class="form-group">
                        <label for="sku">SKU Code *</label>
                        <input type="text" name="sku" id="sku" required placeholder="e.g. SKU-002" value="<?php echo htmlspecialchars($product['sku']); ?>">
                    </div>
                </div>

                <div class="grid">
                    <div class="form-group">
                        <label for="category">Category *</label>
                        <select name="category" id="category" required>
                            <option value="Flour & Grains" <?php echo ($product['category'] == 'Flour & Grains') ? 'selected' : ''; ?>>Flour & Grains</option>
                            <option value="Sugar & Sweeteners" <?php echo ($product['category'] == 'Sugar & Sweeteners') ? 'selected' : ''; ?>>Sugar & Sweeteners</option>
                            <option value="Cooking Oils" <?php echo ($product['category'] == 'Cooking Oils') ? 'selected' : ''; ?>>Cooking Oils</option>
                            <option value="Dairy & Eggs" <?php echo ($product['category'] == 'Dairy & Eggs') ? 'selected' : ''; ?>>Dairy & Eggs</option>
                            <option value="Beverages" <?php echo ($product['category'] == 'Beverages') ? 'selected' : ''; ?>>Beverages</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="unit">Packaging Unit *</label>
                        <input type="text" name="unit" id="unit" required placeholder="e.g. 50kg bag" value="<?php echo htmlspecialchars($product['unit']); ?>">
                    </div>
                </div>

                <div class="grid">
                    <div class="form-group">
                        <label for="unit_price">Unit Price (KSh) *</label>
                        <input type="number" step="0.01" min="0" name="unit_price" id="unit_price" required placeholder="e.g. 2100.00" value="<?php echo htmlspecialchars($product['unit_price']); ?>">
                    </div>
                    <div class="form-group">
                        <label for="min_order_qty">Minimum Order Qty *</label>
                        <input type="number" min="1" name="min_order_qty" id="min_order_qty" required placeholder="e.g. 10" value="<?php echo htmlspecialchars($product['min_order_qty']); ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="stock_qty">Stock Quantity *</label>
                    <input type="number" min="0" name="stock_qty" id="stock_qty" required placeholder="e.g. 220" value="<?php echo htmlspecialchars($product['stock_qty']); ?>">
                </div>

                <div class="form-group">
                    <label for="description">Product Description</label>
                    <textarea name="description" id="description" rows="4" placeholder="Brief details about the product..."><?php echo htmlspecialchars($product['description']); ?></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" id="submit-btn" class="btn btn-primary">Save Changes</button>
                    <a href="index.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
