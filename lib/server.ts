import { readFile, readdir } from "fs/promises";
import { PathLike } from "fs";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { NodeResponse, Router } from "./utils";
import { routeHandler } from "./router";
import {gzipSync} from 'zlib'
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

async function readDirectoryRecursively(dirPath: string, filesMap: Map<string, Buffer>) {


    const directoryContents = await readdir(dirPath, { withFileTypes: true });
    
    await Promise.all(directoryContents.map(async (dirent) => {
        const fullPath = path.join(dirPath, dirent.name);
        if (dirent.isDirectory()) {
            await readDirectoryRecursively(fullPath, filesMap) 
        } else {

            const encoding = ['.png', '.jpg', '.jpeg', '.ico', '.html'].includes(path.parse(fullPath).ext) ? null: 'utf-8'
            const fileContents = await readFile(fullPath, encoding);
            
            filesMap.set(fullPath.split(path.sep).join("\\"), gzipSync(fileContents))
        }
    }));

}

async function readAndCompressStaticFilesToMap(publicPath: string) {
    const filesMap: Map<string, Buffer> = new Map()
    
    await readDirectoryRecursively(publicPath, filesMap)

    return filesMap
}

export async function createNodeServer(config: NodeServerConfig) {

    const staticFolderBasePath = config.static.toString()
   /*  const staticFiles = await readDirectoryRecursively(staticFolderBasePath) */
   const staticFiles = await readAndCompressStaticFilesToMap(staticFolderBasePath)


    function readToResponseStaticFile({ res, filePath, encoding, mimeType }: StaticFileParams) {
        try {
            const data = staticFiles.get(filePath)

            res.setHeader({
                'Content-Length': data!.byteLength.toString(),
                'Content-Type': mimeType,
                'Content-Encoding': 'gzip',
                'Cache-Control': 'max-age=604800'
            })

            res.send(data, 200)

        } catch (err) {

            res.error('Uh oh, nothing here.', 404)

        }
    }

    function staticFileHandler(req: IncomingMessage, res: NodeResponse, requestUrl: string) {


        const url = requestUrl.slice(1)

        const staticFileParams: StaticFileParams = {
            req,
            res,
            filePath: path.join(staticFolderBasePath, url),
            mimeType: 'application/json'
        }

        if (url.endsWith('.ico')) {
            staticFileParams.mimeType = 'image/x-icon'
            readToResponseStaticFile(staticFileParams)
            return
        }

        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
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

