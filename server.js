import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "dist")))

const PORT = 3000;
// respond with "hello world" when a GET request is made to the homepage
app.get('*', function(req, res) {
    res.sendFile(path.join(path.join(__dirname, "dist"), 'index.html'));
});

app.listen(PORT, (err) => {
    if (err) console.log("Ошибка при запуске сервера");
    console.log(`Приложение успешно запущено на - ${PORT}!`);
    // open(`http://localhost:${PORT}`);
});
