import { default as searchUsersModalTemplate } from "./searchUsersModal.hbs?raw";
import Block, { Props }  from "../../core/Block";
import "./searchUsersModal.scss"
import Button from "../button/button";
import SearchUserItem from "../searchUserItem/searchUserItem";
import connect from "../../utils/connect";
import {State} from "../../core/Store";

const noResultsText = "Нет результатов";

class Modal extends Block {
    constructor(items = [], results: SearchUserItem[] = [], hasActiveChat: boolean = false) {
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
            results,
            noResultsText,
            hasActiveChat
        });
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if(newProps.items) {
            this.lists.results = newProps.items.map(item => new SearchUserItem(item, this.hide.bind(this), this.props.hasActiveChat));
            if(this.lists.results.length) {
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

    public show = () => {
        this.getContent()!.style.display = 'flex';
    }

    static getStateToProps(state: State) {
        return { hasActiveChat: !!state.currentChat?.chat }
    }

    protected render(): string {
        return searchUsersModalTemplate
    }
}

export default connect(Modal)
