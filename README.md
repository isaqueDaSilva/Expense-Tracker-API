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
 <a href="#tech">Features</a> •
 <a href="#features">Funcionalidades</a>
</p>

<h2 id="about">📌 About</h2>

The Expense Tracker API is a RESTful service designed to help users efficiently manage and monitor their personal or business finances. It offers features for tracking expenses and categorizing spending.

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
DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/expense_tracker
PORT=3000
HOSTNAME='127.0.0.1'
JWT_ACCESS_SECRET=segredo_para_access_jwt
JWT_REFRESH_SECRET=segredo_para_refresh_jwt
JWT_ISSUER=segredo_para_jwt_issuer
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
| \`/task/create\` | POST | Creates a new expense |
| \`/task/all/:page\` | GET | List expenses (paginated) |
| \`/task/all/:category/:page\` | GET | List expenses by categories (paginated) |
| \`/task/byDate/:page\` | GET | List expenses by date range (paginated) |
| \`/task/get/:id\` | GET | Gets an expense by ID |
| \`/task/update/:id\` | PATCH | updates an expense |
| \`/task/:id/delete\` | DELETE | deletes an expense |

<h3>Exemplos de Requisições</h3>

#### Criar Nova Despesa
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

#### Criar Nova Categoria
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
