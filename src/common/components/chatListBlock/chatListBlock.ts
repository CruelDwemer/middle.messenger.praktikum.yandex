import { default as mainTemplate } from './chatListBlock.hbs?raw';
import Block, { BlockDataType } from '../../core/Block';
import ChatsController from '../../controllers/ChatsController';
import connect from '../../utils/connect';
import { IChat, State } from '../../core/Store';
import ChatListItem from '../chatListItem/chatListItem';

const noResultsText = 'Нет чатов';

interface IChatListBlockProps extends BlockDataType {
  chats: IChat[]
}

class ChatListBlock extends Block {
  lists = {
    chatList: [] as (new (props: IChat) => typeof ChatListItem)[],
  };

  constructor() {
    super({
      chatList: [],
      noResultsText,
    });
  }

  async componentDidMount() {
    await ChatsController.getChats();
  }

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  protected componentDidUpdate(_: IChatListBlockProps, newProps: IChatListBlockProps): boolean {
    if (newProps.chats) {
      this.lists.chatList = newProps.chats.map(chat => new ChatListItem(chat)) as [];
      if (this.lists.chatList.length) {
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

  static getStateToProps(state: State) {
    return {
      chats: state.chats,
    };
  }

  protected render(): string {
    return mainTemplate;
  }
}

export default connect(ChatListBlock);
