import errorLineTemplate from './inputErrorLine.hbs?raw';
import Block  from '../../core/Block';
import './inputErrorLine.scss';

export default class InputErrorLine extends Block {
  protected render(): string {
    return errorLineTemplate;
  }
}
