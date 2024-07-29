import HTTP, { TOptionsData } from '../core/HTTP';
import BaseAPI from './BaseApi';

class ChatsApi extends BaseAPI {
    public http = new HTTP(`${this.baseUrl}/chats`);

    public getChats(): Promise<unknown> {
        return this.http.get('/');
    }

    public getToken(id: number): Promise<unknown> {
        return this.http.post(`/token/${id}`);
    }

    public createChat(title: string): Promise<unknown> {
        return this.http.post('/', {
            data: { title },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public addUsers(chatId: number, users: Array<number>): Promise<unknown> {
        return this.http.put('/users', {
            data: { chatId, users },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public deleteChat(data: TOptionsData): Promise<unknown> {
        return this.http.delete('/', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    public deleteUsers(data: TOptionsData): Promise<unknown> {
        return this.http.delete('/users', {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }
}
export default new ChatsApi();
