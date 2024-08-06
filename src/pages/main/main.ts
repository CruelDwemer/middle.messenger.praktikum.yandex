/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const mainTemplate = require("./main.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import mainTemplate from "./main.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import SendButton from "../../common/components/sendButton/sendButton";
import './main.scss';
import InputField from "../../common/components/inputField/inputField";
import Router, { PATH } from "../../common/core/Router";
import ChatsController from "../../common/controllers/ChatsController";
import Input from "../../common/components/inputField/inputField";
import UsersController from "../../common/controllers/UsersController";
import connect from '../../common/utils/connect';
import {State} from "../../common/core/Store";
import SearchUsersModal from "../../common/components/searchUsersModal/searchUsersModal";

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
                dataForms[child.props.name as string] = child.value()
            }
        })
    }
    console.log("MESSAGE")
    console.table(dataForms);
    console.log(`Form is ${isValid ? "" : "not"} valid`)
}

class MainPage extends Block {
    protected constructor(data: Props | Children = {}) {
        const modal = new SearchUsersModal(null);

        const onSearchButtonClick = async () => {
            const { children } = this;
            if(children) {
                const res: Input | undefined = Object.values(children)
                    .find(child => child instanceof Input && child.props.name === "search") as Input | undefined
                if(res && res.value()) {
                    const options = await UsersController.searchUsers(modal, res.value())
                    await console.log("options", options, this);
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
            })
        });
    }

    async componentDidMount() {
        const result = await ChatsController.getChats();
        if(result) {
            console.log("chats", result)
        }
    }

    static getStateToProps(state: State) {
        return { chats: state.chats };
    }

    protected render(): string {
        return mainTemplate;
    }
}

export default connect(MainPage)
