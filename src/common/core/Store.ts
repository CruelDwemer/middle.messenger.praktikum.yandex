import { set } from '../utils/objectUtils';
import EventBus from './EventBus';
import { BlockDataType } from './BlockBase';

// eslint-disable-next-line no-shadow
export enum StoreEvent {
  UPDATED = 'updated',
}

export interface IUser extends Record<string, string | number | null> {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string | null,
  login: string,
  avatar: string | null
}

export interface IChat extends BlockDataType {
  id: number,
  title: string,
  avatar: string | null,
  created_by: number,
  unread_count: number,
  last_message: IMessage | null
}

export interface IMessage extends BlockDataType {
  user: IUser,
  time: string,
  content: string,
  id: number
}

export type State = {
  auth: boolean,
  user: IUser | null,
  isLoading: false,
  getPage: string,
  chats: IChat[],
  currentChat: {
    isLoading: boolean,
    isLoadingOldMsg: boolean,
    scroll: number,
    chat: null | IChat,
    messages: IMessage[] | null,
  },
};

class Store extends EventBus {
  constructor() {
    super();
    this.on(StoreEvent.UPDATED, () => null);
  }

  private state: State = {
    auth: false,
    user: null,
    isLoading: false,
    getPage: '/',
    chats: [],
    currentChat: {
      isLoading: false,
      isLoadingOldMsg: false,
      scroll: 0,
      chat: null,
      messages: null,
    },
  };

  public getState(): State {
    return this.state;
  }

  public set(path: string, value: unknown): void {
    try {
      set(this.state, path, value);
      this.emit(StoreEvent.UPDATED);
    } catch (e) {
      console.log(e);
    }
  }

  public setResetState(): void {
    try {
      this.state = {
        auth: false,
        user: null,
        isLoading: false,
        getPage: '/',
        chats: [],
        currentChat: {
          isLoading: false,
          isLoadingOldMsg: false,
          scroll: 0,
          chat: null,
          messages: null,
        },
      };
      this.emit(StoreEvent.UPDATED);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new Store();
