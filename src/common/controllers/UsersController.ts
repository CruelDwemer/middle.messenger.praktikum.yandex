/* eslint-disable no-undef */
/* eslint-disable no-alert */
import UsersApi from '../api/UsersApi';
import Block from '../classes/Block';
import { TOptionsData } from '../classes/HTTPTransport';
import BaseController from './BaseController';

export interface ISearchUsersResult {
  'id': number,
  'first_name': string,
  'second_name': string,
  'display_name': string | null,
  'phone': string,
  'login': string,
  'avatar': string | null,
  'email': string
}

class UsersController extends BaseController {
  public changeData = async (data: TOptionsData) => {
    try {
      const { status, response } = await UsersApi.changeData(data);
      if (status === 200) {
        alert('Изменения в профиль внесены!');
        this.store.set('user', JSON.parse(response));
      } else if (status === 500) {
        this.router.go('/500');
      } else {
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  };

  public changePassword = async (data: TOptionsData) => {
    try {
      const { status, response } = await UsersApi.changePassword(data);
      if (status === 200) {
        // eslint-disable-next-line no-alert, no-undef
        alert('Пароль изменен!');
        this.store.set('', '');
      } else if (status === 500) {
        this.router.go('/500');
      } else {
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  };

  public searchUsers = async (self: typeof Block, value: string) => {
    if (!value) {
      self.setProps({ items: null });
      return;
    }
    try {
      const { status, response } = await UsersApi.searchUser(value);
      if (status === 200) {
        const items = JSON.parse(response);
        if (items) {
          self.setProps({ items });
        }

      } else if (status === 500) {
        this.router.go('/500');
      } else {
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  };

  // eslint-disable-next-line no-undef
  public changeAvatar = async (file: FormData) => {
    try {
      const { status, response } = await UsersApi.changeAvatar(file);
      if (status === 200) {
        this.store.set('user', JSON.parse(response));
      } else if (status === 500) {
        this.router.go('/500');
      } else {
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UsersController();
