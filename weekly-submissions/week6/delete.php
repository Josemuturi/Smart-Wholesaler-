<?php
// BIT3208: Advanced Web Design and Development
// Week 6: Database Integration and CRUD Operations
// Delete Product

include("db.php");

// Check if id is provided
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);

    // Delete using prepared statement
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        header("Location: index.php?msg=Product deleted successfully!");
        exit();
    } else {
        header("Location: index.php?err=Failed to delete product: " . urlencode($stmt->error));
        exit();
    }
    $stmt->close();
} else {
    header("Location: index.php?err=Invalid product ID.");
    exit();
}
?>
