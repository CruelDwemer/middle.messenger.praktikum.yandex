import Block, { PropsWithChildrenType } from "../core/Block";
import store from "../core/Store";
import { STORE_EVENT } from "../core/Store";

function connect<C extends typeof Block>(Component: C): { new(...args: PropsWithChildrenType[]): unknown; prototype: object } {
    return class extends Component {
        constructor(...args: PropsWithChildrenType[]) {
            super([...args]);
            store.on(STORE_EVENT.UPDATED, () => {
                const props = Component.getStateToProps({ ...store.getState() });
                this.setProps({ ...props });
            });
        }
    };
}

export default connect
