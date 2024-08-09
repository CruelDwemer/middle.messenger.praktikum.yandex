import { default as chatListItemTemplate } from "./chatListItem.hbs?raw";
import Block from "../../core/Block";
import connect from "../../utils/connect";
import Store, { State, IChat } from "../../core/Store";
import MessageController from "../../controllers/MessageController";
import { cloneDeep } from "../../utils/objectUtils";
import { getTimeString } from "../../utils/stringUtils";

class ChatListItem extends Block {
    constructor(props: IChat) {
        const time = props.last_message ?
            getTimeString(props.last_message.time) :
            "";
        const content = props.last_message ?
            props.last_message.content :
            "";

        super({
            ...props,
            time,
            content
        });

        this.props.events = {
            click: async () => {
                if(Store.getState().currentChat) {
                    await MessageController.disconnect()
                }
                Store.set("currentChat", {
                    chat: cloneDeep({...props})
                });
                await MessageController.connect()
            }
        }
    }

    static getStateToProps(state: State) {
        return { chats: state.chats, currentChat: state.currentChat };
    }

    render(): string {
        return chatListItemTemplate
    }
}

export default connect<typeof ChatListItem, IChat>(ChatListItem)
