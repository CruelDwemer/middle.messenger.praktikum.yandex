import HTTP, { TOptionsData } from '../core/HTTP';
import BaseAPI from './BaseApi';

class AuthApi extends BaseAPI {
    public http = new HTTP(`${this.baseUrl}/auth`);

    public createUser(data: TOptionsData): Promise<unknown> {
        return this.http.post('/signup', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public login(data: TOptionsData): Promise<unknown> {
        return this.http.post('/signin', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public getUser(): Promise<unknown> {
        return this.http.get('/user');
    }

    public logout(): Promise<unknown> {
        return this.http.post('/logout');
    }
}

export default new AuthApi();
