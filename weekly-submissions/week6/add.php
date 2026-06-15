<?php
// BIT3208: Advanced Web Design and Development
// Week 6: Database Integration and CRUD Operations
// Create (Add) Product

include("db.php");

$errors = [];
$success = "";

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
    if (empty($unit)) { $errors[] = "Packaging unit is required (e.g. '50kg bag')."; }
    
    if (!is_numeric($unit_price) || $unit_price < 0) {
        $errors[] = "Unit price must be a positive number.";
    }
    if (!is_numeric($min_order_qty) || $min_order_qty < 1) {
        $errors[] = "Minimum order quantity must be at least 1.";
    }
    if (!is_numeric($stock_qty) || $stock_qty < 0) {
        $errors[] = "Stock quantity cannot be negative.";
    }

    // Check unique SKU
    if (empty($errors)) {
        $sku_check_stmt = $conn->prepare("SELECT id FROM products WHERE sku = ?");
        $sku_check_stmt->bind_param("s", $sku);
        $sku_check_stmt->execute();
        $sku_check_stmt->store_result();
        if ($sku_check_stmt->num_rows > 0) {
            $errors[] = "A product with this SKU already exists.";
        }
        $sku_check_stmt->close();
    }

    // If no errors, insert using prepared statements (SQL injection prevention)
    if (empty($errors)) {
        $stmt = $conn->prepare("INSERT INTO products (name, sku, category, unit, unit_price, min_order_qty, stock_qty, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssdiis", $name, $sku, $category, $unit, $unit_price, $min_order_qty, $stock_qty, $description);

        if ($stmt->execute()) {
            header("Location: index.php?msg=Product added successfully!");
            exit();
        } else {
            $errors[] = "Database insertion error: " . $stmt->error;
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
    <title>Add New Product | Smart Wholesaler</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container" style="max-width: 700px;">
        <header>
            <div>
                <h1>➕ Add Wholesale Product</h1>
                <p class="subtitle">Enter new product information to save it to database</p>
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
            <form action="add.php" method="POST" id="add-product-form">
                <div class="grid">
                    <div class="form-group">
                        <label for="name">Product Name *</label>
                        <input type="text" name="name" id="name" required placeholder="e.g. Unga Pembe Wheat Flour" value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="sku">SKU Code *</label>
                        <input type="text" name="sku" id="sku" required placeholder="e.g. SKU-009" value="<?php echo isset($_POST['sku']) ? htmlspecialchars($_POST['sku']) : ''; ?>">
                    </div>
                </div>

                <div class="grid">
                    <div class="form-group">
                        <label for="category">Category *</label>
                        <select name="category" id="category" required>
                            <option value="">Select Category</option>
                            <option value="Flour & Grains">Flour & Grains</option>
                            <option value="Sugar & Sweeteners">Sugar & Sweeteners</option>
                            <option value="Cooking Oils">Cooking Oils</option>
                            <option value="Dairy & Eggs">Dairy & Eggs</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="unit">Packaging Unit *</label>
                        <input type="text" name="unit" id="unit" required placeholder="e.g. 50kg bag, 20L jerry can" value="<?php echo isset($_POST['unit']) ? htmlspecialchars($_POST['unit']) : ''; ?>">
                    </div>
                </div>

                <div class="grid">
                    <div class="form-group">
                        <label for="unit_price">Unit Price (KSh) *</label>
                        <input type="number" step="0.01" min="0" name="unit_price" id="unit_price" required placeholder="e.g. 2400.00" value="<?php echo isset($_POST['unit_price']) ? htmlspecialchars($_POST['unit_price']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="min_order_qty">Minimum Order Qty *</label>
                        <input type="number" min="1" name="min_order_qty" id="min_order_qty" required placeholder="e.g. 5" value="<?php echo isset($_POST['min_order_qty']) ? htmlspecialchars($_POST['min_order_qty']) : '1'; ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="stock_qty">Stock Quantity *</label>
                    <input type="number" min="0" name="stock_qty" id="stock_qty" required placeholder="e.g. 100" value="<?php echo isset($_POST['stock_qty']) ? htmlspecialchars($_POST['stock_qty']) : '0'; ?>">
                </div>

                <div class="form-group">
                    <label for="description">Product Description</label>
                    <textarea name="description" id="description" rows="4" placeholder="Brief details about the product..."><?php echo isset($_POST['description']) ? htmlspecialchars($_POST['description']) : ''; ?></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" id="submit-btn" class="btn btn-primary">Save Product</button>
                    <a href="index.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
