import { createServer } from "http";
import { removeUser, signin, signout, signup } from "./controllers/authenticationController.js";
import { createNewCategory, deleteCategoryWithID, getCategories, getCategoryById, updateCategoryWithId } from "./controllers/categoryController.js";
import { createNewTask, getAllTasksByDate, getTasks, getTasksByCategory, getTask, updateCurrentTask, deleteCurrentTask } from "./controllers/tasksController.js";
import { RoutesHandler } from "./routesHandler.js";

// GET: /
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/",
  handler: (_, res) => {
    res.end("Hello World, The expense tracker API is alive.");
  }
});

// POST: /auth/signup
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "POST", 
  path: "/auth/signup",
  handler: (req, res) => {
    signup(req, res);
  }
});

// POST: /auth/signin
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "POST", 
  path: "/auth/signin",
  handler: (req, res) => {
    signin(req, res);
  }
});

// DELETE: /auth/signout
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/auth/signout",
  handler: (req, res) => {
    signout(req, res);
  }
});

// DELETE: /auth/delete-account
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/auth/delete-account",
  handler: (req, res) => {
    removeUser(req, res);
  }
});

// POST: /category/create
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "POST", 
  path: "/category/create",
  handler: (req, res) => {
    createNewCategory(req, res);
  }
});

// GET: /category/all/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/category/all/:page",
  handler: (req, res) => {
    getCategories(req, res);
  }
});

// GET: /category/get/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/category/get/:id",
  handler: (req, res) => {
    getCategoryById(req, res);
  }
});

// PATCH: /category/update/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "PATCH", 
  path: "/category/update/:id",
  handler: (req, res) => {
    updateCategoryWithId(req, res);
  }
});

// DELETE: /category/delete/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/category/delete/:id",
  handler: (req, res) => {
    deleteCategoryWithID(req, res);
  }
});

// POST: /task/create
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "POST", 
  path: "/task/create",
  handler: (req, res) => {
    createNewTask(req, res);
  }
});

// GET: /task/all/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/all/:page",
  handler: (req, res) => {
    getTasks(req, res);
  }
});

// GET: /task/all/:category/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/all/:category/:page",
  handler: (req, res) => {
    getTasksByCategory(req, res);
  }
});

// GET: /task/all/:initial-date/:final-date/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/all/:initial-date/:final-date/:page",
  handler: (req, res) => {
    getAllTasksByDate(req, res);
  }
});

// GET: /task/get/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/get/:id",
  handler: (req, res) => {
    getTask(req, res);
  }
});

// PATCH: /task/update/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "PATCH", 
  path: "/task/update/:id",
  handler: (req, res) => {
    updateCurrentTask(req, res);
  }
});

// DELETE: /task/:id/delete
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/task/:id/delete",
  handler: (req, res) => {
    deleteCurrentTask(req, res);
  }
});

const hostname = '127.0.0.1';
const port = 3000;
export const server = createServer((req, res) => {
  if (!req.url || !req.method) {
    res.statusCode = 400;
    return res.end("Bad Request");
  }

  const route = RoutesHandler.getSharedInstance().getMatchedRoute(req.method, req.url);

  if (route) {
    return route.handler(req, res);
  }

  res.statusCode = 404;
  res.end("Not Found");
});