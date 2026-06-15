# Week 6 — Database Integration and CRUD Operations

## What This Week Covers
- Connecting a web application to a MySQL database using PHP (`mysqli_connect`)
- Creating tables, schemas, and seeding initial records for the "Smart Wholesaler" catalog
- Implementing complete CRUD (Create, Read, Update, Delete) operations in PHP
- Designing user-friendly forms for data entry with client & server-side validation
- Preventing SQL Injection security risks by utilizing PHP Prepared Statements (`prepare`, `bind_param`)
- Handling user-friendly interface alerts for CRUD actions

## Folder Structure (Week 6)

```
week6/
├── README.md
├── schema.sql           ← MySQL database schema & seed data
├── db.php               ← Database connection utility
├── style.css            ← Modern layout & responsive theme stylesheet
├── index.php            ← Read/Display products in a dashboard
├── add.php              ← Create (form & processing)
├── edit.php             ← Update (form & processing)
└── delete.php           ← Delete (record deletion)
```

## Running the Web App locally

1. Import `schema.sql` into your local MySQL server (e.g. via phpMyAdmin or MySQL CLI):
   ```sql
   mysql -u root -p < schema.sql
   ```
2. Place the `week6` directory inside your local web server document root (e.g., `htdocs` for XAMPP or `www` for WampServer).
3. Access the application in your browser:
   ```
   http://localhost/week6/index.php
   ```

## GitHub Commit Message for This Week
```
Week 6: Database connection, product CRUD operations, prepared statements, input validation
```
