/* eslint-disable class-methods-use-this */
import { baseUrl } from './config';

export default class BaseAPI {
  baseUrl: string = baseUrl;

  create():unknown { throw new Error('Not implemented'); }

  request():unknown { throw new Error('Not implemented'); }

  update():unknown { throw new Error('Not implemented'); }

  delete():unknown { throw new Error('Not implemented'); }
}
