/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const profileEditTemplate = require("./profileEdit.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import { default as changePasswordTemplate } from "./changePassword.hbs?raw";
import Block, { Props, PropsWithChildrenType } from '../../core/Block';
import Button from "../button/button";
import onSubmit from "../../utils/formSubmit";
import { PATH } from "../../core/Router";
import { State } from "../../core/Store";
import connect from "../../utils/connect";
import UsersController from "../../controllers/UsersController";
import { ProfileInputField } from "../profileEdit/profileEdit";

class ChangePasswordModal extends Block {
    protected constructor(data: PropsWithChildrenType = {}) {
        const oldPassword = new ProfileInputField({
            name: "oldPassword",
            placeholder: "Старый пароль",
            validationRules: {
                minLength: 8,
                maxLength: 40,
                regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/),
                regexpError: "Допустимые символы - латиница, обязательно хотя бы одна заглавная буква и цифра"
            }
        })

        const newPassword = new ProfileInputField({
            name: "newPassword",
            placeholder: "Новый пароль",
            validationRules: {
                minLength: 8,
                maxLength: 40,
                regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/),
                regexpError: "Допустимые символы - латиница, обязательно хотя бы одна заглавная буква и цифра"
            }
        })

        const newProps: Props = {
            data,
            oldPassword,
            newPassword,
            saveButton: new Button({
                classname: "filled",
                label: "Сохранить",
                onClick: async (e: Event | undefined) => {
                    await onSubmit(e, this.children, PATH.PROFILE, "PASSWORD DATA", UsersController.changePassword)
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

    override getStateToProps(state: State) {
        return { user: state.user }
    }

    public show = () => {
        this.getContent()!.style.display = 'flex';
    }

    protected render(): string {
        return changePasswordTemplate;
    }
}

export default connect(ChangePasswordModal)
