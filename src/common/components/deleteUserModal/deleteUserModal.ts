import { default as deleteUsersModalTemplate } from './deleteUserModal.hbs?raw';
import Block from '../../core/Block';
import { PropsWithChildrenType } from '../../core/BlockBase';
import Button from '../button/button';
import { ISearchUsersResult } from '../../controllers/UsersController';
import DeleteUserListItem from '../deleteUserListItem/deleteUserListItem';

const noResultsText = 'Нет результатов';

interface IDeleteUsersModalProps {
  items: ISearchUsersResult[] | null,
  results: DeleteUserListItem[]
}
type ExtendedProps = IDeleteUsersModalProps & PropsWithChildrenType;

class DeleteUsersModal extends Block {
  public lists: {
    results: DeleteUserListItem[]
  } = {
      results: [],
    };

  constructor() {
    const closeButton: Button = new Button({
      classname: 'filled',
      label: 'Закрыть',
      onClick: () => {
        this.hide();
      },
    });

    super({
      items: null,
      closeButton,
      noResultsText,
    });
  }

  protected componentDidUpdate(_: ExtendedProps, newProps: ExtendedProps): boolean {
    if (newProps.items) {
      this.lists.results = newProps.items.map(item => (new DeleteUserListItem(item, this.hide.bind(this))));
      if (this.lists.results.length) {
        if (this.props.noResultsText) {
          this.setProps({ noResultsText: '' });
        }
      } else {
        if (!this.props.noResultsText) {
          this.setProps({ noResultsText });
        }
      }
    }
    return true;
  }

  public show = () => {
    this.getContent()!.style.display = 'flex';
  };

  protected render(): string {
    return deleteUsersModalTemplate;
  }
}

export default DeleteUsersModal;
