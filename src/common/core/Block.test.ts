import { expect } from 'chai';
import Block, { BlockDataType } from './BlockBase';
import Sinon from 'sinon';
import { before, describe } from 'mocha';

/* eslint-disable  @typescript-eslint/no-unused-expressions*/

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

  it('Should render props', () => {
    const textData = 'Click me';
    const buttonComponent = new blockClass({ text: textData });
    const res = (buttonComponent.element as unknown as HTMLDivElement)?.innerHTML;

    expect(res).to.be.eq(textData);
  });

  it('Should handle click', () => {
    const handler = Sinon.stub();
    const buttonComponent = new blockClass({ text: 'I am button!', events:
          { click: handler },
    });

    const event = new MouseEvent('click');
    (buttonComponent.element as unknown as HTMLDivElement)?.dispatchEvent(event);

    expect(handler.calledOnce).to.be.true;
  });

  it('Should invoke render', () => {
    const buttonComponent = new blockClass({});

    const spyDCM = Sinon.spy(buttonComponent, 'render' as keyof Block);

    buttonComponent.setProps({ text: 'bla' });

    expect(spyDCM.calledOnce).to.be.true;
  });
});
