import { IncomingMessage, ServerResponse } from "http"
import { JSONBodyParser, Router, ServerRequest } from "./utils"

export async function routeHandler(router: Router, req: IncomingMessage, res: ServerResponse) {

    if (!req.url) {
      return
    }
  
    for (const route of router.routes) {
  
      if(route.method !== req.method) continue
  
      const { isMatch, params } = parseRouteParams(req.url, route.path)

      
      const request: any = req
      
      if(route.method === 'POST' || route.method === 'PATCH' || route.method === 'PUT'){
        request.body = await JSONBodyParser(req)
      }
      
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