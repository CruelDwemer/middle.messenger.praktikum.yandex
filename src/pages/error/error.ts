import { default as errorTemplate } from "./error.hbs?raw";
import Block from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Router from "../../common/core/Router";

class ErrorPage extends Block {
    constructor(props) {
        super({
            message: props.message,
            backButton: new Button({
                classname: "flat",
                label: "Назад",
                onClick: () => Router.back()
            })
        })
    }
    render() {
        return errorTemplate
    }
}

export default ErrorPage
