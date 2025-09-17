import { databaseConfig } from "./database/Configuration/databaseConfig";
import { server } from "./server/server";
import * as dotenv from 'dotenv';

dotenv.config();

const databaseURL = process.env.DATABASE_URL;
export const database = databaseConfig(databaseURL);

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1'

server.listen(port as number, hostname, undefined, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});