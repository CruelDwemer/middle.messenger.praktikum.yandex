import { v4 } from 'uuid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';
import { State } from './Store';
import { isEqual } from '../utils/objectUtils';

export type EventsEnum = {
  [key in Uppercase<string>]: Lowercase<string>;
};

export type Events = Record<string, EventListenerOrEventListenerObject>;
export type Props = Record<string | symbol, unknown>;
export type Children = Record<string, Element | Block>;
export type Lists = Record<string, typeof Element[] | typeof Block[] | unknown[]>;
export type Parent = Element | Block | undefined;

type FunctionType =
    ((event: Event | undefined) => void) | undefined;
export type PropsWithChildrenType = Record<string | symbol, Props | Children | Lists | FunctionType >;
export type BlockDataType = { [p: string]: unknown };

class Block {
  static EVENTS: EventsEnum = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  public id: string = v4();

  public props: Props;

  protected parent: Parent;

  public children: Children;

  public lists: Lists;

  private _meta: { tagName: string, props?: Props } | null = null;

  protected readonly eventBus: () => EventBus;

  private _element: HTMLElement | null = null;

  constructor(propsWithChildren: BlockDataType) {
    const eventBus: EventBus = new EventBus();

    const { props, children, lists, parent } = Block.getChildrenAndProps(propsWithChildren);

    this.parent = parent;
    this.children = children;
    this.lists = lists;
    this.props = this._makePropsProxy(props);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  static getChildrenAndProps(childrenAndProps: BlockDataType)
    : { props: Props, children: Children, parent: Parent, lists: Lists } {
    const props: Props = {};
    const children: Children = {};
    const lists: Lists = {};

    let parent: Parent;

    Object.entries(childrenAndProps as { [p: string]: unknown } | ArrayLike<unknown>)
      .forEach(([key, value]: [string, unknown]) => {
        if (value instanceof Block || value instanceof Element) {
          if (key === 'parent') {
            parent = value;
          } else {
            children[key] = value;
          }
        } else if (Array.isArray(value)) {
          lists[key] = value;
        } else {
          props[key] = value;
        }
      });

    return { props, children, lists, parent };
  }

  private _addEvents() {
    const { events = {} } = this.props as Props & { events: Events };

    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents() {
    const { events = {} } = this.props as { events: Events };

    Object.keys(events)
      .forEach((eventName) => {
        this._element?.removeEventListener(eventName, events[eventName]);
      });
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as (...args: unknown[]) => void);
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _init() {
    this.init();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init() {
    const tagName = this._meta?.tagName;
    if (tagName) this._element = document.createElement(tagName);
    return this;
  }

  private _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children)
      .forEach((child) => {
        if (child instanceof Block) child.dispatchComponentDidMount();
      });
  }

  componentDidMount() {
  }

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: BlockDataType, newProps: BlockDataType) {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(oldProps: BlockDataType, newProps: BlockDataType) {
    return !isEqual(oldProps, newProps);
  }

  public setProps = (nextProps: BlockDataType) => {
    if (nextProps) {
      Object.assign(this.props, nextProps);
      this.eventBus().emit(Block.EVENTS.FLOW_CDU, this.props as unknown, nextProps as unknown);
    }
  };

  public get element() {
    return this._element;
  }

  private _render() {
    const fragment = this.compile(this.render(), this.props);

    const newElement = fragment.firstElementChild as HTMLElement;

    this._removeEvents();
    if (this._element) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;

    this._addEvents();
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  protected compile(template: ((context: any) => string) | string, context: any) {
    const contextAndDummies = { ...context };
    const tmpId =  Math.floor(100000 + Math.random() * 900000);

    Object.entries(this.children).forEach(([name, component]) => {
      if (Array.isArray(component)) {
        contextAndDummies[name] = component.map((child) => `<div data-id="${child.id}"></div>`);
      } else {
        contextAndDummies[name] = `<div data-id="${component.id}"></div>`;
      }
    });

    Object.entries(this.lists).forEach(([key]) => {
      contextAndDummies[key] = `<div data-id="_list_${tmpId}"></div>`;
    });

    const html = Handlebars.compile(template)(contextAndDummies);

    const temp = document.createElement('template');
    temp.innerHTML = html;

    const replaceDummy = (component: Block) => {
      const dummy = temp.content.querySelector(`[data-id="${component.id}"]`);
      if (!dummy) return;
      component.getContent()?.append(...Array.from(dummy.childNodes));
      dummy.replaceWith(component.getContent()!);
    };

    /* eslint-disable  @typescript-eslint/no-unused-vars */
    Object.entries(this.children).forEach(([_, component]) => {
      if (Array.isArray(component)) {
        component.forEach((comp) => replaceDummy(comp));
      } else {
        replaceDummy(component as Block);
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listCont = document.createElement('template');
      child.forEach(item => {
        if (item) {
          if (item instanceof Block) {
            listCont.content.append(item.getContent() as Node);
          } else {
            /* eslint-disable @typescript-eslint/no-base-to-string */
            listCont.content.append(`${item.toString()}`);
          }
        }
      });

      const dummy = temp.content.querySelector(`[data-id="_list_${tmpId}"]`);
      if (dummy) {
        dummy.replaceWith(listCont.content);
      }
    });

    return temp.content;
  }

  protected render(): string {
    return '';
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: BlockDataType) {
    /* eslint-disable  @typescript-eslint/no-this-alias */
    const self = this;
    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldTarget = { ...target };
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget as unknown, target as unknown);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    } as ProxyHandler<Props>);
  }

  public show() {
    this.getContent()!.style.display = 'block';
  }

  public hide() {
    this.getContent()!.style.display = 'none';
  }

  static getStateToProps(state: State): Partial<State> | Record<string, unknown> {
    return state;
  }

}

export default Block;
