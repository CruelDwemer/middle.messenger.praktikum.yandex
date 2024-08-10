/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
import ChatsApi from '../api/ChatsApi';
import Store from '../core/Store';
import BaseController from './BaseController';
import MessageController from './MessageController';
import handleError from '../utils/handleError';

class ChatsController extends BaseController {
  public getChats = async (): Promise<void> => {
    try {
      if (this.router?._currentRoute?._pathname !== '/messenger') return;
      const res = await ChatsApi.getChats();
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          Store.set('chats', JSON.parse(response));
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

  public async createChat(title: string): Promise<boolean | number | undefined> {
    if (!title) return false;
    try {
      const res = await ChatsApi.createChat(title);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          const chatId = JSON.parse(response)?.id;
          await this.getChats();
          MessageController.changeCurrentChat(chatId);
          return chatId;
        } if (status === 500) {
          this.router.go('/500');
          return false;
        }
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        return false;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public deleteChat = async (): Promise<void> => {
    try {
      const chatId = this?.store?.getState()?.currentChat?.chat?.id;
      if (typeof chatId !== 'number') return;
      const res = await ChatsApi.deleteChat({ chatId });
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          this.getChats().catch(handleError);
          this.store.set('currentChat', {
            isLoading: false,
            isLoadingOldMsg: false,
            scroll: 0,
            chat: null,
            messages: null,
          });
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

  public async addUser(id: number, user: number): Promise<boolean> {
    if (!id || !user) return false;
    try {
      const res = await ChatsApi.addUsers(id, [user]);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          return true;
        } if (status === 500) {
          this.router.go('/500');
          return false;
        }
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        return false;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  public addNewChatUser = async (user: Record<string, string | number>, addToCurrent?: boolean): Promise<boolean | void> => {
    const { display_name, login, id } = user;
    const chat = this?.store?.getState()?.currentChat?.chat?.id;
    if (!addToCurrent) {
      const title = display_name ?? login;
      await this.createChat(String(title));
    }
    if (!chat) return;
    return this.addUser(Number(chat), Number(id));
  };
}

export default new ChatsController();
