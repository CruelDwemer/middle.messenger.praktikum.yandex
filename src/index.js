import errorPage from "./pages/errorPage/errorPage.hbs";

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    const path = window.location.pathname;
    console.log("PATH", path)
    switch (path) {
        case "/":
        case "":
            app.innerHTML = "Start page";
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
