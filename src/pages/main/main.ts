/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const mainTemplate = require("./main.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import { default as mainTemplate } from "./main.hbs?raw";
import Block, {Children, PropsWithChildrenType} from '../../common/core/Block';
import Button from "../../common/components/button/button";
import SendButton from "../../common/components/sendButton/sendButton";
import './main.scss';
import InputField from "../../common/components/inputField/inputField";
import Router, { PATH } from "../../common/core/Router";
import ChatsController from "../../common/controllers/ChatsController";
import Input from "../../common/components/inputField/inputField";
import UsersController from "../../common/controllers/UsersController";
import connect from '../../common/utils/connect';
import { IChat, State } from "../../common/core/Store";
import SearchUsersModal from "../../common/components/searchUsersModal/searchUsersModal";
import ChatListItem from "../../common/components/chatListItem/chatListItem";
import MessageController from "../../common/controllers/MessageController";

const noResultsText = "Нет чатов";

const sendMessage = (
    event: Event | undefined,
    children: Children,
) => {
    if (!event) return;
    event.preventDefault();

    const dataForms: Record<string, string | false> = {};

    let isValid = true;
    if(children) {
        Object.values(children).forEach(child => {
            if(child instanceof InputField && child.props.name === "message") {
                if(!child.validate()) {
                    isValid = false
                }
                dataForms[child.props.name as string] = child.value();
                child.resetValue()
            }
        })
    }

    if(isValid) {
        MessageController.sendMessage(dataForms)
    }
}

interface IMainPageProps {
    chats: IChat[],
    messages: IChat[],
    activeChatTitle: string
}
type ExtendedProps = PropsWithChildrenType & IMainPageProps

class MainPage extends Block {
    lists = {
        chatList: []
    }
    protected constructor(data: IMainPageProps) {
        const modal = new SearchUsersModal(null);

        const onSearchButtonClick = async () => {
            const { children } = this;
            if(children) {
                const res: Input | undefined = Object.values(children)
                    .find(child => child instanceof Input && child.props.name === "search") as Input | undefined
                if(res && res.value()) {
                    await UsersController.searchUsers(modal, res.value())
                }
            }
        }

        const searchButton = new Button({
            classname: "filled",
            label: "Искать",
            onClick: async () => {
                await onSearchButtonClick()
                modal.show()
            }
        });

        super({
            data,
            modal,
            chatList: [],
            activeChatTitle: "",
            messageInput: new InputField({
                name: "message",
                classname: "active-bottom-input",
                inputClassname: "active-bottom-input",
                placeholder: "Сообщение",
                validationRules: {
                    minLength: 1
                }
            }),
            profileButton: new Button({
                classname: "flat",
                label: "Профиль >",
                onClick: () => Router.go(PATH.PROFILE)
            }),
            searchInput: new InputField({
                placeholder: "Поиск",
                name: "search"
            }),
            searchButton,
            sendButton: new SendButton({
                width: "40px",
                height: "40px",
                onClick: (e: Event | undefined): void => {
                    sendMessage(e, this.children)
                }
            }),
            deleteUser: new Button({
                classname: "flat-red",
                label: "Удалить чат",
                onClick: async () => {
                    await ChatsController.deleteChat()
                }
            }),
            noResultsText
        });
    }

    async componentDidMount() {
        await ChatsController.getChats();
    }

    /* eslint-disable  @typescript-eslint/no-unused-vars */
    protected componentDidUpdate(_: ExtendedProps, newProps: ExtendedProps): boolean {
        if(newProps.chats) {
            this.lists.chatList = newProps.chats.map(chat => new ChatListItem(chat));
            if(this.lists.chatList.length) {
                if(this.props.noResultsText) {
                    this.setProps({ noResultsText: "" })
                }
            } else {
                if(!this.props.noResultsText) {
                    this.setProps({ noResultsText })
                }
            }
        }
        return true
    }

    static getStateToProps(state: State) {
        return {
            chats: state.chats,
            messages: state.currentChat?.messages && [...state.currentChat.messages].reverse(),
            activeChatTitle: state.currentChat?.chat?.title || ""
        };
    }

    protected render(): string {
        return mainTemplate;
    }
}

export default connect<MainPage, IMainPageProps>(MainPage)
