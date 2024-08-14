import { expect } from 'chai';
import Block from './BlockBase';
import Route from './Route';

/* eslint-disable  @typescript-eslint/no-unused-expressions*/

describe('Route', function () {
  const block = {} as typeof Block;

  it('Should be equal to path', function () {
    const route = new Route('/test', block, { rootQuery: '#app' });
    expect(route.match('/test')).to.be.true;
  });

  it('Should have right parameters', function () {
    const route = new Route('/test', block, { rootQuery: '#app' });
    expect(route._pathname).to.equal('/test');
    expect(route._blockClass).to.equal(block);
    expect(route._props.rootQuery).to.equal('#app');
  });
});
