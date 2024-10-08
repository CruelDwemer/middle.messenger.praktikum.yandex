import { default as mainTemplate } from './main.hbs?raw';
import Block from '../../common/core/Block';
import { Children } from '../../common/core/BlockBase';
import Button from '../../common/components/button/button';
import SendButton from '../../common/components/sendButton/sendButton';
import './main.scss';
import InputField from '../../common/components/inputField/inputField';
import Router, { PATH } from '../../common/core/Router';
import ChatsController from '../../common/controllers/ChatsController';
import Input from '../../common/components/inputField/inputField';
import UsersController from '../../common/controllers/UsersController';
import connect from '../../common/utils/connect';
import { State } from '../../common/core/Store';
import SearchUsersModal from '../../common/components/searchUsersModal/searchUsersModal';
import MessageController from '../../common/controllers/MessageController';
import ChatListBlock from '../../common/components/chatListBlock/chatListBlock';
import MenuButton from '../../common/components/menuButton/menuButton';
import DeleteUserModal from '../../common/components/deleteUserModal/deleteUserModal';

const sendMessage = (
  event: Event | undefined,
  children: Children,
) => {
  if (!event) return;
  event.preventDefault();

  const dataForms: Record<string, string | false> = {};

  let isValid = true;
  if (children) {
    Object.values(children).forEach(child => {
      if (child instanceof InputField && child.props.name === 'message') {
        if (!child.validate()) {
          isValid = false;
        }
        dataForms[child.props.name as string] = child.value();
        child.resetValue();
      }
    });
  }

  if (isValid) {
    MessageController.sendMessage(dataForms);
  }
};

class MainPage extends Block {
  constructor() {
    const searchModal = new SearchUsersModal({}) as Block;

    const onSearchButtonClick = async () => {
      const { children } = this;
      if (children) {
        const res: Input | undefined = Object.values(children)
          .find(child => child instanceof Input && child.props.name === 'search') as Input | undefined;
        if (res && res.value()) {
          await UsersController.searchUsers(searchModal, res.value());
        }
      }
    };

    const searchButton = new Button({
      classname: 'filled',
      label: 'Искать',
      onClick: async () => {
        await onSearchButtonClick();
        searchModal.show();
      },
    });

    const deleteUserModal = new DeleteUserModal() as Block;

    const onMenuButtonClick = async () => {
      await ChatsController.getChatUsers(deleteUserModal);
    };

    const menuButton = new MenuButton({
      onClick: async () => {
        await onMenuButtonClick();
        deleteUserModal.show();
      },
    }) as Block;

    super({
      messages: null,
      searchModal,
      menuButton,
      deleteUserModal,
      chatListBlock: new ChatListBlock({}),
      activeChatTitle: '',
      messageInput: new InputField({
        name: 'message',
        classname: 'active-bottom-input',
        inputClassname: 'active-bottom-input',
        placeholder: 'Сообщение',
        validationRules: {
          minLength: 1,
        },
      }),
      profileButton: new Button({
        classname: 'flat',
        label: 'Профиль >',
        onClick: () => Router.go(PATH.PROFILE),
      }),
      searchInput: new InputField({
        placeholder: 'Поиск',
        name: 'search',
      }),
      searchButton,
      sendButton: new SendButton({
        width: '40px',
        height: '40px',
        onClick: (e: Event | undefined): void => {
          sendMessage(e, this.children);
        },
      }),
      deleteUser: new Button({
        classname: 'flat-red',
        label: 'Удалить чат',
        onClick: ChatsController.deleteChat,
      }),
    });
  }

  static getStateToProps(state: State) {
    return {
      messages: state.currentChat?.messages && [...state.currentChat.messages].reverse(),
      activeChatTitle: state.currentChat?.chat?.title || '',
    };
  }

  protected render(): string {
    return mainTemplate;
  }
}

export default connect(MainPage);
