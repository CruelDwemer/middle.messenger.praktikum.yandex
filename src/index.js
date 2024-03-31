import Handlebars from "handlebars/runtime";
// страницы
import errorPage from "./pages/error/error.hbs";
import mainPage from "./pages/main/main.hbs";
import profilePage from "./pages/profile/profile.hbs";
// компоненты
import button from "./common/components/button/button.hbs";
import input from "./common/components/input/input.hbs";
import chat from "./common/components/chat/chat.hbs";
import message from "./common/components/message/message.hbs";
import send from "./common/svg/send.hbs";
import menu from "./common/svg/menu.hbs";
import attach from "./common/svg/attach.hbs";
import dataRow from "./common/components/dataRow/dataRow.hbs";
import dataRowEdit from "./common/components/dataRow/dataRowEdit.hbs";
// стили

/* eslint-disable  @typescript-eslint/no-unused-vars */
// import buttonStyles from "./common/components/button/button.scss";
import messageStyles from "./common/components/message/message.scss";
import chatStyles from "./common/components/chat/chat.scss";
import dataRowStyles from "./common/components/dataRow/dataRow.scss";
import styles from "./common/styles/styles.scss";
// import loginStyle from "./pages/login/login.scss";
import errorStyle from "./pages/error/error.scss";
import mainStyle from "./pages/main/main.scss";
import profileStyle from "./pages/profile/profile.scss";

import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import ProfileEditPage from "./pages/profileEdit/profileEdit";

const messageText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const messageTime = "10:46";


// Handlebars.registerHelper("Button", ButtonC);
Handlebars.registerPartial("button", button);
Handlebars.registerPartial("input", input);
Handlebars.registerPartial("chat", chat);
Handlebars.registerPartial("message", message.bind(null, { text: messageText, time: messageTime }));
Handlebars.registerPartial("send", send);
Handlebars.registerPartial("menu", menu);
Handlebars.registerPartial("attach", attach);
Handlebars.registerPartial("dataRow", dataRow);
Handlebars.registerPartial("dataRowEdit", dataRowEdit);

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    const path = window.location.pathname;

    // console.log(Handlebars)

    const loginScreen = new LoginPage();
    const registerScreen = new RegisterPage();
    const profileEditScreen = new ProfileEditPage();
    switch (path) {
        case "/":
        case "":
            window.location.href = "/login";
            break
        case "/main":
            app.innerHTML = mainPage();
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
