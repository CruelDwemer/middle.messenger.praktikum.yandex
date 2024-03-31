/* eslint-disable no-param-reassign, no-underscore-dangle */

import { v4 } from 'uuid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';

type EventsEnum = {
    [key in Uppercase<string>]: Lowercase<string>;
};

type Events = Record<string, () => void>;
export type Props = Record<string | symbol, unknown>;
export type Children = Record<string, Element | Block>;
type Ref = Record<string | symbol, Element | Block>;
type Parent = Element | Block | undefined;

export type BlockType = {
    new(propsWithChildren: Props | Children): Block
};

abstract class Block {
    static EVENTS: EventsEnum = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    };

    public id: string = v4();

    // Свойства компонента. Будут переданы в шаблон во время ренденгинга
    protected props: Props;

    // Ссылки на элементы внутри поддерева
    protected refs: Ref = {};

    protected parent: Parent;

    // Храним для удаления
    public children: Children;

    private _meta: { tagName: string, props?: Props } | null = null;

    // События, которые будут автоматически подключены к указанным refs или this.element()
    // При передаче { event: callback } подключается к this.element()
    // При передаче { ref: {event: callback} } подключается к указанному ref
    protected readonly eventBus: () => EventBus;

    // Элемент в DOM в который отрендерим этот компонент
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
            .forEach(([key, value]) => {

                if (value instanceof Block || value instanceof Element) {
                    // console.log("value", value, key)
                    if (key === 'parent') {
                        parent = value;
                    } else {
                        children[key] = value;
                    }
                } else {
                    props[key] = value;
                }
            });

        // console.log({ props, children, parent })

        return { props, children, parent };
    }

    private _addEvents() {
        const { events = {} } = this.props as { events: Events };

        Object.keys(events)
            .forEach((eventName) => {
                // console.log("addEventListener", eventName, events[eventName])
                this._element?.addEventListener(eventName, events[eventName]);
            });
    }

    // Not used anywhere yet
    // @ts-expect-error because
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
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _init() {
        this.init();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    protected init() {
        const tagName = this._meta?.tagName;
        if (tagName) this._element = document.createElement(tagName);
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
                if (child instanceof Block) child.dispatchComponentDidMount();
            });
    }

    private _componentDidUpdate(oldProps: Props, newProps: Props) {
        if (this.componentDidUpdate(oldProps, newProps)) {
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

        if (this._element) {
            this._element.replaceWith(newElement);
        }

        this._element = newElement;

        this._addEvents();
    }

    // private _render(): void {
    //     const block = this.render();
    //     console.log(this._element)
    //     this._element.innerHTML = '';
    //
    //     if (typeof block === 'string') {
    //         this._element.insertAdjacentHTML('afterbegin', block);
    //     } else {
    //         this._element.append(block);
    //     }
    //     this._removeEvents();
    //     this._addEvents();
    //     // this._addAttribute();
    // }

    // private compile(template: string, context: Props) {
    //     const contextAndStubs = {
    //         ...context, __refs: this.refs, __parent: this, __children: [], __components: {},
    //     };
    //
    //     console.log("Block compile ", template, contextAndStubs, this)
    //
    //     const html = Handlebars.compile(template)(contextAndStubs);
    //     console.log(html)
    //
    //
    //     const temp = document.createElement('template');
    //
    //     temp.innerHTML = html;
    //
    //     contextAndStubs.__children?.forEach(({ embed }
    //                                              : { embed: (fragment: DocumentFragment)=>void }) => {
    //         embed(temp.content);
    //     });
    //
    //     this.children = contextAndStubs?.__components || {};
    //     return temp.content;
    // }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    protected compile(template: (context: any) => string, context: any) {
        // console.log(context)
        // 1. create an object with the props and children,
        // later will add dummy HTML elements for each to keep the tree
        const contextAndDummies = { ...context }
        // console.log(contextAndDummies)

        // 2. create a dummy with id for each passed Block and children
        Object.entries(this.children).forEach(([name, component]) => {
            if (Array.isArray(component)) {
                contextAndDummies[name] = component.map((child) => `<div data-id="${child.id}"></div>`)
            } else {
                contextAndDummies[name] = `<div data-id="${component.id}"></div>`
            }
        })
        // 3. generates html string with each Block element replaced with a dummy
        // console.log("compile", template, contextAndDummies)
        const html = Handlebars.compile(template)(contextAndDummies)

        // 4. create an Element with dummies
        const temp = document.createElement('template')
        temp.innerHTML = html

        /**
         * @description Replaces a dummy element with a real one, storing all childNodes in the component
         *
         * @param {Block} component (handlebars)
         * */
        const replaceDummy = (component: Block) => {
            // find a dummy with Block id
            const dummy = temp.content.querySelector(`[data-id="${component.id}"]`)
            if (!dummy) return
            // get the element and append all childNodes
            component.getContent()?.append(...Array.from(dummy.childNodes))
            // replace a dummy with the real element with all the events
            dummy.replaceWith(component.getContent()!)
        }

        // 5. replace all dummmies with the real elements
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        Object.entries(this.children).forEach(([_, component]) => {
            if (Array.isArray(component)) {
                component.forEach((comp) => replaceDummy(comp))
            } else {
                replaceDummy(component)
            }
        })

        return temp.content
    }

    protected render(): string {
        return '';
    }

    getContent() {
        // console.log(this.element)
        return this.element;
    }

    _makePropsProxy(props: Props) {
        // Ещё один способ передачи this, но он больше не применяется с приходом ES6+
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

                // Запускаем обновление компоненты. Плохой cloneDeep,
                // в следующей итерации нужно заставлять добавлять cloneDeep им самим
                self.eventBus()
                    .emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty() {
                throw new Error('Нет доступа');
            },
        });
    }

    /*
    private _createDocumentElement(tagName: string) {
        // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
        return document.createElement(tagName);
    }
     */

    show() {
        this.getContent()!.style.display = 'block';
    }

    hide() {
        this.getContent()!.style.display = 'none';
    }
}

export default Block;