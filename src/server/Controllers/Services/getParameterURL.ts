import type { IncomingMessage } from "http";

export function getParameterURL(request: IncomingMessage, parameterName: string): string | null {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    return url.searchParams.get(parameterName);
}