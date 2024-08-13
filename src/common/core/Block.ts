// import { v4 } from 'uuid';
import Handlebars from 'handlebars';
// import EventBus from './EventBus';
// import { State } from './Store';

import chat from '../components/chat/chat.hbs';
import message from '../components/message/message.hbs';
import { default as dataRow } from '../components/dataRow/dataRow.hbs';
import { default as button } from '../components/button/button.hbs';
import { default as menu } from '../svg/menu.hbs';
import { default as attach } from '../svg/attach.hbs';
// import { isEqual } from '../utils/objectUtils';
import BlockBase from './BlockBase';

/*
*   Приходится регистрировать partials здесь
*   Так как в противном случае они будут недоступны для шаблонов страниц, использующихся в блоках
* */
Handlebars.registerPartial('chat', chat);
Handlebars.registerPartial('menu', menu);
Handlebars.registerPartial('dataRow', dataRow);
Handlebars.registerPartial('button', button);
Handlebars.registerPartial('message', message);
Handlebars.registerPartial('attach', attach);

class Block extends BlockBase {}

export default Block;
