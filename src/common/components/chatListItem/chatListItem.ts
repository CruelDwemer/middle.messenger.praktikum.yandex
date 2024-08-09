import { default as chatListItemTemplate } from "./chatListItem.hbs?raw";
import Block from "../../core/Block";
import connect from "../../utils/connect";
import Store, { State } from "../../core/Store";
import MessageController from "../../controllers/MessageController";
import { cloneDeep } from "../../utils/objectUtils";
import { getTimeString } from "../../utils/stringUtils";

interface IChatlListItemProps {
    last_message: {
        time: string,
        content: string
    } | null
}

class ChatListItem extends Block {
    constructor(props: IChatlListItemProps) {
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

export default connect(ChatListItem)
