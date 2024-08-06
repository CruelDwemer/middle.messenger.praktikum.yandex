import Block, {Children, Props} from "../core/Block";
import store from "../core/Store";
import {STORE_EVENT} from "../core/Store";

function connect(Component: typeof Block): typeof Block {
    // используем class expression
    return class extends Component {
        constructor(...args: (Props | Children)[]) {
            // не забываем передать все аргументы конструктора
            super(...args);
            // подписываемся на событие
            console.log("connect", store)
            store.on(STORE_EVENT.UPDATED, () => {
                // вызываем обновление компонента, передав данные из хранилища
                const props = Component.getStateToProps({ ...store.getState() });

                this.setProps({ ...props });
                console.log("connect this", this)
            });
        }
    };
}

export default connect
