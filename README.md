# Expense Tracker Database Schema

This document explains the database schema for the Expense Tracker app, including tables, attributes, properties, and relationships.

---

## 1. `users` Table

**Purpose:** Store all users of the application.

| Column       | Type           | Properties / Default         | Explanation                            |
| ------------ | -------------- | ---------------------------- | -------------------------------------- |
| `id`         | `INT`          | `AUTO_INCREMENT PRIMARY KEY` | Unique identifier for each user.       |
| `name`       | `VARCHAR(100)` | `NOT NULL`                   | Full name of the user.                 |
| `email`      | `VARCHAR(100)` | `UNIQUE NOT NULL`            | User login identifier. Must be unique. |
| `password`   | `VARCHAR(255)` | `NOT NULL`                   | Hashed password for authentication.    |
| `currency`   | `VARCHAR(10)`  | `DEFAULT 'INR'`              | Default currency for transactions.     |
| `created_at` | `TIMESTAMP`    | `DEFAULT CURRENT_TIMESTAMP`  | Account creation timestamp.            |

---

## 2. `accounts` Table

**Purpose:** Store bank accounts, wallets, and cards per user.

| Column          | Type                                           | Properties / Default         | Explanation                          |
| --------------- | ---------------------------------------------- | ---------------------------- | ------------------------------------ |
| `id`            | `INT`                                          | `AUTO_INCREMENT PRIMARY KEY` | Unique account ID.                   |
| `user_id`       | `INT`                                          | `NOT NULL`                   | References `users(id)`.              |
| `name`          | `VARCHAR(100)`                                 | `NOT NULL`                   | Human-readable account name.         |
| `type`          | `ENUM('savings','checking','credit','wallet')` | `DEFAULT 'savings'`          | Type of account.                     |
| `balance`       | `DECIMAL(15,2)`                                | `DEFAULT 0.00`               | Current account balance.             |
| `institution`   | `VARCHAR(100)`                                 | NULL                         | Optional bank or wallet provider.    |
| `created_at`    | `TIMESTAMP`                                    | `DEFAULT CURRENT_TIMESTAMP`  | Creation timestamp.                  |
| **Foreign Key** | `user_id → users(id)`                          | `ON DELETE CASCADE`          | Deletes accounts if user is deleted. |

---

## 3. `categories` Table

**Purpose:** Classify transactions into logical groups.

| Column          | Type                       | Properties / Default         | Explanation                                      |
| --------------- | -------------------------- | ---------------------------- | ------------------------------------------------ |
| `id`            | `INT`                      | `AUTO_INCREMENT PRIMARY KEY` | Unique category ID.                              |
| `user_id`       | `INT`                      | `NOT NULL`                   | References `users(id)`.                          |
| `name`          | `VARCHAR(100)`             | `NOT NULL`                   | Name of the category.                            |
| `type`          | `ENUM('expense','income')` | `NOT NULL`                   | Whether the category is for spending or earning. |
| `icon`          | `VARCHAR(50)`              | NULL                         | Optional icon reference for frontend.            |
| `color`         | `VARCHAR(20)`              | NULL                         | Optional UI color.                               |
| `created_at`    | `TIMESTAMP`                | `DEFAULT CURRENT_TIMESTAMP`  | Creation timestamp.                              |
| **Foreign Key** | `user_id → users(id)`      | `ON DELETE CASCADE`          | Deletes categories if user is deleted.           |

---

## 4. `transactions` Table

**Purpose:** Log all financial actions per user and account.

| Column           | Type                                                                               | Properties / Default                                                    | Explanation                            |
| ---------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| `id`             | `INT`                                                                              | `AUTO_INCREMENT PRIMARY KEY`                                            | Unique transaction ID.                 |
| `user_id`        | `INT`                                                                              | `NOT NULL`                                                              | References `users(id)`.                |
| `account_id`     | `INT`                                                                              | `NOT NULL`                                                              | References `accounts(id)`.             |
| `category_id`    | `INT`                                                                              | NULL                                                                    | References `categories(id)`. Optional. |
| `amount`         | `DECIMAL(15,2)`                                                                    | `NOT NULL`                                                              | Transaction amount.                    |
| `type`           | `ENUM('expense','income')`                                                         | `NOT NULL`                                                              | Type of transaction.                   |
| `description`    | `TEXT`                                                                             | NULL                                                                    | Optional notes.                        |
| `merchant`       | `VARCHAR(100)`                                                                     | NULL                                                                    | Optional merchant/store.               |
| `date`           | `DATE`                                                                             | `NOT NULL`                                                              | Date of transaction.                   |
| `created_at`     | `TIMESTAMP`                                                                        | `DEFAULT CURRENT_TIMESTAMP`                                             | Record creation timestamp.             |
| **Foreign Keys** | `user_id → users(id)`, `account_id → accounts(id)`, `category_id → categories(id)` | `ON DELETE CASCADE` for user/account, `ON DELETE SET NULL` for category | Maintain data integrity.               |

---

## 5. `budgets` Table

**Purpose:** Track spending/saving limits for users per category.

| Column           | Type                                                  | Properties / Default                                            | Explanation                                         |
| ---------------- | ----------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `id`             | `INT`                                                 | `AUTO_INCREMENT PRIMARY KEY`                                    | Unique budget ID.                                   |
| `user_id`        | `INT`                                                 | `NOT NULL`                                                      | References `users(id)`.                             |
| `category_id`    | `INT`                                                 | NULL                                                            | Optional: budget per category.                      |
| `amount`         | `DECIMAL(15,2)`                                       | `NOT NULL`                                                      | Budget limit.                                       |
| `start_date`     | `DATE`                                                | `NOT NULL`                                                      | Start date of budget.                               |
| `end_date`       | `DATE`                                                | `NOT NULL`                                                      | End date of budget.                                 |
| `created_at`     | `TIMESTAMP`                                           | `DEFAULT CURRENT_TIMESTAMP`                                     | Creation timestamp.                                 |
| **Foreign Keys** | `user_id → users(id)`, `category_id → categories(id)` | `ON DELETE CASCADE` for user, `ON DELETE SET NULL` for category | Maintain integrity if users/categories are removed. |

---

## Relationships

- **User → Accounts** (1:N)
- **User → Categories** (1:N)
- **User → Transactions** (1:N)
- **User → Budgets** (1:N)
- **Account → Transactions** (1:N)
- **Category → Transactions** (1:N, optional)
- **Category → Budgets** (1:N, optional)

**Notes:**

- `ON DELETE CASCADE` ensures no orphaned records.
- `ON DELETE SET NULL` keeps transaction/budget records if a category is deleted.
- `DECIMAL(15,2)` ensures accurate currency handling.

---

This schema supports multi-account, multi-category tracking, user-specific budgets, and a robust foundation for analytics, reporting, and future features like recurring transactions.
