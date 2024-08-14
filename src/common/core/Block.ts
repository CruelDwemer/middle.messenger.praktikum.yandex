import Handlebars from 'handlebars';

import chat from '../components/chat/chat.hbs';
import message from '../components/message/message.hbs';
import { default as dataRow } from '../components/dataRow/dataRow.hbs';
import { default as button } from '../components/button/button.hbs';
import { default as menu } from '../svg/menu.hbs';
import { default as attach } from '../svg/attach.hbs';
import BlockBase from './BlockBase';

/*
*   Приходится регистрировать partials здесь
*   Так как в противном случае они будут недоступны для шаблонов страниц, использующихся в блоках
*
*   Отделено от BlockBase класса, так как при импорте в файлах теста возникала ошибка из-за невозможности импортировать
*   .hbs файлы в Node окружении.
*
* */
Handlebars.registerPartial('chat', chat);
Handlebars.registerPartial('menu', menu);
Handlebars.registerPartial('dataRow', dataRow);
Handlebars.registerPartial('button', button);
Handlebars.registerPartial('message', message);
Handlebars.registerPartial('attach', attach);

class Block extends BlockBase {}

export default Block;
