import { IncomingMessage, ServerResponse } from "http";

type RouteHandler = (req: IncomingMessage, res: ServerResponse, parameters?: Record<string, string>) => void;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler,
};

export class RoutesHandler {
    private static shared: RoutesHandler;

    private constructor() {}

    public static getSharedInstance(): RoutesHandler {
        if (!RoutesHandler.shared) {
            // Create a new instance only if one doesn't exist
            RoutesHandler.shared = new RoutesHandler();
        }

        return RoutesHandler.shared; // Return the single instance
    }

    private routes: Route[] = [];

    addRoutes(route: Route) {
        this.routes.push(route)
    };

    getMatchedRoute(method: string, url: string): {handler: RouteHandler, params: Record<string, string>} | null {
        for (const route of this.routes) {
            if (route.method !== method) continue;

            // Converte path com :params para regex
            const paramNames: string[] = [];
            const regexPath = route.path.replace(/:([^/]+)/g, (_, key) => {
                paramNames.push(key);
                console.log(paramNames)
                return "([^/]+)";
            });

            const regex = new RegExp(`^${regexPath}$`);
            console.log(regex)
            const match = url.match(regex);
             
            console.log(match)

            if (match) {
                const params: Record<string, string> = {};
                paramNames.forEach((name, i) => (params[name] = match[i + 1]));
                return { handler: route.handler, params };
            }
        }
        return null;
    };
}