import { ServerResponse } from "http";

export function setResponse<T>(response: ServerResponse, statusCode: number, message: T) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');

    response.end(JSON.stringify({ message }));
}