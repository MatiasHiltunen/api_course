import { IncomingMessage } from "http"
import { HTTPMethods, JSONBodyParser, NodeResponse, Router, ServerRequest } from "./utils"

export async function routeHandler(router: Router, req: IncomingMessage, res: NodeResponse) {

  if (!req.url) {
    return
  }
  const method = req.method

  if (!method) {
    return
  }

  for (const route of router.routes[method]) {

    const { isMatch, params } = parseRouteParams(req.url, route.path)

    if (isMatch) {

      const request: any = req

      if (method === HTTPMethods.post || method === HTTPMethods.put || method === HTTPMethods.patch) {
        request.body = await JSONBodyParser(req)
      }

      request.params = params

      await route.controller(request as ServerRequest, res)
      break
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