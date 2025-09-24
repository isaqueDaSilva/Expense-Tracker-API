import { createServer } from "http";
import { removeUser, signin, signout, signup } from "./controllers/authenticationController";
import { createNewCategory, deleteCategoryWithID, getCategories, getCategoryById, updateCategoryWithId } from "./controllers/categoryController";
import { createNewTask, getAllTasksByDate, getTasks, getTasksByCategory, getTask, updateCurrentTask, deleteCurrentTask } from "./controllers/tasksController";


const hostname = '127.0.0.1';
const port = 3000;
export const server = createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World, The expense tracker API is alive.');
    case "/auth/signup":
      signup(req, res);
    case "/auth/signin":
      signin(req, res);
    case "/auth/signout":
      signout(req, res);
    case "/auth/delete-account":
      removeUser(req, res);
    case "category/create":
      createNewCategory(req, res);
    case "category/all/:page":
      getCategories(req, res);
    case "category/get/:id":
      getCategoryById(req, res);
    case "category/:id/update":
      updateCategoryWithId(req, res);
    case "category/:id/delete":
      deleteCategoryWithID(req, res);
    case "task/create":
      createNewTask(req, res);
    case "task/all/:page":
      getTasks(req, res);
    case "task/all/:category/:page":
      getTasksByCategory(req, res);
    case "task/all/:initial-date/:final-date/:page":
      getAllTasksByDate(req, res);
    case "task/get/:id":
      getTask(req, res);
    case "task/:id/update":
      updateCurrentTask(req, res);
    case "task/:id/delete":
      deleteCurrentTask(req, res);
  };
});