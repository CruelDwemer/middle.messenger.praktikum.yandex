import {default as searchUsersModalTemplate} from "./searchUsersModal.hbs?raw";
import Block  from "../../core/Block";
import "./searchUsersModal.scss"
import Button from "../button/button";
import SearchUserItem from "../searchUserItem/searchUserItem";

class Modal extends Block {
    constructor(items, results = new SearchUserItem({})) {
        const closeButton: Button = new Button({
            classname: "filled",
            label: "Закрыть",
            onClick: () => {
                this.hide()
            }
        })
        super({
            items,
            closeButton,
            results
        });
    }

    public show = () => {
        this.getContent()!.style.display = 'flex';
    }

    protected render(): string {
        return searchUsersModalTemplate
    }
}

export default Modal
