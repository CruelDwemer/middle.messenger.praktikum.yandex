import Block  from '../core/Block';
import store from '../core/Store';
import { StoreEvent } from '../core/Store';

function connect<C extends Block, P>(Component: C):
{ new(...args: P): C; prototype: object } | { new(): C; prototype: object } {
  return class extends Component {
    constructor(...args: P) {
      super([...args]);
      store.on(StoreEvent.UPDATED, () => {
        const props = Component.getStateToProps({ ...store.getState() });
        this.setProps({ ...props });
      });
    }
  };
}

export default connect;
