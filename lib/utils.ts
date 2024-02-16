import { IncomingMessage, ServerResponse } from "http"

export type ServerRequest = IncomingMessage & { params?: any, body?: any }

export type Controller = (req: ServerRequest, res: NodeResponse) => Promise<any>

export type Route = {
    path: string,
    controller: Controller
}

export enum HTTPMethods { 
    get = "GET",
    post = "POST",
    put = "PUT",
    patch = "PATCH",
    delete = "DELETE" 
}

export interface Router {
    readonly routes: Routes;
    readonly get: (path: string, controller: Controller) => void;
    readonly post: (path: string, controller: Controller) => void;
    readonly put: (path: string, controller: Controller) => void;
    readonly patch: (path: string, controller: Controller) => void;
    readonly delete: (path: string, controller: Controller) => void;
}

function createRoute(path: string, controller: Controller): Route {

    return {
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

    console.log(body)
    return body
}



type Routes = {
    [HTTPMethods.get]: Route[],
    [HTTPMethods.post]: Route[],
    [HTTPMethods.put]: Route[],
    [HTTPMethods.patch]: Route[],
    [HTTPMethods.delete]: Route[],
}

export function createRouter(): Router {
    return {
        routes: {
            [HTTPMethods.get]: [],
            [HTTPMethods.post]: [],
            [HTTPMethods.put]: [],
            [HTTPMethods.patch]: [],
            [HTTPMethods.delete]: [],
        },
        get(path: string, controller: Controller) {
            const route = createRoute( path, controller)
            this.routes[HTTPMethods.get].push(route)
        },
        post(path: string, controller: Controller) {
            const route = createRoute( path, controller)
            this.routes[HTTPMethods.post].push(route)
        },
        put(path: string, controller: Controller) {
            const route = createRoute( path, controller)
            this.routes[HTTPMethods.put].push(route)
        },
        patch(path: string, controller: Controller) {
            const route = createRoute( path, controller)
            this.routes[HTTPMethods.patch].push(route)
        },
        delete(path: string, controller: Controller) {
            const route = createRoute( path, controller)
            this.routes[HTTPMethods.delete].push(route)
        },
    }  

}

export class NodeResponse {

  res: ServerResponse
  headers: Record<string, string>

  constructor(res: ServerResponse){

    this.res = res

  }

  setHeader(header: Record<string, string>){
    this.headers = {...this.headers, ...header}
  }

  sendJson(data: any, status: number = 200){

    this.setHeader({'Content-Type': 'application/json'})

    this.res.writeHead(status, this.headers)

    this.res.end(JSON.stringify(data))
  }

  send(data: any, status: number = 200){
    this.res.writeHead(status, this.headers)

    this.res.end(data)
  }

  error(message: string | Error, status: number = 500){

    this.sendJson({
        error: message.toString()
    }, status)
  }

  ok(){
    this.res.writeHead(200)
    this.res.end()
  }
}
