import { readFile, readdir } from "fs/promises";
import { PathLike } from "fs";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { NodeResponse, Router } from "./utils";
import { routeHandler } from "./router";
import { gzipSync } from 'zlib'
import {mimeTypeForFileExtension} from './mimetypes'
import path from "path";
import {Readable} from 'stream'




interface NodeServerConfig {
    router: Router
    port: number | string
    host: string
    static: PathLike
}

async function readDirectoryRecursively(dirPath: string, virtualPath, filesMap: Map<string, Buffer>) {


    const directoryContents = await readdir(dirPath, { withFileTypes: true });


    await Promise.all(directoryContents.map(async (dirent) => {
        const fullPath = path.join(dirPath, dirent.name);
        if (dirent.isDirectory()) {
            await readDirectoryRecursively(fullPath, filesMap)
        } else {

            const encoding: BufferEncoding | undefined = ['.png', '.jpg', '.jpeg', '.ico'].includes(path.parse(fullPath).ext) ? undefined : 'utf-8'
            const fileContents = await readFile(fullPath, encoding);

            const fullVirtualPath = fullPath.replace(dirPath, virtualPath)

            filesMap.set('/'+fullVirtualPath.split(path.sep).join("/"), gzipSync(fileContents))
        }
    }));

}

async function readAndCompressStaticFilesToMap(publicPath: string, virtualPath) {
    const filesMap: Map<string, Buffer> = new Map()

    await readDirectoryRecursively(publicPath, virtualPath, filesMap)

    return filesMap
}



export async function createNodeServer(config: NodeServerConfig) {

    const staticFolderBasePath = config.static.toString()
    const virtualPath = 'static'
    const staticFiles = await readAndCompressStaticFilesToMap(staticFolderBasePath, virtualPath)

    function staticFileHandler(res: NodeResponse, url: string) {

        try {
        const filePath =  url
        const ext = filePath.split('.').at(-1)

            const buffer = staticFiles.get(filePath)

            if(!buffer){
                return res.error('Uh oh, resource not found ;(', 404)
            }

            const stream = new Readable({
                read(){
                    this.push(buffer)
                    this.push(null)
                }
            })

            const contentType = mimeTypeForFileExtension(ext as MimeType)

            if(!contentType){
                
                return res.error('Unsupported file extension', 400)
            }

            res.setHeader({
                'Content-Length': buffer.byteLength.toString(),
                'Content-Type': contentType,
                'Content-Encoding': 'gzip',
                /*   'Cache-Control': 'max-age=604800' */
            })

            res.stream(stream)

        } catch (err) {

            console.log(err)
            res.error('Uh oh, sorry, there was an error ;(', 500)

        }
    }



    async function requestHandler(request: IncomingMessage, response: ServerResponse) {

        const res = new NodeResponse(response)

        let url = request.url!;

        console.log(`${request.method} ${url}`)

        if (url === '/') {
            url = `/${virtualPath}/index.html`
        }

        if (url.startsWith(`/${virtualPath}/`)) {
            staticFileHandler(res, url)
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

