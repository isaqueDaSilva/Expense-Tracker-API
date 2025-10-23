import { createServer } from "http";
import {
  performCleanupOfExpiredSessions,
  refreshToken,
  removeUser,
  signin,
  signout,
  signup,
  verifyAccessTokenFromRequest,
} from "../controllers/authenticationController.js";
import {
  createNewCategory,
  deleteCategoryWithID,
  getCategories,
  getCategoryById,
  updateCategoryWithId,
} from "../controllers/categoryController.js";
import {
  createNewExpenses,
  getAllExpensesByDate,
  getExpenses,
  getExpensesByCategory,
  getExpense,
  updateCurrentExpense,
  deleteCurrentExpense,
} from "../controllers/expensesController.js";
import { RoutesHandler } from "../services/routesHandler.js";

// GET: /
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/",
  handler: (_, res) => {
    res.end("Hello World, The expense tracker API is alive.");
  },
});

// POST: /auth/signup
RoutesHandler.getSharedInstance().addRoutes({
  method: "POST",
  path: "/auth/signup",
  handler: (req, res) => {
    signup(req, res);
  },
});

// POST: /auth/signin
RoutesHandler.getSharedInstance().addRoutes({
  method: "POST",
  path: "/auth/signin",
  handler: (req, res) => {
    signin(req, res);
  },
});

// GET: /token/verify
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/token/verify",
  handler: (req, res) => {
    verifyAccessTokenFromRequest(req, res);
  },
});

// PUT: /token/refresh
RoutesHandler.getSharedInstance().addRoutes({
  method: "PUT",
  path: "/token/refresh",
  handler: (req, res) => {
    refreshToken(req, res);
  },
});

// DELETE: /auth/signout
RoutesHandler.getSharedInstance().addRoutes({
  method: "DELETE",
  path: "/auth/signout",
  handler: (req, res) => {
    signout(req, res);
  },
});

// DELETE: /auth/delete-account
RoutesHandler.getSharedInstance().addRoutes({
  method: "DELETE",
  path: "/auth/delete-account",
  handler: (req, res) => {
    removeUser(req, res);
  },
});

// POST: /category/create
RoutesHandler.getSharedInstance().addRoutes({
  method: "POST",
  path: "/category/create",
  handler: (req, res) => {
    createNewCategory(req, res);
  },
});

// GET: /category/all/:page
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/category/all/:page",
  handler: (req, res, parameters) => {
    getCategories(req, res, parameters || {});
  },
});

// GET: /category/get/:id
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/category/get/:id",
  handler: (req, res, parameters) => {
    getCategoryById(req, res, parameters || {});
  },
});

// PATCH: /category/update/:id
RoutesHandler.getSharedInstance().addRoutes({
  method: "PATCH",
  path: "/category/update/:id",
  handler: (req, res, parameters) => {
    updateCategoryWithId(req, res, parameters || {});
  },
});

// DELETE: /category/delete/:id
RoutesHandler.getSharedInstance().addRoutes({
  method: "DELETE",
  path: "/category/delete/:id",
  handler: (req, res, parameters) => {
    deleteCategoryWithID(req, res, parameters || {});
  },
});

// POST: /expense/create
RoutesHandler.getSharedInstance().addRoutes({
  method: "POST",
  path: "/expense/create",
  handler: (req, res) => {
    createNewExpenses(req, res);
  },
});

// GET: /expense/all/:page
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/expense/all/:page",
  handler: (req, res, parameters) => {
    getExpenses(req, res, parameters || {});
  },
});

// GET: /expense/all/:category/:page
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/expense/all/:category/:page",
  handler: (req, res, parameters) => {
    getExpensesByCategory(req, res, parameters || {});
  },
});

// GET: /expense/byDate/:dateRange/:page
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/expense/byDate/:dateRange/:page",
  handler: (req, res, parameters) => {
    getAllExpensesByDate(req, res, parameters || {});
  },
});

// GET: /expense/get/:id
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/expense/get/:id",
  handler: (req, res, parameters) => {
    getExpense(req, res, parameters || {});
  },
});

// PATCH: /expense/update/:id
RoutesHandler.getSharedInstance().addRoutes({
  method: "PATCH",
  path: "/expense/update/:id",
  handler: (req, res, parameters) => {
    updateCurrentExpense(req, res, parameters || {});
  },
});

// DELETE: /expense/:id/delete
RoutesHandler.getSharedInstance().addRoutes({
  method: "DELETE",
  path: "/expense/:id/delete",
  handler: (req, res, parameters) => {
    deleteCurrentExpense(req, res, parameters || {});
  },
});

// DELETE: /auth/cleanupExpiredSessions
RoutesHandler.getSharedInstance().addRoutes({
  method: "DELETE",
  path: "/auth/cleanupExpiredSessions",
  handler: (req, res) => {
    performCleanupOfExpiredSessions(req, res);
  },
});

export const server = createServer((req, res) => {
  if (!req.url || !req.method) {
    res.statusCode = 400;
    return res.end("Bad Request");
  }

  console.log(req.method, req.url);

  const route = RoutesHandler.getSharedInstance().getMatchedRoute(
    req.method,
    req.url
  );

  console.log(route);

  if (route) {
    return route.handler(req, res, route.params);
  }

  res.statusCode = 404;
  res.end("Not Found");
});
