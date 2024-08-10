/* eslint-disable no-undef */
/* eslint-disable no-alert */
import UsersApi from '../api/UsersApi';
import Block from '../core/Block';
import { TOptionsData } from '../core/HTTP';
import BaseController from './BaseController';

export interface ISearchUsersResult extends Record<string, string | null | number> {
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
      const res = await UsersApi.changeData(data);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          alert('Изменения в профиль внесены!');
          this.store.set('user', JSON.parse(response));
        } else if (status === 500) {
          this.router.go('/500');
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  public changePassword = async (data: TOptionsData) => {
    try {
      const res = await UsersApi.changePassword(data);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          // eslint-disable-next-line no-alert, no-undef
          alert('Пароль изменен!');
          this.store.set('', '');
        } else if (status === 500) {
          this.router.go('/500');
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  public searchUsers = async (self: Block, value: string) => {
    if (!value) {
      self.setProps({ items: null });
      return;
    }
    try {
      const res = await UsersApi.searchUser(value);
      if (res) {
        const { status, response } = res;
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  // eslint-disable-next-line no-undef
  public changeAvatar = async (file: FormData) => {
    try {
      const res = await UsersApi.changeAvatar(file);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          this.store.set('user', JSON.parse(response));
        } else if (status === 500) {
          this.router.go('/500');
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UsersController();
