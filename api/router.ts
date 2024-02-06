import { IncomingMessage, ServerResponse } from "http";
import { getDogById, getDogs } from "./controllers/dog";


function createRoute(method?, path?, controller?){

    return {
        method,
        path,
        controller
    }
}

const router2 = {
    routes: [],
    get(path, controller){
        const route = createRoute('GET', path, controller)
        this.routes.push(route)
    },
    post(path, controller){
        const route = createRoute('POST', path, controller)
        this.routes.push(route)
    },
    put(path, controller){
        const route = createRoute('POST', path, controller)
        this.routes.push(route)
    },
    patch(path, controller){
        const route = createRoute('POST', path, controller)
        this.routes.push(route)
    },
    delete(path, controller){
        const route = createRoute('POST', path, controller)
        this.routes.push(route)
    },
}

export const router = {
    '/api/dogs': getDogs,
    '/api/dogs/:id': getDogById
} as const

router2.get('/api/dogs', getDogs)
router2.get('/api/dogs/:id', getDogs)


export function routeHandler(req: IncomingMessage, res: ServerResponse){

    if(!req.url) {
        return
    }

    for(const route in router){
        const {isMatch, params} = parseRouteParams(req.url, route)
        
        if(isMatch){
          const controller = router[route]
          controller({...req, params}, res)
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