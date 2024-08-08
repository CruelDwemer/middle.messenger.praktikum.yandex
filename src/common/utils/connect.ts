import Block, {Children, Props} from "../core/Block";
import store from "../core/Store";
import {STORE_EVENT} from "../core/Store";

function connect(Component: typeof Block): typeof Block {
    return class extends Component {
        constructor(...args: (Props | Children)[]) {
            super(...args);
            store.on(STORE_EVENT.UPDATED, () => {
                const props = Component.getStateToProps({ ...store.getState() });
                this.setProps({ ...props });
            });
        }
    };
}

export default connect
