import Handlebars from "handlebars/runtime";
// страницы
import errorPage from "./pages/error/error.hbs";
import loginPage from "./pages/login/login.hbs";
import registerPage from "./pages/register/register.hbs";
import mainPage from "./pages/main/main.hbs";
import profilePage from "./pages/profile/profile.hbs";
// компоненты
import button from "./common/components/button/button.hbs";
import chat from "./common/components/chat/chat.hbs";
import message from "./common/components/message/message.hbs";
import send from "./common/svg/send.hbs";
import menu from "./common/svg/menu.hbs";
import attach from "./common/svg/attach.hbs";
import dataRow from "./common/components/dataRow/dataRow.hbs";
// стили
import buttonStyles from "./common/components/button/button.scss";
import messageStyles from "./common/components/message/message.scss";
import chatStyles from "./common/components/chat/chat.scss";
import dataRowStyles from "./common/components/dataRow/dataRow.scss";
import styles from "./common/styles/styles.scss";
import loginStyle from "./pages/login/login.css";
import errorStyle from "./pages/error/error.css";
import mainStyle from "./pages/main/main.scss";
import profileStyle from "./pages/profile/profile.scss";

const messageText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const messageTime = "10:46";

Handlebars.registerPartial("button", button);
Handlebars.registerPartial("chat", chat);
Handlebars.registerPartial("message", message.bind(null, { text: messageText, time: messageTime }));
Handlebars.registerPartial("send", send);
Handlebars.registerPartial("menu", menu);
Handlebars.registerPartial("attach", attach);
Handlebars.registerPartial("dataRow", dataRow);


document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    const path = window.location.pathname;
    switch (path) {
        case "/":
        case "":
        case "/login":
            app.innerHTML = loginPage();
            break
        case "/main":
            app.innerHTML = mainPage();
            break
        case "/profile":
            app.innerHTML = profilePage();
            break
        case "/register":
            app.innerHTML = registerPage();
            break
        case "/404":
            app.innerHTML = errorPage({ message: "Не найдено"});
            break
        case "/500":
            app.innerHTML = errorPage({ message: "Ошибка сервера"});
            break
        default:
            window.location.href = "/404";
    }
})
