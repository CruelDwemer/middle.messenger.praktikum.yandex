import { default as profileTemplate } from "./profile.hbs?raw";
import Block from "../../common/core/Block";
import connect from "../../common/utils/connect";
import { State } from "../../common/core/Store";
import Button from "../../common/components/button/button";
import AuthController from "../../common/controllers/AuthController";
import Router from "../../common/core/Router";
import ProfileEditPage from "../../common/components/profileEdit/profileEdit";
import ChangePasswordModal from "../../common/components/changePassword/changePassword";
import Input from "../../common/components/input/input";
import UsersController from "../../common/controllers/UsersController";
import { resourcesUrl } from "../../common/api/config";

class ProfilePage extends Block {
    protected constructor() {
        const editModal = new ProfileEditPage(undefined);
        const changePasswordModal = new ChangePasswordModal(undefined);

        async function changeAvatar(e: Event) {
            const data = new FormData();
            const elem = e.target as HTMLInputElement;
            if (elem.files && elem.files![0]) {
                data.append('avatar', elem.files![0]);
            }
            await UsersController.changeAvatar(data as FormData);
        }

        super({
            editModal,
            changePasswordModal,
            logoutButton: new Button({
                classname: "flat-red",
                label: "Выйти",
                onClick: async () => {
                    await AuthController.logout();
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
            }),
            changePasswordButton: new Button({
                classname: "flat",
                label: "Изменить пароль",
                onClick: () => {
                    changePasswordModal.show()
                }
            }),
            changeAvatar: new Input({
                placeholder: "",
                type: "file",
                name: "avatar",
                label: "Поменять аватар",
                onChange: changeAvatar
            })
        })
    }

    static getStateToProps(state: State) {
        return {
            user: state.user,
            avatarImg: state.user?.avatar ? resourcesUrl + state.user.avatar : "",
        }
    }

    protected  render() {
        return profileTemplate
    }
}

export default connect<typeof ProfilePage>(ProfilePage)
