import errorLineTemplate from "./inputErrorLine.hbs?raw";
import Block from "../../core/Block";
import "./inputErrorLine.scss"

interface IInputErrorLineProps {
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
