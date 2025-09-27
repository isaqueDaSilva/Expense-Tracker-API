import type { IncomingMessage } from "http";

export async function decodeJSONBody<T>(request: IncomingMessage, decoder: (json: string) => T): Promise<T> {
    const body = await new Promise<string>((resolve, reject) => {
        let data = '';

        // Interates over the request body
        request.on('data', (chunk) => {
            data += chunk.toString();
        });

        // Checks if the request has ended
        request.on('end', () => {
            return resolve(data);
        });

        // Handles any errors that may occur during the request
        request.on('error', (err) => {
            return reject(err);
        });       
    });

    try {
        const model = decoder(body);
        return model;
    } catch (error) {
        throw error
    }
}