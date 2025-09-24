import type { IncomingMessage, ServerResponse } from "http";
import { verifyToken } from "./services/verifyToken.js";
import { decodeJSONBody } from "./services/jsonDecoder.js";
import { getParameterURL } from "./services/getParameterURL.js";
import { decodeCreateCategoryDTO, decodeUpdateCategoryDTO } from "./services/category/decodeCategoryDTO.js";
import { createCategory, getAllCategories, getCategoryByID, updateCategory, deleteCategory } from "./services/category/categoryCRUD.js";
import { isPageValid } from "./services/isPageValid.js";
import { setResponse } from "./services/setResponse.js";

export async function createNewCategory(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        const newCategory = await decodeJSONBody(request, decodeCreateCategoryDTO);

        if (typeof newCategory.title === 'string') {
            const category = await createCategory(newCategory.title, token.userID);
            setResponse(response, 201, "category", category);
        } else {
            console.error("Cannot possible to creating categpry without a title");
            setResponse(response, 400, "error", "Cannot possible to creating categpry without a title");
        }
    } catch (error) {
        console.error("Error processing category creation:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function getCategories(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        const pageParameter = getParameterURL(request, 'page');
        const page = pageParameter ? parseInt(pageParameter, 10) : 1;

        if (!isPageValid(page, response)) {
            return;
        };

        const categories = await getAllCategories(token.userID, page);
        setResponse(response, 200, "categories", categories);
    } catch (error) {
        console.error("Error processing get category:", error);
        setResponse(response, 500, "error", "Internal Server Error");
    }
};

export async function getCategoryById(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        const categoryID = getParameterURL(request, 'id');

        if (!categoryID) {
            setResponse(response, 400, "error", "Category ID is required.");
            return;
        }

        const category = await getCategoryByID(token.userID, categoryID);
        setResponse(response, 201, "category", category);
    } catch (error) {
        console.error("Error processing get categpry:", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function updateCategoryWithId(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        const categoryID = getParameterURL(request, 'id');

        if (!categoryID) {
            setResponse(response, 400, "error", "Category ID is required.");
            return;
        }

        const updatedCategoryDTO = await decodeJSONBody(request, decodeUpdateCategoryDTO);

        if (typeof updatedCategoryDTO.title === 'string') {
            const updatedCategoryResult = await updateCategory(token.userID, categoryID, updatedCategoryDTO.title);
            setResponse(response, 201, "task", updatedCategoryResult);
        } else {
            console.error("Cannot possible to update categpry without a title");
            setResponse(response, 400, "error", "Cannot possible to creating categpry without a title");
        }
    } catch (error) {
        console.error("Error processing category update", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};

export async function deleteCategoryWithID(request: IncomingMessage, response: ServerResponse) {
    try {
        const token = await verifyToken(request);
        const categoryID = getParameterURL(request, 'id');
        
        if (!categoryID) {
            setResponse(response, 400, "error", "Category ID is required.");
            return;
        }

        await deleteCategory(categoryID, token.userID);
        setResponse(response, 204, "message", "Categpry deleted with success.");
    } catch (error) {
        console.error("Error processing category update", error);
        setResponse(response, 500, "error", "Internal Server Error.");
    }
};