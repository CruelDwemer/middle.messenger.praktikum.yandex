/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import { wssBaseUrl } from '../api/config';
import Store, { IChat, State } from '../core/Store';
import ChatsApi from '../api/ChatsApi';
import { searchObjInArray } from '../utils/objectUtils';
import router from '../core/Router';
import handleError from '../utils/handleError';
import CURRENT_CHAT from '../actions/currentChatActions';

interface WssMessageEvent extends Event {
  message?: string
}
interface WssCloseEvent extends Event {
  wasClean?: boolean,
  code?: number | string,
  reason?: string
}

class MessageController {
  public EVENTS: Record<string, keyof WebSocketEventMap> = {
    OPEN: 'open',
    MESSAGE: 'message',
    ERROR: 'error',
    CLOSE: 'close',
  };

  private _userId: number | string | undefined;

  private _chatId: number | string | undefined;

  private _token?: string;

  private _ping: NodeJS.Timeout | undefined;

  private _offset: number = 0;

  private _allMessage: boolean = false;


  public events: Record<string, (() => void) | void> = {};

  public baseUrl: string = wssBaseUrl;

  public socket: WebSocket | null = null;

  public async getConnectData(): Promise<void> {
    this._userId = Store?.getState()?.user?.id;
    this._chatId = Number(Store?.getState()?.currentChat?.chat?.id);
    this._token = await this.getToken(this._chatId);
  }

  public connect = async (): Promise<void> => {
    await this.getConnectData();
    this._offset = 0;
    const url = `${this.baseUrl}/${this._userId}/${this._chatId}/${this._token}`;
    try {
      this.socket = new WebSocket(url);
      this._addEvents();
    } catch (e) {
      console.log(e);
    }
  };

  private _reconnect(): void {
    this._allMessage = false;
    this.connect().catch(handleError);
  }

  public disconnect = (): void => {
    if (!this.socket) return;
    clearInterval(this._ping);
    this._allMessage = false;
    this._ping = undefined;
    this._offset = 0;

    this._removeEvents();
    this.socket?.close();
    this.socket = null;
  };

  public changeCurrentChat(id: number | undefined | string): void {
    if (!id) return;
    const chat = searchObjInArray<State['chats']>(Store.getState().chats, 'id', Number(id)) as IChat;
    if (chat && chat?.id !== Store?.getState()?.currentChat?.chat?.id) {
      Store.set(CURRENT_CHAT.IS_LOADING, true);
      Store.set(CURRENT_CHAT.CHAT, chat);

      this.disconnect();
      this.connect().catch(handleError);
    }
  }

  private _addEvents() {
    this.socket?.addEventListener(this.EVENTS.OPEN, this._handleOpen as EventListener);
    this.socket?.addEventListener(this.EVENTS.MESSAGE, this._handleMessage as EventListener);
    this.socket?.addEventListener(this.EVENTS.ERROR, this._handleError as EventListener);
    this.socket?.addEventListener(this.EVENTS.CLOSE, this._handleClose as EventListener);
  }

  private _removeEvents() {
    this.socket?.removeEventListener(this.EVENTS.OPEN, this._handleOpen as EventListener);
    this.socket?.removeEventListener(this.EVENTS.MESSAGE, this._handleMessage as EventListener);
    this.socket?.removeEventListener(this.EVENTS.ERROR, this._handleError as EventListener);
    this.socket?.removeEventListener(this.EVENTS.CLOSE, this._handleClose as EventListener);
  }

  private getToken = async (chatID: number) => {
    try {
      const res = await ChatsApi.getToken(chatID);
      if (res) {
        const { status, response } = res;
        if (status === 200) {
          return JSON.parse(response).token;
        } if (status === 500) {
          router.go('/500');
        } else {
          alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  private _handleOpen = () => {
    Store.set(CURRENT_CHAT.MESSAGES, []);
    this.getMessage();
    this._ping = setInterval(() => {
      this.socket?.send(JSON.stringify({
        content: '',
        type: '',
      }));
    }, 20000);
  };

  private _handleMessage = (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      if (Array.isArray(data) && data.length < 20) {
        this._allMessage = true;
        Store.set(CURRENT_CHAT.IS_LOADING, false);
        Store.set(CURRENT_CHAT.IS_LOADING_OLD_MSG, false);
      }
      if (Array.isArray(data) && data.length) {
        if (data[0].id === 1) {
          Store.set(CURRENT_CHAT.MESSAGES, data);
          Store.set(CURRENT_CHAT.IS_LOADING, false);
        } else {
          const oldMessages = Store?.getState()?.currentChat?.messages ?? [];
          Store.set(CURRENT_CHAT.MESSAGES, [...oldMessages, ...data]);
          Store.set(CURRENT_CHAT.IS_LOADING_OLD_MSG, false);
        }
      } else if (typeof data === 'object' && data?.type === 'message') {
        const oldMessages = Store?.getState()?.currentChat?.messages ?? [];
        Store.set(CURRENT_CHAT.MESSAGES, [data, ...oldMessages]);
        this._offset += 1;
      }
    } catch (error) {
      console.log(error);
    }
  };

  private _handleError = (e: WssMessageEvent) => {
    if (e.message) {
      console.log('Ошибка', e.message);
    }
    this.disconnect();
  };

  public getMessage = (): void => {
    if (this._allMessage) {
      return;
    }
    if (this._offset) {
      Store.set(CURRENT_CHAT.IS_LOADING_OLD_MSG, true);
    }
    this.socket?.send(JSON.stringify({
      content: this._offset,
      type: 'get old',
    }));
    this._offset += 20;
  };

  public sendMessage = (message: Record<string, unknown>): void => {
    const content = message.message;
    this.socket?.send(JSON.stringify({
      content,
      type: 'message',
    }));
  };

  private _handleClose = ({
    wasClean = false,
    code = '',
    reason = '',
  }: WssCloseEvent) => {
    if (wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }

    console.log(`Код: ${code} | Причина: ${reason}`);

    this.disconnect();
    if (code === 1006) {
      this._reconnect();
    }
  };
}


export default new MessageController();
