import { IncomingMessage, ServerResponse } from "http"

export type ServerRequest = IncomingMessage & { params?: any, body?: any }

export type Controller = (req: ServerRequest, res: ServerResponse) => Promise<any>

export type Route = {
    method: string,
    path: string,
    controller: Controller
}

export interface Router {
    readonly routes: Route[];
    readonly get: (path: string, controller: Controller) => void;
    readonly post: (path: string, controller: Controller) => void;
    readonly put: (path: string, controller: Controller) => void;
    readonly patch: (path: string, controller: Controller) => void;
    readonly delete: (path: string, controller: Controller) => void;
}

function createRoute(method: string, path: string, controller: Controller): Route {

    return {
        method,
        path,
        controller
    }
}

export async function JSONBodyParser(req: ServerRequest) {

    const body = await new Promise((resolve, reject) => {


        let body = ''

        req.on('data', (data) => {

            body += data

        })

        req.on('end', () => {

            const parsedJson = JSON.parse(body)

            resolve(parsedJson)
        })

        req.on('error', reject)
    })

    return body
}


export function createRouter(): Router {
    return {
        routes: [] as Route[],
        get(path: string, controller: Controller) {
            const route = createRoute('GET', path, controller)
            this.routes.push(route)
        },
        post(path: string, controller: Controller) {
            const route = createRoute('POST', path, controller)
            this.routes.push(route)
        },
        put(path: string, controller: Controller) {
            const route = createRoute('PUT', path, controller)
            this.routes.push(route)
        },
        patch(path: string, controller: Controller) {
            const route = createRoute('PATCH', path, controller)
            this.routes.push(route)
        },
        delete(path: string, controller: Controller) {
            const route = createRoute('DELETE', path, controller)
            this.routes.push(route)
        },
    }  

}
