import Block, { BlockDataType } from '../core/Block';
import store from '../core/Store';
import { StoreEvent } from '../core/Store';

function connect(Component: typeof Block) {
  return class extends Component {
    constructor({ ...args }: BlockDataType) {
      super({ ...args });
      store.on(StoreEvent.UPDATED, () => {
        const props = Component.getStateToProps({ ...store.getState() });
        this.setProps({ ...props });
      });
    }
  };
}

export default connect;
