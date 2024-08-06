import { set } from '../utils/objectUtils';
import EventBus from './EventBus';

// eslint-disable-next-line no-shadow
export enum STORE_EVENT {
    UPDATED = 'updated',
}
export type Chat = Record<string, number | string | unknown>

// export type State = Record<string, boolean | string | object | null>;
export type State = {
    auth: boolean,
    user: null | Record<string, string | number>,
    isLoading: false,
    getPage: string,
    chats: Array<Chat>,
    currentChat: {
        isLoading: boolean,
        isLoadingOldMsg: boolean,
        scroll: number,
        chat: null | Chat,
        messages: Array<Chat> | null,
    },
};

class Store extends EventBus {
    constructor() {
        super();
        this.on(STORE_EVENT.UPDATED, () => null);
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
            this.emit(STORE_EVENT.UPDATED);
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
            this.emit(STORE_EVENT.UPDATED);
        } catch (e) {
            console.log(e);
        }
    }
}

export default new Store();
