import type { IncomingMessage, ServerResponse } from "http";
import { verifyToken } from "./services/verifyToken.js";
import { decodeJSONBody } from "./services/jsonDecoder.js";
import { decodeCreateTaskDTO, decodeUpdateTaskDTO } from "./services/tasks/decodeTaskDTO.js";
import { createTask, deleteTask, getAllTasks, getAllTasksByCategory, getTasksByDate, getTaskByID, updateTask } from "./services/tasks/tasksCRUD.js";
import { getParameterURL } from "./services/getParameterURL.js";
import { isPageValid } from "./services/isPageValid.js";
import { setResponse } from "./services/setResponse.js";
import { TokenType } from "./services/tokens/tokenType.js";

export async function createNewTask(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const newTask = await decodeJSONBody(request, decodeCreateTaskDTO);

        const task = await createTask(newTask, token.userID);

        setResponse(response, 201, task);
    } catch (error) {
        console.error("Error processing task creation:", error);
        setResponse(response, 500, { error: "Internal Server Error."} );
    }
};

export async function getTasks(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const pageParameter = getParameterURL(request, 'page');
        const page = pageParameter ? parseInt(pageParameter, 10) : 1;

        if (!isPageValid(page, response)) {
            return;
        }

        const tasks = await getAllTasks(token.userID, page);
        setResponse(response, 200, tasks);
    } catch (error) {
        console.error("Error processing get tasks:", error);
        setResponse(response, 500, { error: "Internal Server Error." } );
    }
};

export async function getTasksByCategory(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const categoryID = getParameterURL(request, 'category');
        const pageParameter = getParameterURL(request, 'page');
        const page = pageParameter ? parseInt(pageParameter, 10) : 1;

        if (!categoryID) {
            setResponse(response, 400, { error: "Category ID is required." } );
            return;
        }

        if (!isPageValid(page, response)) {
            return;
        }

        const tasks = await getAllTasksByCategory(token.userID, categoryID, page);
        setResponse(response, 200, tasks);
    } catch (error) {
        console.error("Error processing get tasks by category:", error);
        setResponse(response, 500, { error: "Internal Server Error." } );
    }
};

export async function getAllTasksByDate(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const initialDate = getParameterURL(request, 'initial-date');
        const finalDate = getParameterURL(request, 'final-date');
        const pageParameter = getParameterURL(request, 'page');
        const page = pageParameter ? parseInt(pageParameter, 10) : 1;

        if ((!initialDate || !finalDate) || (initialDate == finalDate)) {
            setResponse(response, 400, { error: "Date out of range." } );
            return;
        }

        if (!isPageValid(page, response)) {
            return;
        }

        const tasks = await getTasksByDate(token.userID, initialDate, finalDate, page);
        setResponse(response, 200, tasks);
    } catch (error) {
        console.error("Error processing get tasks by date range:", error);
        setResponse(response, 500, { error: "Internal Server Error." } );
    }
}

export async function getTask(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const taskID = getParameterURL(request, 'id');

        if (!taskID) {
            setResponse(response, 400, { error: "Task ID is required." } );
            return;
        }

        const task = await getTaskByID(taskID, token.userID);
        setResponse(response, 200, task);
    } catch (error) {
        console.error("Error processing get task by ID:", error);
        setResponse(response, 500, { error: "Internal Server Error." } );
    }
};

export async function updateCurrentTask(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const taskID = getParameterURL(request, 'id');

        if (!taskID) {
            setResponse(response, 400, { error: "Task ID is required." } );
            return;
        }

        const updatedTask = await decodeJSONBody(request, decodeUpdateTaskDTO);
        const task = await updateTask(updatedTask, taskID, token.userID);
        setResponse(response, 200, task);
    } catch (error) {
        console.error("Error processing task update:", error);
        setResponse(response, 500, { error: "Internal Server Error" } );
    }
};

export async function deleteCurrentTask(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request, TokenType.access);
        const taskID = getParameterURL(request, 'id');

        if (!taskID) {
            setResponse(response, 400, { error: "Task ID is required." } );
            return;
        }

        await deleteTask(taskID, token.userID);
        setResponse(response, 204, {message: "Task deleted with success."});
    } catch (error) {
        console.error("Error processing task deletion:", error);
        setResponse(response, 500, {error: "Internal Server Error."});
    }
};