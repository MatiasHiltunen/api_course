import { PathLike, readFileSync } from "fs";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { NodeResponse, Router } from "./utils";
import { routeHandler } from "./router";
import path from "path";

type StaticFileParams = {
    req: IncomingMessage;
    res: NodeResponse;
    filePath: string;
    mimeType: string;
    encoding?: BufferEncoding
}

interface NodeServerConfig {
    router: Router
    port: number | string
    host: string
    static: PathLike
}

export function createNodeServer(config: NodeServerConfig) {
    
    const staticFolderBasePath = config.static.toString()
    
    function readToResponseStaticFile({ res, filePath, encoding, mimeType }: StaticFileParams) {
        try {
            const data = readFileSync(path.join(staticFolderBasePath, filePath), encoding)
    
            res.setHeader({
                'Content-Type': mimeType,
                'Cache-Control': 'max-age=604800'
            })
    
            res.send(data, 200)
    
        } catch (err) {
    
            res.sendJson({
                error: 'Uh oh, nothing here. Does the resource you\'re looking for exist?',
            }, 404)
    
        }
    }
    
    function staticFileHandler(req: IncomingMessage, res: NodeResponse, requestUrl: string) {


        const url = requestUrl.slice(1)

        const staticFileParams: StaticFileParams = {
            req,
            res,
            filePath: url,
            mimeType: 'application/json'
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



    async function requestHandler(request: IncomingMessage, response: ServerResponse) {

        const res = new NodeResponse(response)

        let url = request.url ?? '';

        if (url === '/') {
            url = '/public/index.html'
        }

        if (url.startsWith('/public/')) {
            staticFileHandler(request, res, url)
            return
        }

        if (url.startsWith('/api/')) {
            await routeHandler(config.router, request, res)
            return
        }

        res.sendJson({
            error: 'Uh oh, nothing here.',
        }, 404)
    }

    const server = createServer(requestHandler);

    server.listen(Number(config.port), config.host);
    console.log(`Server is running on http://${config.host}:${config.port}`)

}