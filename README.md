# Finance Planner Server

A TypeScript-based backend server for the Finance Planner application. This project provides a robust API for managing expenses, accounts, categories, budgets, and transactions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Database Schema](#database-schema)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** (optional, for cloning the repository)

### Verify Installation

```bash
node --version
npm --version
mysql --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-planner-server
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install the following key dependencies:

- **Express** - Web framework
- **Prisma** - ORM for database management
- **TypeScript** - Type-safe JavaScript
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **mysql2** - MySQL driver
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

---

## Database Setup

### Prerequisites for Database Setup

Ensure MySQL is running on your system. You can verify this by:

```bash
# On Windows (Command Prompt or PowerShell)
mysql -u root -p

# On macOS/Linux
mysql -u root -p
```

When prompted, enter your MySQL root password.

### 1. Create MySQL Database

Open MySQL command line or MySQL Workbench and execute the following SQL command:

```sql
CREATE DATABASE finance_planner;
```

**Verify the database was created:**

```sql
SHOW DATABASES;
```

You should see `finance_planner` in the list.

### 2. Create MySQL User (Recommended for Security)

For security best practices, create a dedicated database user instead of using the root account:

```sql
-- Create a new user
CREATE USER 'finance_user'@'localhost' IDENTIFIED BY 'whatismyname';

-- Grant all privileges on the finance_planner database
GRANT ALL PRIVILEGES ON finance_planner.* TO 'finance_user'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
```

**Verify the user was created:**

```sql
-- List all users
SELECT User, Host FROM mysql.user;
```

You should see `finance_user` with host `localhost` in the list.

### 3. Test the New User Connection

Test that the new user can connect to the database:

```bash
mysql -u finance_user -p finance_planner
```

When prompted, enter the password: `whatismyname`

If the connection is successful, you'll see the MySQL prompt. Type `exit` to disconnect.

### 4. Optional: Reset User Password

If you need to change the password later:

```sql
ALTER USER 'finance_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### 5. Optional: Drop User (If Needed)

To remove the user completely:

```sql
DROP USER 'finance_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Environment Configuration

### 1. Create `.env` File

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env  # If .env.example exists, or create manually
```

### 2. Configure Environment Variables

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/finance_planner"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (if applicable)
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
```

**Example with default MySQL user:**

```env
DATABASE_URL="mysql://root:password@localhost:3306/finance_planner"
PORT=3000
NODE_ENV=development
```

---

## Prisma Setup

### 1. Generate Prisma Client

Generate the Prisma client based on your schema:

```bash
npx prisma generate
```

### 2. Run Database Migrations

Apply all pending migrations to your database:

```bash
npx prisma migrate deploy
```

If this is a fresh setup and you want to create the initial schema:

```bash
npx prisma migrate dev --name init
```

### 3. Verify Database Setup

Check that all tables were created successfully:

```bash
npx prisma studio
```

This opens an interactive database browser at `http://localhost:5555` where you can view all tables and data.

---

## Running the Project

### Development Mode

Run the server in development mode with hot-reload:

```bash
npm run dev
```

The server will start and watch for file changes. You should see:

```
✅ Connected to MySQL database via Prisma
🚀 Server running on port 3000
```

### Production Mode

First, build the TypeScript code:

```bash
npm run build
```

Then start the server:

```bash
npm start
```

### Health Check

Verify the server is running by visiting:

```
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Available Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Start production server                  |
| `npm test`      | Run tests (not yet configured)           |

---

## Prisma Commands Reference

| Command                                | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `npx prisma generate`                  | Generate Prisma Client                     |
| `npx prisma migrate dev --name <name>` | Create and apply a new migration           |
| `npx prisma migrate deploy`            | Apply pending migrations                   |
| `npx prisma studio`                    | Open interactive database browser          |
| `npx prisma db push`                   | Push schema changes to database (dev only) |
| `npx prisma db seed`                   | Run seed script (if configured)            |

---

## Troubleshooting

### Connection Issues

**Error: "Can't connect to MySQL server"**

- Ensure MySQL is running: `mysql -u root -p`
- Verify `DATABASE_URL` in `.env` is correct
- Check username and password are correct
- Ensure the database exists: `SHOW DATABASES;`

### Migration Issues

**Error: "Prisma migration failed"**

- Check for syntax errors in `prisma/schema.prisma`
- Ensure database user has proper permissions
- Try resetting the database (dev only): `npx prisma migrate reset`

### Port Already in Use

**Error: "Port 3000 is already in use"**

- Change the `PORT` in `.env` to an available port
- Or kill the process using port 3000

---

## Database Schema

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
