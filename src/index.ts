import { router } from "./router";
import { createNodeServer } from "../lib/server";
import { initDb } from "./database/jsonDb";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

initDb({
    folder: '.data',
    tables: [
        {
            name: 'dogs'
        },
        {
            name: 'users'
        }
    ]
}).then(()=>{
    console.log("Database ready")
})

createNodeServer({
    host: HOST,
    port: PORT,
    router: router,
    static: 'public'
})


