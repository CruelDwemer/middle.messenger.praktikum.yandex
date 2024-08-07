import { v4 } from 'uuid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';

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
import menu from "../svg/menu.hbs";
import attach from "../svg/attach.hbs";

const messageText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const messageTime = "10:46";

/*
*   Приходится регистрировать partials здесь
*   Так как в противном случае они будут недоступны для шаблонов страниц, использующихся в блоках
* */
Handlebars.registerPartial("chat", chat);
Handlebars.registerPartial("menu", menu);
Handlebars.registerPartial("message", message.bind(null, { text: messageText, time: messageTime }));
Handlebars.registerPartial("attach", attach);

type EventsEnum = {
    [key in Uppercase<string>]: Lowercase<string>;
};

type Events = Record<string, EventListenerOrEventListenerObject>;
export type Props = Record<string | symbol, unknown>;
export type Children = Record<string, Element | Block>;
type Parent = Element | Block | undefined;

abstract class Block {
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

    private _meta: { tagName: string, props?: Props } | null = null;

    protected readonly eventBus: () => EventBus;
    private _element: HTMLElement | null = null;

    protected constructor(propsWithChildren: Props | Children) {
        const eventBus: EventBus = new EventBus();

        const { props, children, parent } = Block.getChildrenAndProps(propsWithChildren);

        this.parent = parent;
        this.children = children;
        this.props = this._makePropsProxy(props);

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);

        eventBus.emit(Block.EVENTS.INIT);
    }

    static getChildrenAndProps(childrenAndProps: Props | Children)
        : { props: Props, children: Children, parent: Parent } {
        const props: Props = {};
        const children: Children = {};
        let parent: Parent;

        Object.entries(childrenAndProps)
            .forEach(([key, value]: [string, unknown]) => {
                if(value instanceof Block || value instanceof Element) {
                    if(key === 'parent') {
                        parent = value;
                    } else {
                        children[key] = value;
                    }
                } else {
                    props[key] = value;
                }
            });

        return { props, children, parent };
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
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    protected init() {
        const tagName = this._meta?.tagName;
        if(tagName) this._element = document.createElement(tagName);
        return this;
    }

    private _componentDidMount() {
        this.componentDidMount();
    }

    componentDidMount() {
    }

    public dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);

        Object.values(this.children)
            .forEach((child) => {
                if(child instanceof Block) child.dispatchComponentDidMount();
            });
    }

    private _componentDidUpdate(oldProps: Props, newProps: Props) {
        if(this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
    }

    protected componentDidUpdate(oldProps: Props, newProps: Props) {
        return oldProps !== newProps;
    }

    public setProps = (nextProps: Props) => {
        if(nextProps) {
            Object.assign(this.props, nextProps)
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

        Object.entries(this.children).forEach(([name, component]) => {
            if(Array.isArray(component)) {
                contextAndDummies[name] = component.map((child) => `<div data-id="${child.id}"></div>`)
            } else {
                contextAndDummies[name] = `<div data-id="${component.id}"></div>`
            }
        })
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

        return temp.content
    }

    protected render(): string {
        return '';
    }

    getContent() {
        return this.element;
    }

    _makePropsProxy(props: Props) {
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
}

export default Block;
