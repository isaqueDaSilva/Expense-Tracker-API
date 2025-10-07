# Expense Tracker API 💰

![typescript][TYPESCRIPT__BADGE]
![node][NODE__BADGE]
![postgres][POSTGRES__BADGE]

[TYPESCRIPT__BADGE]: https://img.shields.io/badge/typescript-D4FAFF?style=for-the-badge&logo=typescript
[NODE__BADGE]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[POSTGRES__BADGE]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white

<p align="center">
 <a href="#about">About</a> • 
 <a href="#started">Starting</a> • 
 <a href="#routes"> API Routes</a> •
 <a href="#tech">Technologies</a> •
 <a href="#features">Features</a>
</p>

<h2 id="about">📌 About</h2>

The Expense Tracker API is a RESTful service designed to help users efficiently manage and monitor their personal or business finances. It offers features for tracking expenses and categorizing spending.

This project is my solution for [Expense tracker](https://roadmap.sh/projects/expense-tracker-api) from roadmap.sh website.

<h2 id="started">🚀 Starting</h2>

### Pre-requirements

- [Node.js](https://nodejs.org/) (v22 or above)
- [Neon Database](https://neon.com)
- [TypeScript](https://www.typescriptlang.org/)

### Instalação

1. Clone the repository
```bash
git clone https://github.com/isaqueDaSilva/Expense-Tracker-API.git
cd Expense-Tracker-API
```

2. Install Dependencies
```bash
npm install
```

3. Configure environment variables
Create a \`.env\` file on root of the project based on \`.env.example\`:

```env
DATABASE_URL=postgres://your_user:your_password@localhost:5432/expense_tracker
PORT=3000
HOSTNAME='127.0.0.1'
JWT_ACCESS_SECRET=secret_for_access_jwt_token
JWT_REFRESH_SECRET=secret_for_refresh_jwt_token
JWT_ISSUER=secret_for_jwt_issuer_identifier
```

4. Perform database migrations
```bash
npm run migrate
```

5. Start server
```bash
npm run build
```

<h2 id="routes">📍 API Routes</h2>

### Authentication

| Route | Method | Description |
|------|--------|-----------|
| \`/auth/signup\` | POST | Create a new account |
| \`/auth/signin\` | POST | Log in |
| \`/token/verify\` | GET | Verify access token |
| \`/token/refresh\` | PUT | Refresh access token |
| \`/auth/signout\` | DELETE | Log out |
| \`/auth/delete-account\` | DELETE | Deletes user account

### Categories

| Route | Method | Description |
|------|--------|-----------|
| \`/category/create\` | POST | Create a new category |
| \`/category/all/:page\` | GET | List categories (paginated) |
| \`/category/get/:id\` | GET | Get a category by ID |
| \`/category/:id/update\` | PATCH | Updates a category |
| \`/category/:id/delete\` | DELETE | Deletes a category |

### Expenses

| Route | Method | Description |
|------|--------|-----------|
| \/task/create\ | POST | Creates a new expense |
| \`/task/all/:page\` | GET | List expenses (paginated) |
| \`/task/all/:category/:page\` | GET | List expenses by categories (paginated) |
| \`/task/byDate/:page\` | GET | List expenses by date range (paginated) |
| \`/task/get/:id\` | GET | Gets an expense by ID |
| \`/task/update/:id\` | PATCH | updates an expense |
| \`/task/:id/delete\` | DELETE | deletes an expense |

<h3>Request Examples</h3>

#### Creates a new expense
```json
POST /task/create
{
    "title": "Monthly Purchases",
    "description": "Monthly market",
    "value": 500.00,
    "date": "2025-10-06",
    "category": "category-uuid"
}
```

#### Creates a new Category
```json
POST /category/create
{
    "title": "Food"
}
```

<h2 id="tech">🛠 Technologies</h2>

- TypeScript
- Node.js
- PostgreSQL (via Neon Serverless)
- Zod (Validations)
- JSON Web Token (Authentication)
- bcrypt (password hash)

<h2 id="features">⭐ Features</h2>

- ✅ Secure authentication with JWT
- ✅ Complete expense and category CRUD
- ✅ Expense categorization
- ✅ Date and category filters
- ✅ Results pagination
- ✅ Standard category system
- ✅ Robust data validation
- ✅ Route protection
- ✅ Token refresh

### Security

- Passwords stored with bcrypt hash
- JWT tokens with expiration
- Token refresh system
- Data validation with Zod
- SQL injection protection
- Token deactivation system

### Data Model

- **Users**: Account Management
- **Categories**: Expense Management
- **Expenses**: Expense Tracking
- **Tokens**: Session Control
