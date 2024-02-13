import { IncomingMessage, Server, ServerResponse } from "http";
import { createDog, getDogById, getDogs } from "./controllers/dog";

type ServerRequest = IncomingMessage & { params: {} }

type Controller = (req: ServerRequest, res: ServerResponse) => Promise<any>

type Route = {
  method: string,
  path: string,
  controller: Controller
}

function createRoute(method: string, path: string, controller: Controller): Route {

  return {
    method,
    path,
    controller
  }
}


export const router = {
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
} as const

/* export const router = {
    '/api/dogs': getDogs,
    '/api/dogs/:id': getDogById
} as const */

router.get('/api/dogs', getDogs)
router.get('/api/dogs/:id', getDogs)
router.post('/api/dogs', createDog)



export async function routeHandler(req: IncomingMessage, res: ServerResponse) {

  if (!req.url) {
    return
  }

  for (const route of router.routes) {

    if(route.method !== req.method) continue

    const { isMatch, params } = parseRouteParams(req.url, route.path)

    const request: any = req

    request.params = params

    if (isMatch) {
      await route.controller(request as ServerRequest, res)
    }
  }


}

function parseRouteParams(url: string, route: string) {
  const [path] = url.split('?')
  const requestUrl = path.split("/");

  const routeUrl = route.split("/");

  const params = {};
  let isMatch = requestUrl.length === routeUrl.length;

  if (!isMatch) {
    return {
      isMatch,
      params: {},
    };
  }

  for (let i = 0; i < routeUrl.length; i++) {
    if (routeUrl[i].startsWith(":")) {
      const routeParamName = routeUrl[i].slice(1);
      params[routeParamName] = requestUrl[i];
      continue;
    }

    if (requestUrl[i] !== routeUrl[i]) {
      isMatch = false;
      break;
    }
  }
  return {
    isMatch,
    params,
  };
}