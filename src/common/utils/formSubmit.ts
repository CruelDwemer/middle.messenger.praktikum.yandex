import Input from "../components/input/input";
import {Children} from "../core/Block";

const onSubmit = (
    event: Event | undefined,
    children: Children,
    navigateTo: string,
    dataFormHeader: string
) => {
    if (!event) return;
    event.preventDefault();

    const dataForms: Record<string, string | false> = {};

    let isValid = true;
    if(children) {
        Object.values(children).forEach(child => {
            if(child instanceof Input) {
                if(!child.validate()) {
                    isValid = false
                }
                dataForms[child.props.name as string] = child.value()
            }
        })
    }

    console.log(dataFormHeader);
    console.table(dataForms);
    if(isValid) {
        window.location.href = navigateTo
    }
}

export default onSubmit
