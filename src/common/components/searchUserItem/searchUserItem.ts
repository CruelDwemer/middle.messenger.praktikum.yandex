import searchUserItemTemplate from "./searchUserItem.hbs?raw";
import Block  from "../../core/Block";
import Button from "../button/button";

class SearchUserItem extends Block {
    constructor(props) {
        console.log("SearchUserItem constructor", {...props})
        super({
            ...props,
            startChatButton: new Button({
                classname: "filled",
                label: "Начать чат",
            })
        });
    }

    render(): string {
        return searchUserItemTemplate
    }
}

export default SearchUserItem
