/* eslint-disable no-undef */
/* eslint-disable no-alert */
import authApi from '../api/AuthApi';
import { TOptionsData } from '../core/HTTP';
import { PATH } from '../core/Router';
import BaseController from './BaseController';

class AuthController extends BaseController {
  static __instance: AuthController;

  constructor() {
    if (AuthController.__instance) {
      return AuthController.__instance;
    }
    super();
    AuthController.__instance = this;
  }

  public createUser = async (data: TOptionsData): Promise<void> => {
    try {
      const res = await authApi.createUser(data);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          const isOK = await this.getUserInfo();
          if (isOK) {
            this.router.go(PATH.MAIN);
          }
        } else if (status === 500) {
          this.router.go(PATH.ERROR500);
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  public async login(data: TOptionsData): Promise<void> {
    try {
      this.store.set('isLoading', true);
      const res = await authApi.login(data);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          this.store.set('auth', true);
          this.router.go(PATH.MAIN);
          await this.getUserInfo();
          this.store.set('isLoading', false);
        } else if (status === 500) {
          this.router.go(PATH.ERROR500);
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async getUserInfo(): Promise<boolean | undefined> {
    try {
      const res = await authApi.getUser();
      if (res) {
        const { status, response } = res;
        if (status === 200 && response) {
          this.store.set('user', JSON.parse(response));
          this.store.set('auth', true);
          return true;
        }
        return false;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      const res = await authApi.logout();
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          this.store.setResetState();
          this.router.go('/');
        } else if (status === 500) {
          this.router.go(PATH.ERROR500);
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default new AuthController();
