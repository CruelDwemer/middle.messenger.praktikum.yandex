import template from "./input.hbs?raw";
import Block, { Props } from "../../core/Block";
import "./input.scss"

export interface IInput extends Block {
    value: () => string
}

interface IRules {
    minLength?: number,
    maxLength?: number,
    regexp?: RegExp
}

interface InputProps extends Props{
    validationRules?: IRules,
    type?: string
}

export default class Input extends Block implements IInput {
    constructor(props: InputProps) {
        if(!props.type) {
            props.type = "text"
        }
        super(props);
        this.props.events = {
            blur: (event: Event | undefined) => {
                if(!event) {
                    return
                }
                event.preventDefault();
                this.validate()
            }
        }
    }

    private _value() {
        if(this.element instanceof HTMLInputElement) {
            return this.element.value;
        }
        return "";
    }

    public value() {
        if(!this.validate()) {
            return "";
        }
        return this._value();
    }

    private _validate() {
        let hasErrors = false;
        const rules: IRules = this.props.validationRules as IRules;

        if("minLength" in rules && rules.minLength) {
            if(this._value().length < rules.minLength) {
                hasErrors = true
            }
        }
        if("maxLength" in rules && rules.maxLength) {
            if(this._value().length > rules.maxLength) {
                hasErrors = true
            }
        }
        if(rules.regexp) {
            if(!rules.regexp.test(this._value())) {
                hasErrors = true
            }
        }
        return !hasErrors
    }

    public validate() {
        const isValid = this._validate();
        if(isValid) {
            this.applyRegularStyle()
        } else {
            this.applyErrorStyle()
        }
        return isValid
    }

    applyRegularStyle() {
        this.getContent()!.classList.remove("input-error")
    }

    applyErrorStyle() {
        this.getContent()!.classList.add("input-error")
    }

    protected render(): string {
        return template
    }
}
