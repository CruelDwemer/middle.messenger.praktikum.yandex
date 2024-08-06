import Router from '../core/Router';
import Store from '../core/Store';

export default class BaseController {
    public router: typeof Router = Router;
    public store: typeof Store = Store
}
