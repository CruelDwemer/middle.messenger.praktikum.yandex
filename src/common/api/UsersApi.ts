import HTTP, { TOptionsData } from '../core/HTTP';
import BaseAPI from './BaseApi';

class UsersApi extends BaseAPI {
    public http = new HTTP(`${this.baseUrl}/user`);

    public changeData(data: TOptionsData): Promise<unknown> {
        return this.http.put('/profile', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    // eslint-disable-next-line no-undef
    public changeAvatar(data: FormData): Promise<unknown> {
        return this.http.put('/profile/avatar', {
            data,
        });
    }

    public changePassword(data: TOptionsData): Promise<unknown> {
        return this.http.put('/password', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public getUser(id: number): Promise<unknown> {
        return this.http.get(`/user/${id}`);
    }

    public searchUser(login: string): Promise<unknown> {
        return this.http.post('/search', {
            data: { login },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }
}
export default new UsersApi();
