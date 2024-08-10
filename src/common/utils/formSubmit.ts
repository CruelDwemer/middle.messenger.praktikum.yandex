import Input from '../components/inputField/inputField';
import { Children } from '../core/Block';
import Router from '../core/Router';

const onSubmit = async (
  event: Event | undefined,
  children: Children,
  navigateTo: string,
  dataFormHeader: string,
  controller?: (data: Record<string, string | number>) => Promise<void> | void,
) => {
  if (!event) return;
  event.preventDefault();

  const dataForms: Record<string, string | number> = {};

  let isValid = true;
  if (children) {
    Object.values(children).forEach(child => {
      if (child instanceof Input) {
        if (!child.validate()) {
          isValid = false;
        }
        dataForms[child.props.name as string] = child.value();
      }
    });
  }

  console.log(dataFormHeader);
  console.table(dataForms);

  if (isValid) {
    if (controller) {
      await controller(dataForms);
    } else {
      Router.go(navigateTo);
    }
  }
};

export default onSubmit;
