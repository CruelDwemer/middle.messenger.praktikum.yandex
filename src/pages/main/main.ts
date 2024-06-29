/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
const mainTemplate = require("./main.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
// import mainTemplate from "./main.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import SendButton from "../../common/components/sendButton/sendButton";
import Input from "../../common/components/input/input";
import './main.scss';

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
            if(child instanceof Input && child.props.name === "message") {
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

export default class MainPage extends Block {
    protected constructor(data: Props | Children = {}) {
        super({
            data,
            messageInput: new Input({
                name: "message",
                classname: "active-bottom-input",
                placeholder: "Сообщение",
                validationRules: {
                    minLength: 1
                }
            }),
            profileButton: new Button({
                classname: "flat",
                label: "Профиль >",
                link: "/profile"
            }),
            searchInput: new Input({
                placeholder: "Поиск"
            }),
            sendButton: new SendButton({
                width: "40px",
                height: "40px",
                onClick: (e: Event | undefined): void => {
                    sendMessage(e, this.children)
                }
            })
        });
    }

    protected render(): string {
        return mainTemplate;
    }
}
