import Router from '../core/Router';
import Store from '../core/Store';

export default class BaseController {
    public router: typeof Router;
    public store: typeof Store;

    constructor() {
        this.router = Router;
        this.store = Store
        console.log("BaseController", this)
    }
}
