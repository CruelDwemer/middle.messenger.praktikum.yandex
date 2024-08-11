import Handlebars from 'handlebars/runtime';
// компоненты
import button from './common/components/button/button.hbs';
import input from './common/components/input/input.hbs';
import dataRow from './common/components/dataRow/dataRow.hbs';
import dataRowEdit from './common/components/dataRow/dataRowEdit.hbs';

import router, {
  PATH,
} from './common/core/Router';
import Store from './common/core/Store';
import AuthController from './common/controllers/AuthController';

// стили
import './common/components/message/message.scss';
import './common/components/chat/chat.scss';
import './common/components/dataRow/dataRow.scss';
import './common/styles/styles.scss';
import './pages/error/error.scss';
import './pages/profile/profile.scss';

import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import ProfilePage from './pages/profile/profile';
import MainPage from './pages/main/main';
import ErrorPage from './pages/error/error';
import handleError from './common/utils/handleError';
import COMMON from './common/actions/commonActions';

Handlebars.registerPartial('button', button);
Handlebars.registerPartial('input', input);
Handlebars.registerPartial('dataRow', dataRow);
Handlebars.registerPartial('dataRowEdit', dataRowEdit);

const Error404Page = ErrorPage.bind(null, { message: 'Не найдено' });
const Error500Page = ErrorPage.bind(null, { message: 'Ошибка сервера' });

document.addEventListener('DOMContentLoaded', () => {
  AuthController.getUserInfo().then(() => {
    router
      .use(PATH.LOGIN, LoginPage)
      .use(PATH.REGISTER, RegisterPage)
      .use(PATH.PROFILE, ProfilePage)
      .use(PATH.MAIN, MainPage)
      .use(PATH.ERROR404, Error404Page)
      .use(PATH.ERROR500, Error500Page)
      .start();
    Store.set(COMMON.GET_PAGE, '');
  }).catch(handleError);
});
