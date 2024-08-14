### Мессенджер
Учебное задание

- **За основу взят предоставленный дизайн**

https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?type=design&node-id=1-2&mode=design&t=wXjfarhhVYXgOi76-0

- **Проект доступен по ссылке**

https://deploy--bmike-messenger.netlify.app/

- **Команды**

установка - `npm install`

билд - `npm run build`

запуск - `npm run start`

запуск тестов = `npm run test`

В проекте используется хук pre-commit для прогона линтеров и тестов

- **Примечание:**

Для создания нового чата нужно в поисковом окне ввести имя пользователя и нажать кнопку "искать".
В списке найденных нажать в строке нужного пользователя на кнопку "Начать чат".

Для добавления пользователя в уже существующий чат, необходимо выбрать этот чат,
после чеого при поиске пользователя появится кнопка "добавить в текущий чат".

Удаление пользователя из чата - в шапке выбранного чата нажать кнопку меню,
в появившемся окне выбрать пользователя для удаления из чата. Знаю, что идеале нужно по нажатию на кнопку меню
нужно сделать выпадайку с действиями добавления / удаления пользователя, а так же удаления чата, но пока сделал
в минимально рабочем варианте.
