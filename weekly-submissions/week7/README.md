# Week 7 — User Authentication and Session Management

## What This Week Covers
- Defining user authentication vs role-based authorization
- Implementing secure user registration using bcrypt password hashing (`password_hash`)
- Creating secure user login processing with password verification (`password_verify`)
- Managing user sessions securely in PHP (`session_start`, `$_SESSION`, `session_destroy`)
- Protecting pages from unauthorized/unauthenticated guests via session redirects
- Implementing role-based dashboard privileges (Distributors vs Retailers)
- Building logout actions to destroy active sessions and clear cookies

## Folder Structure (Week 7)

```
week7/
├── README.md
├── schema.sql           ← MySQL user table setup & pre-hashed seed users
├── db.php               ← Database connection utility
├── style.css            ← Beautiful, dark-themed login & dashboard layout
├── register.php         ← User registration form & hashing
├── login.php            ← User login form & verification
├── dashboard.php        ← Protected dashboard with session check & role privileges
└── logout.php           ← Session destruction
```

## Running the Web App locally

1. Import `schema.sql` into your local MySQL server (e.g. via phpMyAdmin or MySQL CLI):
   ```sql
   mysql -u root -p < schema.sql
   ```
2. Place the `week7` directory inside your local web server document root.
3. Access the application in your browser:
   ```
   http://localhost/week7/login.php
   ```
4. Log in using the seeded test accounts:
   - **Distributor Account**: `admin@smartwholesaler.com` | Password: `admin123`
   - **Retailer Account**: `retailer@smartwholesaler.com` | Password: `retailer123`

## GitHub Commit Message for This Week
```
Week 7: User authentication, session management, password hashing, protected pages
```
