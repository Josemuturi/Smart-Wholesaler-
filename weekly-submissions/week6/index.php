<?php
// BIT3208: Advanced Web Design and Development
// Week 6: Database Integration and CRUD Operations
// Main Product Management Dashboard

include("db.php");

// Fetch products from database
$sql = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($conn, $sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Inventory Management | Smart Wholesaler</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>📦 Product Inventory</h1>
                <p class="subtitle">Smart Wholesaler (Secure-Duka) — Week 6 CRUD Operations</p>
            </div>
            <a href="add.php" id="add-product-btn" class="btn btn-primary">+ Add New Product</a>
        </header>

        <?php if (isset($_GET['msg'])): ?>
            <div class="alert alert-success" id="alert-message">
                <?php echo htmlspecialchars($_GET['msg']); ?>
            </div>
        <?php endif; ?>

        <?php if (isset($_GET['err'])): ?>
            <div class="alert alert-danger" id="error-message">
                <?php echo htmlspecialchars($_GET['err']); ?>
            </div>
        <?php endif; ?>

        <div class="card">
            <div class="table-container">
                <table id="products-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Packaging Unit</th>
                            <th>Unit Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (mysqli_num_rows($result) > 0): ?>
                            <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                <tr id="product-row-<?php echo $row['id']; ?>">
                                    <td><strong><?php echo htmlspecialchars($row['sku']); ?></strong></td>
                                    <td><?php echo htmlspecialchars($row['name']); ?></td>
                                    <td><?php echo htmlspecialchars($row['category']); ?></td>
                                    <td><?php echo htmlspecialchars($row['unit']); ?></td>
                                    <td>KSh <?php echo number_format($row['unit_price'], 2); ?></td>
                                    <td>
                                        <?php if ($row['stock_qty'] > 10): ?>
                                            <span class="badge badge-success"><?php echo $row['stock_qty']; ?> in stock</span>
                                        <?php elseif ($row['stock_qty'] > 0): ?>
                                            <span class="badge badge-warning"><?php echo $row['stock_qty']; ?> low stock</span>
                                        <?php else: ?>
                                            <span class="badge badge-danger">Out of stock</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-links">
                                            <a href="edit.php?id=<?php echo $row['id']; ?>" class="btn btn-secondary btn-sm" id="edit-btn-<?php echo $row['id']; ?>">Edit</a>
                                            <a href="delete.php?id=<?php echo $row['id']; ?>" class="btn btn-danger btn-sm" id="delete-btn-<?php echo $row['id']; ?>" onclick="return confirm('Are you sure you want to delete this product?');">Delete</a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" style="text-align: center; color: var(--color-text-muted);">No products found in the catalog.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
