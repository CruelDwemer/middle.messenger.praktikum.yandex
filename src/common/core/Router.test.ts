import { expect } from 'chai';
import sinon from 'sinon';
import Block, { BlockDataType } from './BlockBase';
import Router from './Router';
import { beforeEach } from 'mocha';

/* eslint-disable  @typescript-eslint/no-unused-expressions*/

describe('Router', function () {
  let testBlock: typeof Block;
  const router = Router;

  beforeEach(() => {

    class Button extends Block {
      constructor({ ...args }: BlockDataType) {
        super({ ...args });
      }

      render() {
        return ('<div id="button"></div>');
      }
    }

    testBlock = new Button({}) as unknown as typeof Block;
  });

  it('Should add routes by \"use()\"', function () {
    router.use('/test', testBlock);
    expect(router.routes).to.have.lengthOf(1);
  });

  it('Should change page using \"go()\"', function () {
    const stub = sinon.stub(window.history, 'pushState');
    router.use('/test', testBlock);
    router.go('/test');
    expect(stub.calledWith({}, '', '/test')).to.be.true;
    stub.restore();
  });

  it('Should move by \"forward()\"', function () {
    const stubForward = sinon.stub(window.history, 'forward');
    router.forward();
    expect(stubForward.called).to.be.true;
    stubForward.restore();
  });

  it('Should move by \"back()\"', function () {
    const stubBack = sinon.stub(window.history, 'back');
    router.back();
    expect(stubBack.called).to.be.true;
    stubBack.restore();
  });
});
