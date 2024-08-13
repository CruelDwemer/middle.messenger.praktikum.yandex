import { default as searchUsersModalTemplate } from './searchUsersModal.hbs?raw';
import Block, { PropsWithChildrenType } from '../../core/Block';
import './searchUsersModal.scss';
import Button from '../button/button';
import SearchUserItem from '../searchUserItem/searchUserItem';
import connect from '../../utils/connect';
import { State } from '../../core/Store';
import { ISearchUsersResult } from '../../controllers/UsersController';

const noResultsText = 'Нет результатов';

interface ISearchUsersModalProps {
  items: ISearchUsersResult[] | null,
  results: SearchUserItem[],
  hasActiveChat: boolean
}
type ExtendedProps = ISearchUsersModalProps & PropsWithChildrenType;

class SearchUsersModal extends Block {
  public lists: {
    results: SearchUserItem[]
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
      this.lists.results = newProps.items.map(item => (new SearchUserItem(item, this.hide.bind(this), this.props.hasActiveChat as boolean)));
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

  static getStateToProps(state: State) {
    return { hasActiveChat: !!state.currentChat?.chat };
  }

  protected render(): string {
    return searchUsersModalTemplate;
  }
}

export default connect(SearchUsersModal);
