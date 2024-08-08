import { default as searchUserItemTemplate } from "./searchUserItem.hbs?raw";
import Block  from "../../core/Block";
import Button from "../button/button";
import "./searchUserItem.scss"
import ChatsController from "../../controllers/ChatsController";

class SearchUserItem extends Block {
    constructor(props, onClose, hasActiveChat) {
        super({
            ...props,
            startChatButton: new Button({
                classname: "filled",
                label: "Начать чат",
                onClick: async () => {
                    await ChatsController.addNewChatUser(props);
                    onClose()
                }
            }),
            addToCurrentChatButton: hasActiveChat ? new Button({
                classname: "filled",
                label: "Добавить в текущий чат",
                onClick: async () => {
                    await ChatsController.addNewChatUser(props, hasActiveChat);
                    onClose()
                }
            }) : null
        });
    }

    render(): string {
        return searchUserItemTemplate
    }
}

export default SearchUserItem
