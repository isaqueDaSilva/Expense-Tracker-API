import { ServerResponse } from "http";

export function setResponse<T>(response: ServerResponse, statusCode: number, title: string, message: T) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ title: message }));
}