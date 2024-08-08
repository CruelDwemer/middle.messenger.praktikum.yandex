/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const profileEditTemplate = require("./profileEdit.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import profileEditTemplate from "./profileEdit.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";
import onSubmit from "../../common/utils/formSubmit"
import InputField, { InputFieldProps } from "../../common/components/inputField/inputField";
import { PATH } from "../../common/core/Router";
import "./profileEdit.scss"
import {State} from "../../common/core/Store";
import connect from "../../common/utils/connect";
import {toCamelCase} from "../../common/utils/stringUtils";
import UsersController from "../../common/controllers/UsersController";

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


class ProfileInputField extends InputField {
    constructor(props: InputFieldProps) {
        super({
            ...props,
            classname: "input-field-profile-edit",
            input: new ProfileInput({
                ...props,
                onBlur: (event: Event | undefined) => {
                    if(!event) {
                        return
                    }
                    event.preventDefault();
                    this.validate()
                }
            })
        })
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if(newProps.value) {
            this.children.input.setProps({ value: newProps.value })
        }
        return true
    }
}

class ProfileEditPage extends Block {
    protected constructor(data: Props | Children = {}) {
        const emailInput = new ProfileInputField({
            name: "email",
            placeholder: "Почта",
            validationRules: {
                regexp: new RegExp(/^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/),
                regexpError: "Неправильный формат email"
            }
        })
        const newProps: Props = {
            data,
            emailInput,
            loginInput: new ProfileInputField({
                name: "login",
                placeholder: "Логин",
                validationRules: {
                    minLength: 3,
                    maxLength: 20,
                    regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/),
                    regexpError: "Допустимые символы - латиница, цифры, '_', '-'"
                }
            }),
            displayNameInput: new ProfileInputField({
                name: "display_name",
                placeholder: "Имя_в_чате",
                validationRules: {
                    minLength: 3,
                    maxLength: 20,
                    regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/),
                    regexpError: "Допустимые символы - латиница, цифры, '_', '-'"
                }
            }),
            firstNameInput: new ProfileInputField({
                name: "first_name",
                placeholder: "Имя",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/),
                    regexpError: "Допустимые символы - латиница или кириллица с заглавной буквы"
                }
            }),
            secondNameInput: new ProfileInputField({
                name: "second_name",
                placeholder: "Фамилия",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/),
                    regexpError: "Допустимые символы - латиница или кириллица с заглавной буквы"
                }
            }),
            phoneInput: new ProfileInputField({
                name: "phone",
                placeholder: "Телефон",
                validationRules: {
                    regexp: new RegExp(/^\+?\d{10,15}$/),
                    regexpError: "От 10 до 15 цифр, может начинаться с +"
                }
            }),
            saveButton: new Button({
                classname: "filled",
                label: "Сохранить",
                onClick: async (e: Event | undefined) => {
                    await onSubmit(e, this.children, PATH.PROFILE, "PROFILE DATA", UsersController.changeData)
                    this.hide()
                }
            }),
            closeButton: new Button({
                classname: "flat-red",
                label: "Закрыть",
                onClick: () => {
                    this.hide()
                }
            })
        }
        super(newProps);
    }

    static getStateToProps(state: State) {
        return { user: state.user }
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if(newProps.user) {
            Object.keys(newProps.user).forEach(key => {
                const targetName = `${toCamelCase(key)}Input`;
                if(this.children[targetName]) {
                    this.children[targetName].setProps({ value: newProps.user[key] })
                }
            })
        }
        return true
    }

    public show = () => {
        this.getContent()!.style.display = 'flex';
    }

    protected render(): string {
        return profileEditTemplate;
    }
}

export default connect(ProfileEditPage)
