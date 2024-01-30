import { readFileSync } from "fs"
import { createServer } from 'http'

function readToResponseStaticFile({ req, res, path, options, mimeType }) {
    try {

        const data = readFileSync(path, options)

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

function staticFileHandler(req, res) {

    const url = req.url.slice(1)

    const staticFileParams = {
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
        staticFileParams.options = 'utf-8'
        readToResponseStaticFile(staticFileParams)
        return
    }

}



function handleRequest(request, response) {

    if (request.url === '/') {
        request.url = '/public/index.html'
    }

    if (request.url.startsWith('/public/')) {
        staticFileHandler(request, response)
        return
    }

    response.writeHead(404, { 'Content-Type': 'application/json' })

    response.end(JSON.stringify({
        error: 'Uh oh, nothing here.',
    }))

}

const server = createServer(handleRequest);

server.listen(8000, 'localhost');
console.log("Server is running on http://localhost:8000")
