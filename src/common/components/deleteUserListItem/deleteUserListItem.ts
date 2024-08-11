import { default as deleteUserListItemTemplate } from './deleteUserListItem.hbs?raw';
import Block  from '../../core/Block';
import Button from '../button/button';
import ChatsController from '../../controllers/ChatsController';
import { ISearchUsersResult } from '../../controllers/UsersController';

class DeleteUserListItem extends Block {
  constructor(props: ISearchUsersResult, onClose: () => void) {
    super({
      ...props,
      deleteUserButton: new Button({
        classname: 'filled',
        label: 'Удалить пользователя',
        onClick: async () => {
          await ChatsController.deleteChatUser(props.id);
          onClose();
        },
      }),
    });
  }

  render(): string {
    return deleteUserListItemTemplate;
  }
}

export default DeleteUserListItem;
