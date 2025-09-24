import { databaseConfig } from "./database/configuration/databaseConfig.js";
import { server } from "./server/server.js";
import * as dotenv from 'dotenv';

dotenv.config();

const databaseURL = process.env.DATABASE_URL;
export const database = databaseConfig(databaseURL);

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1'

server.listen(port as number, hostname, undefined, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});