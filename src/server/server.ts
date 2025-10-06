import { createServer } from "http";
import { refreshToken, removeUser, signin, signout, signup, verifyAccessToken } from "./controllers/authenticationController.js";
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

// GET: /token/verify
RoutesHandler.getSharedInstance().addRoutes({
  method: "GET",
  path: "/token/verify",
  handler: (req, res) => {
    verifyAccessToken(req, res);
  }
});

// PUT: /token/refresh
RoutesHandler.getSharedInstance().addRoutes({
  method: "PUT",
  path:  "/token/refresh",
  handler: (req, res) => {
    refreshToken(req, res);
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
  handler: (req, res, parameters) => {
    getCategories(req, res, parameters || {} );
  }
});

// GET: /category/get/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/category/get/:id",
  handler: (req, res, parameters) => {
    getCategoryById(req, res, parameters || {} );
  }
});

// PATCH: /category/update/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "PATCH", 
  path: "/category/update/:id",
  handler: (req, res, parameters) => {
    updateCategoryWithId(req, res, parameters || { } );
  }
});

// DELETE: /category/delete/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/category/delete/:id",
  handler: (req, res, parameters) => {
    deleteCategoryWithID(req, res, parameters || { });
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
  handler: (req, res, parameters) => {
    getTasks(req, res, parameters || { });
  }
});

// GET: /task/all/:category/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/all/:category/:page",
  handler: (req, res, parameters) => {
    getTasksByCategory(req, res, parameters || { });
  }
});

// GET: /task/byDate/:page
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/byDate/:page",
  handler: (req, res, parameters) => {
    getAllTasksByDate(req, res, parameters || { });
  }
});

// GET: /task/get/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "GET", 
  path: "/task/get/:id",
  handler: (req, res, parameters) => {
    getTask(req, res, parameters || { });
  }
});

// PATCH: /task/update/:id
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "PATCH", 
  path: "/task/update/:id",
  handler: (req, res, parameters) => {
    updateCurrentTask(req, res, parameters || { });
  }
});

// DELETE: /task/:id/delete
RoutesHandler.getSharedInstance().addRoutes({ 
  method: "DELETE", 
  path: "/task/:id/delete",
  handler: (req, res, parameters) => {
    deleteCurrentTask(req, res, parameters || { });
  }
});

export const server = createServer((req, res) => {
  if (!req.url || !req.method) {
    res.statusCode = 400;
    return res.end("Bad Request");
  }

  console.log(req.method, req.url)

  const route = RoutesHandler.getSharedInstance().getMatchedRoute(req.method, req.url);

  console.log(route)

  if (route) {
    return route.handler(req, res, route.params);
  }

  res.statusCode = 404;
  res.end("Not Found");
});