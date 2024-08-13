import { expect } from 'chai';
import Block, { BlockDataType } from './BlockBase';
// import Sinon from 'sinon';
import { before, describe } from 'mocha';

describe('Test for Block', () => {
  let blockClass: typeof Block;

  before(() => {
    class Button extends Block {
      constructor({ ...args }: BlockDataType) {
        super({ ...args });
      }

      render() {
        return ('<div id="button">{{text}}</div>');
      }
    }

    blockClass = Button;
  });

  it('Rendering props', () => {
    const textData = 'Click me';
    const buttonComponent = new blockClass({ text: textData });
    const res = (buttonComponent.element as unknown as HTMLDivElement)?.innerHTML;

    expect(res).to.be.eq(textData);
  });
});
