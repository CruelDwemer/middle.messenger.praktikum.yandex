/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const profileEditTemplate = require("./profileEdit.hbs?raw");
import profileEditTemplate from "./profileEdit.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";

class ProfileInput extends Input {
    constructor(props: Props) {
        props.classname = "profile-data-input";
        super(props);
    }
    applyRegularStyle() {
        this.getContent()!.classList.remove("profile-input-error")
    }
    applyErrorStyle() {
        this.getContent()!.classList.add("profile-input-error")
    }
}

interface ProfileEditBlockProps extends Props {
    onSubmit: (event: Event | undefined) => void
}

export default class ProfileEditPage extends Block {
    protected constructor(data: Props | Children = {}) {
        const newProps: ProfileEditBlockProps = {
            data,
            onSubmit: (event: Event | undefined) => {
                if(!event) return;
                event.preventDefault();

                const dataForms: Record<string, string | false> = {};

                let isValid = true;
                Object.values(this.children).forEach(child => {
                    if(child instanceof Input) {
                        if(!child.validate()) {
                            isValid = false
                        }
                        dataForms[child.props.name as string] = child.value()
                    }
                })
                console.log("PROFILE DATA")
                console.table(dataForms);
                if(isValid) {
                    window.location.href = "/profile"
                }
            },
            emailInput: new ProfileInput({
                name: "email",
                placeholder: "Почта",
                validationRules: {
                    regexp: new RegExp(/^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/)
                }
            }),
            loginInput: new ProfileInput({
                name: "login",
                placeholder: "Логин",
                validationRules: {
                    minLength: 3,
                    maxLength: 20,
                    regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/)
                }
            }),
            chatNameInput: new ProfileInput({
                name: "display_name",
                placeholder: "Имя_в_чате",
                validationRules: {
                    minLength: 3,
                    maxLength: 20,
                    regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/)
                }
            }),
            firstNameInput: new ProfileInput({
                name: "first_name",
                placeholder: "Имя",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/)
                }
            }),
            secondNameInput: new ProfileInput({
                name: "second_name",
                placeholder: "Фамилия",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/)
                }
            }),
            phoneInput: new ProfileInput({
                name: "phone",
                placeholder: "Телефон",
                validationRules: {
                    regexp: new RegExp(/^\+?\d{10,15}$/)
                }
            }),
            saveButton: new Button({
                classname: "filled",
                label: "Сохранить",
                onClick: (e: Event | undefined) => {
                    this.props.onSubmit(e)
                }
            })
        }
        super(newProps);
    }

    protected render(): string {
        return profileEditTemplate;
    }
}
