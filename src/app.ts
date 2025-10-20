import { databaseConfig } from "./config/databaseConfig.js";
import { server } from "./config/serverConfig.js";
import * as dotenv from 'dotenv';

dotenv.config();

export type UUID = string & { readonly __brand: unique symbol };
export const database = databaseConfig();

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1'

server.listen(port as number, hostname, undefined, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});