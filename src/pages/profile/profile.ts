import profileTemplate from "./profile.hbs?raw";
import Block, {Children, Props} from "../../common/core/Block";
import connect from "../../common/utils/connect";
import { State } from "../../common/core/Store";
import Button from "../../common/components/button/button";
import AuthController from "../../common/controllers/AuthController";
import Router from "../../common/core/Router";
import ProfileEditPage from "../profileEdit/profileEdit";

class ProfilePage extends Block {
    protected constructor(data: Props | Children = {}) {
        const editModal = new ProfileEditPage({data})
        super({
            data,
            editModal,
            logoutButton: new Button({
                classname: "flat-red",
                label: "Выйти",
                onClick: () => {
                    AuthController.logout();
                }
            }),
            backButton: new Button({
                classname: "flat",
                label: "Назад",
                onClick: () => {
                    Router.back()
                }
            }),
            editButton: new Button({
                classname: "flat",
                label: "Изменить данные",
                onClick: () => {
                    editModal.show()
                }
            })
        })
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        console.log("ProfilePage componentDidUpdate", oldProps, newProps)
        return super.componentDidUpdate(oldProps, newProps);
    }

    static getStateToProps(state: State) {
        return { user: state.user }
    }

    protected  render() {
        return profileTemplate
    }
}

export default connect(ProfilePage)