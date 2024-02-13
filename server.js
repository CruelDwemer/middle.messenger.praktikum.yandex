import express from "express"
const app = express();

const PORT = 3000;
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.send('hello world');
});

app.listen(PORT, (err) => {
    if (err) console.log("Ошибка при запуске сервера");
    console.log(`Приложение успешно запущено на - ${PORT}!`);
    // open(`http://localhost:${PORT}`);
});