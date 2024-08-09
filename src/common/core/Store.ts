import { set } from '../utils/objectUtils';
import EventBus from './EventBus';

// eslint-disable-next-line no-shadow
export enum STORE_EVENT {
    UPDATED = 'updated',
}

export type User = {
    first_name: string,
    second_name: string,
    display_name: string | null,
    login: string,
    avatar: string | null
}

export type Chat = {
    id: number,
    title: string,
    avatar: string | null,
    created_by: number,
    unread_count: number,
    last_message: {
        user: User,
        time: string,
        content: string,
        id: number
    } | null
}

export type State = {
    auth: boolean,
    user: User | null,
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
