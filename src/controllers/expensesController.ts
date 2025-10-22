import type { IncomingMessage, ServerResponse } from "http";
import { decodeJSONBody } from "../services/jsonDecoder.js";
import {
  decodeCreateExpenseDTO,
  decodeUpdateExpenseDTO,
} from "../services/expenses/decodeExpenseDTO.js";
import {
  createNewExpense,
  deleteExpense,
  getAllExpenses,
  getAllExpensesByCategory,
  getExpensesByDate,
  getExpenseByID,
  updateExpense,
} from "../services/expenses/expenseCRUD.js";
import { isPageValid } from "../services/isPageValid.js";
import { setResponse } from "../services/setResponse.js";
import { getAccessTokenValue } from "../services/tokens/getTokens.js";
import { getPreviousDate } from "../services/getPreviousDate.js";

// TODO: Add constraints to the same user cannot create two expenses with the same name.
export async function createNewExpenses(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const token = await getAccessTokenValue(request);
    const newExpense = await decodeJSONBody(request, decodeCreateExpenseDTO);

    const expense = await createNewExpense(newExpense, token.userID);

    setResponse(response, 201, expense);
  } catch (error) {
    console.error("Error processing expense creation:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}

export async function getExpenses(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const pageParameter = (parameters as { page: string }).page;
    const page = pageParameter ? parseInt(pageParameter, 10) : 1;

    if (!isPageValid(page, response)) {
      return;
    }

    const expenses = await getAllExpenses(token.userID, page);
    setResponse(response, 200, expenses);
  } catch (error) {
    console.error("Error processing get expenses:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}

export async function getExpensesByCategory(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const utilParameters = parameters as { category: string; page: string };
    const page = parseInt(utilParameters.page, 10);

    if (!utilParameters.category) {
      setResponse(response, 400, { error: "Category ID is required." });
      return;
    }

    if (!isPageValid(page, response)) {
      return;
    }

    const expenses = await getAllExpensesByCategory(
      token.userID,
      utilParameters.category,
      page
    );
    setResponse(response, 200, expenses);
  } catch (error) {
    console.error("Error processing get expenses by category:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}

export async function getAllExpensesByDate(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const utilParameters = parameters as { dateRange: string; page: string };
    const dateRange = parseInt(utilParameters.dateRange, 10); // date range in days (e.g. 15 days) from today
    const page = utilParameters ? parseInt(utilParameters.page, 10) : 1;
    const initialDate = getPreviousDate(dateRange);
    const finalDate = new Date();

    if (!isPageValid(page, response)) {
      return;
    }

    const expenses = await getExpensesByDate(
      token.userID,
      initialDate.toDateString(),
      finalDate.toDateString(),
      page
    );
    setResponse(response, 200, expenses);
  } catch (error) {
    console.error("Error processing get expenses by date range:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}

export async function getExpense(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const expenseID = (parameters as { id: string }).id;

    if (!expenseID) {
      setResponse(response, 400, { error: "Expense ID is required." });
      return;
    }

    const expense = await getExpenseByID(expenseID, token.userID);
    setResponse(response, 200, expense);
  } catch (error) {
    console.error("Error processing get expense by ID:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}

export async function updateCurrentExpense(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const expenseID = (parameters as { id: string }).id;

    if (!expenseID) {
      setResponse(response, 400, { error: "Expense ID is required." });
      return;
    }

    const updatedExpense = await decodeJSONBody(
      request,
      decodeUpdateExpenseDTO
    );
    const expense = await updateExpense(
      updatedExpense,
      expenseID,
      token.userID
    );
    setResponse(response, 200, expense);
  } catch (error) {
    console.error("Error processing expense update:", error);
    setResponse(response, 500, { error: "Internal Server Error" });
  }
}

export async function deleteCurrentExpense(
  request: IncomingMessage,
  response: ServerResponse,
  parameters: Record<string, string>
) {
  try {
    const token = await getAccessTokenValue(request);
    const expenseID = (parameters as { id: string }).id;

    if (!expenseID) {
      setResponse(response, 400, { error: "expense ID is required." });
      return;
    }

    await deleteExpense(expenseID, token.userID);
    setResponse(response, 204, { message: "Expense deleted with success." });
  } catch (error) {
    console.error("Error processing Expense deletion:", error);
    setResponse(response, 500, { error: "Internal Server Error." });
  }
}
