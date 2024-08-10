/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import Block from './Block';
import Route from './Route';
import Store from './Store';

export enum PATH {
  LOGIN = '/',
  REGISTER = '/sign-up',
  MAIN = '/messenger',
  ERROR404 = '/error-404',
  ERROR500 = '/error-500',
  PROFILE = '/settings',
}

const rootBlockQuery = '#app';

class Router {
  public routes: Array<Route> = [];

  public history: History = window.history;

  public _currentRoute: Route | null = null;

  _rootQuery: string = '';

  static __instance: Router | null = null;

  constructor(rootQuery: string = '') {
    if (Router.__instance) {
      // eslint-disable-next-line no-constructor-return
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block): Router {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = ((event: Event) => {
      const target = event?.currentTarget as Window;

      this._onRoute(target?.location.pathname);
    });

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string): void {
    if (Store.getState().auth) {
      if (pathname === PATH.LOGIN || pathname === PATH.REGISTER) {
        pathname = PATH.MAIN;
        this.history.pushState({}, '', PATH.MAIN);
      }
    } else if (pathname !== PATH.LOGIN && pathname !== PATH.REGISTER) {
      pathname = PATH.LOGIN;
      this.history.pushState({}, '', PATH.LOGIN);
    }

    const route: Route | undefined = this.getRoute(pathname) ?? this.getRoute(PATH.ERROR404);
    if (!route) {
      return;
    }
    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}

export default new Router(rootBlockQuery);
