import { ServerResponse } from "http";
import { setResponse } from "./setResponse.js";

export function isPageValid(page: number, response: ServerResponse): boolean {
    console.log(page)
    if (isNaN(page) || page < 1) {
        setResponse(response, 400, {error: "Invalid page number. Page number must be 1 or greater."});
        return false;
    } else {
        return true;
    }
};