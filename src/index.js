import Handlebars from "handlebars/runtime";
// страницы
import errorPage from "./pages/error/error.hbs";
import profilePage from "./pages/profile/profile.hbs";
// компоненты
import button from "./common/components/button/button.hbs";
import input from "./common/components/input/input.hbs";
import dataRow from "./common/components/dataRow/dataRow.hbs";
import dataRowEdit from "./common/components/dataRow/dataRowEdit.hbs";

// стили
/* eslint-disable  @typescript-eslint/no-unused-vars */
import messageStyles from "./common/components/message/message.scss";
import chatStyles from "./common/components/chat/chat.scss";
import dataRowStyles from "./common/components/dataRow/dataRow.scss";
import styles from "./common/styles/styles.scss";
import errorStyle from "./pages/error/error.scss";
import profileStyle from "./pages/profile/profile.scss";

import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import ProfileEditPage from "./pages/profileEdit/profileEdit";
import MainPage from "./pages/main/main";

Handlebars.registerPartial("button", button);
Handlebars.registerPartial("input", input);
Handlebars.registerPartial("dataRow", dataRow);
Handlebars.registerPartial("dataRowEdit", dataRowEdit);

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    const path = window.location.pathname;

    const loginScreen = new LoginPage();
    const registerScreen = new RegisterPage();
    const profileEditScreen = new ProfileEditPage();
    const mainScreen = new MainPage();

    switch (path) {
        case "/":
        case "":
            window.location.href = "/login";
            break
        case "/main":
            app.append(mainScreen.getContent());
            break
        case "/login":
            app.append(loginScreen.getContent());
            break
        case "/profile/edit":
            app.append(profileEditScreen.getContent());
            break
        case "/profile":
            app.innerHTML = profilePage();
            break
        case "/register":
            app.append(registerScreen.getContent());
            break
        case "/404":
            app.innerHTML = errorPage({ message: "Не найдено" });
            break
        case "/500":
            app.innerHTML = errorPage({ message: "Ошибка сервера" });
            break
        default:
            window.location.href = "/404";
    }
})
