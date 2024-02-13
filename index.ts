import { readFileSync } from "fs"
import { IncomingMessage, ServerResponse, createServer } from 'http'
import { routeHandler, router } from "./api/router";

type StaticFileParams = {
    req: IncomingMessage;
    res: ServerResponse;
    path: string;
    mimeType?: string;
    encoding?: BufferEncoding
}

function readToResponseStaticFile({ req, res, path, encoding, mimeType }: StaticFileParams) {
    try {

        const data = readFileSync(path, encoding)

        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Cache-Control': 'max-age=604800'
        })
        res.end(data)
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'Uh oh, nothing here. Does the resource you\'re looking for exist?',
        }))
    }
}

function staticFileHandler(req: IncomingMessage, res: ServerResponse, requestUrl: string) {

    const url = requestUrl.slice(1)

    const staticFileParams: StaticFileParams = {
        req,
        res,
        path: url
    } 

    if (url.endsWith('.ico')) {
        staticFileParams.mimeType = 'image/x-icon'
        readToResponseStaticFile(staticFileParams)
        return
    }

    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
        staticFileParams.mimeType = 'image/jpg'
        readToResponseStaticFile(staticFileParams)
        return
    }

    if (url.endsWith('.png')) {
        staticFileParams.mimeType = 'image/png'
        readToResponseStaticFile(staticFileParams)
        return
    }

    if (url.endsWith('.html')) {

        staticFileParams.mimeType = 'text/html'
        staticFileParams.encoding = 'utf-8'
        readToResponseStaticFile(staticFileParams)
        return
    }

}



async function handleRequest(request: IncomingMessage, response: ServerResponse) {

    let url = request.url ?? '';

    if (url === '/') {
        url = '/public/index.html'
    }

    if (url.startsWith('/public/')) {
        staticFileHandler(request, response, url)
        return
    }

    if(url.startsWith('/api/')){
        await routeHandler(request, response)
        return
    }

    response.writeHead(404, { 'Content-Type': 'application/json' })

    response.end(JSON.stringify({
        error: 'Uh oh, nothing here.',
    }))

}

const server = createServer(handleRequest);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(Number(PORT), HOST);
console.log(`Server is running on http://${HOST}:${PORT}`)
