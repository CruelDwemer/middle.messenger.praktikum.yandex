import HTTP, { TOptionsData, HTTPResponse } from '../core/HTTP';
import BaseAPI from './BaseApi';

class AuthApi extends BaseAPI {
  public http = new HTTP(`${this.baseUrl}/auth`);

  public createUser(data: TOptionsData): HTTPResponse {
    return this.http.post('/signup', {
      data,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  public login(data: TOptionsData): HTTPResponse {
    return this.http.post('/signin', {
      data,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  public getUser(): HTTPResponse {
    return this.http.get('/user');
  }

  public logout(): HTTPResponse {
    return this.http.post('/logout');
  }
}

export default new AuthApi();
