import { default as chatListItemTemplate } from './chatListItem.hbs?raw';
import Block from '../../core/Block';
import connect from '../../utils/connect';
import Store, { State, IChat } from '../../core/Store';
import MessageController from '../../controllers/MessageController';
import { cloneDeep } from '../../utils/objectUtils';
import { getTimeString } from '../../utils/stringUtils';
import handleError from '../../utils/handleError';

class ChatListItem extends Block {
  public constructor(props: IChat) {
    const time = props.last_message ?
      getTimeString(props.last_message.time) :
      '';
    const content = props.last_message ?
      props.last_message.content :
      '';

    const newProps = {
      ...props,
      time,
      content,
    };

    super(newProps);

    this.props.events = {
      click: () => {
        if (Store.getState().currentChat) {
          MessageController.disconnect();
        }
        Store.set('currentChat', {
          chat: cloneDeep({ ...props }),
        });
        MessageController.connect().catch(handleError);
      },
    };
  }

  static getStateToProps(state: State) {
    return { currentChat: state.currentChat };
  }

  render(): string {
    return chatListItemTemplate;
  }
}

export default connect(ChatListItem);
