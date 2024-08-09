import { v4 } from 'uuid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';
import {State} from "./Store";

// const chat = require("../components/chat/chat.hbs");
// const message = require("../components/message/message.hbs");
// const menu = require("../svg/menu.hbs");
// const attach = require("../svg/attach.hbs");

/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import chat from "../components/chat/chat.hbs";
import message from "../components/message/message.hbs";
import dataRow from "../components/dataRow/dataRow.hbs";
import button from "../components/button/button.hbs";
import menu from "../svg/menu.hbs";
import attach from "../svg/attach.hbs";
import {isEqual} from "../utils/objectUtils";

// const messageText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// const messageTime = "10:46";

/*
*   Приходится регистрировать partials здесь
*   Так как в противном случае они будут недоступны для шаблонов страниц, использующихся в блоках
* */
Handlebars.registerPartial("chat", chat);
Handlebars.registerPartial("menu", menu);
Handlebars.registerPartial("dataRow", dataRow);
Handlebars.registerPartial("button", button);
Handlebars.registerPartial("message", message);
Handlebars.registerPartial("attach", attach);

type EventsEnum = {
    [key in Uppercase<string>]: Lowercase<string>;
};

type Events = Record<string, EventListenerOrEventListenerObject>;
export type Props = Record<string | symbol, unknown>;
export type Children = Record<string, Element | Block>;
export type Lists = Record<string, Element[] | Block[] | unknown[]>;
type Parent = Element | Block | undefined;

export type PropsWithChildrenType = (Props | Children | Lists)

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

    protected constructor(propsWithChildren: PropsWithChildrenType) {
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

    static getChildrenAndProps(childrenAndProps: PropsWithChildrenType)
        : { props: Props, children: Children, parent: Parent, lists: Lists } {
        const props: Props = {};
        const children: Children = {};
        const lists = {};

        let parent: Parent;

        Object.entries(childrenAndProps)
            .forEach(([key, value]: [string, unknown]) => {
                if(value instanceof Block || value instanceof Element) {
                    if(key === 'parent') {
                        parent = value;
                    } else {
                        children[key] = value;
                    }
                } else if(Array.isArray(value)) {
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
        if(tagName) this._element = document.createElement(tagName);
        return this;
    }

    private _componentDidMount() {
        this.componentDidMount();
        Object.values(this.children)
            .forEach((child) => {
                if(child instanceof Block) child.dispatchComponentDidMount();
            });
    }

    componentDidMount() {
    }

    public dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: PropsWithChildrenType, newProps: PropsWithChildrenType) {
        if(this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
    }

    protected componentDidUpdate(oldProps: PropsWithChildrenType, newProps: PropsWithChildrenType) {
        return !isEqual(oldProps, newProps);
    }

    public setProps = (nextProps: PropsWithChildrenType) => {
        if(nextProps) {
            Object.assign(this.props, nextProps);
            this.eventBus().emit(Block.EVENTS.FLOW_CDU, this.props as unknown, nextProps as unknown);
        }
    }

    public get element() {
        return this._element;
    }

    private _render() {
        const fragment = this.compile(this.render(), this.props);

        const newElement = fragment.firstElementChild as HTMLElement;

        this._removeEvents()
        if(this._element) {
            this._element.replaceWith(newElement);
        }
        this._element = newElement;

        this._addEvents();
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    protected compile(template: ((context: any) => string) | string, context: any) {
        const contextAndDummies = { ...context }
        const _tmpId =  Math.floor(100000 + Math.random() * 900000);

        Object.entries(this.children).forEach(([name, component]) => {
            if(Array.isArray(component)) {
                contextAndDummies[name] = component.map((child) => `<div data-id="${child.id}"></div>`)
            } else {
                contextAndDummies[name] = `<div data-id="${component.id}"></div>`
            }
        })

        Object.entries(this.lists).forEach(([key]) => {
            contextAndDummies[key] = `<div data-id="_list_${_tmpId}"></div>`;
        });

        const html = Handlebars.compile(template)(contextAndDummies)

        const temp = document.createElement('template')
        temp.innerHTML = html

        const replaceDummy = (component: Block) => {
            const dummy = temp.content.querySelector(`[data-id="${component.id}"]`)
            if(!dummy) return
            component.getContent()?.append(...Array.from(dummy.childNodes))
            dummy.replaceWith(component.getContent()!)
        }

        /* eslint-disable  @typescript-eslint/no-unused-vars */
        Object.entries(this.children).forEach(([_, component]) => {
            if(Array.isArray(component)) {
                component.forEach((comp) => replaceDummy(comp))
            } else {
                replaceDummy(component as Block)
            }
        })

        Object.entries(this.lists).forEach(([, child]) => {
            const listCont = document.createElement('template');
            child.forEach(item => {
                if (item instanceof Block) {
                    listCont.content.append(item.getContent());
                } else {
                    listCont.content.append(`${item}`);
                }
            });
            const dummy = temp.content.querySelector(`[data-id="_list_${_tmpId}"]`);
            dummy.replaceWith(listCont.content);
        });

        return temp.content
    }

    protected render(): string {
        return '';
    }

    getContent() {
        return this.element;
    }

    _makePropsProxy(props: PropsWithChildrenType) {
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

    show() {
        this.getContent()!.style.display = 'block';
    }

    hide() {
        this.getContent()!.style.display = 'none';
    }

    static getStateToProps(state: State): Partial<State> | Record<string, unknown> {
        return state
    }

}

export default Block;
