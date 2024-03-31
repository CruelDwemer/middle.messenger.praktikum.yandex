// export type Listeners = Record<string, ((...args: unknown[]) => void)[]>
//
// export default class EventBus {
//     private readonly listeners: Listeners = {}
//
//     constructor() {
//         this.listeners = {}
//     }
//
//     on<T>(event: string, callback: T): void {
//         if(!this.listeners[event]) {
//             this.listeners[event] = []
//         }
//         this.listeners[event].push(callback)
//     }
//
//     off<T>(event: string, callback: T): void {
//         this.listeners[event] = this.listeners[event].filter(listener => listener !== callback)
//     }
//
//     emit(event: string, ...args: unknown[]): void {
//         this.listeners[event].forEach(listener => { listener(...args) })
//     }
// }

// type Handler<A extends any[] = unknown[]> = (...args: A) => void
// type MapInterface<P> = P[keyof P]
//
// export default class EventBus<
//     E extends Record<string, string> = Record<string, string>,
//     Args extends Record<MapInterface<E>, any[]> = Record<string, any[]>,
//     > {
//     private readonly listeners: {
//         [K in MapInterface<E>]?: Handler<Args[K]>[]
//     } | {} = {}
//
//     on<Event extends MapInterface<E>>(event: Event, callback: Handler<Args[Event]>) {
//         if(!this.listeners[event]) {
//             this.listeners[event] = [] as Handler<Args[Event]>[]
//         }
//         this.listeners[event]?.push(callback)
//     }
//
//     off<Event extends MapInterface<E>>(event: Event, callback: Handler<Args[Event]>) {
//         if (!this.listeners[event]) throw new Error(`${event} doesn't exist`)
//         this.listeners[event] = this.listeners[event]!.filter((l) => l !== callback)
//     }
//
//     emit<Event extends MapInterface<E>>(event: Event, ...args: Args[Event]) {
//         if (!this.listeners[event]) return
//         this.listeners[event]!.forEach((l) => l(...args))
//     }
// }

export default class EventBus {
    listeners: Record<string, Function[]>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: (...args: unknown[]) => void): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = this.listeners[event].filter(
            (listener: any) => listener !== callback,
        );
    }

    emit(event: string, ...args: unknown[]) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event].forEach((listener: Function): void => {
            listener(...args);
        });
    }
}
