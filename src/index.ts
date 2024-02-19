import { router } from "./router";
import { createNodeServer } from "../lib/server";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

createNodeServer({
    host: HOST,
    port: PORT,
    router: router,
    static: 'public'
})


