import Handlebars from "handlebars/runtime";
// страницы
import errorPage from "./pages/error/error.hbs";
import loginPage from "./pages/login/login.hbs";
import registerPage from "./pages/register/register.hbs";
import button from "./common/components/button/button.hbs";
// стили
import buttonStyles from "./common/components/button/button.css";
import styles from "./common/styles/styles.css";
import loginStyle from "./pages/login/login.css"

Handlebars.registerPartial("button", button);

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    const path = window.location.pathname;
    switch (path) {
        case "/":
        case "":
            app.innerHTML = "Start page";
            break
        case "/login":
            app.innerHTML = loginPage();
            break
        case "/register":
            app.innerHTML = registerPage();
            break
        case "/page404":
            app.innerHTML = errorPage({ message: "Не найдено"});
            break
        case "/page500":
            app.innerHTML = errorPage({ message: "Ошибка сервера"});
            break
        default:
            window.location.href = "/page404";
    }
})
