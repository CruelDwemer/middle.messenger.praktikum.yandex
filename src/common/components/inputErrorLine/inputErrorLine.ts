import errorLineTemplate from "./inputErrorLine.hbs?raw";
import Block, { Props } from "../../core/Block";
import "./inputErrorLine.scss"

interface IInputErrorLineProps extends Props {
    error?: string
}

export default class InputErrorLine extends Block {
    constructor(props: IInputErrorLineProps) {
        super(props);
    }
    protected render(): string {
        return errorLineTemplate
    }
}
