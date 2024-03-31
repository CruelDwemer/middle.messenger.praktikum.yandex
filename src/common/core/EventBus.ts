export type Listeners = Record<string, ((...args: unknown[]) => void)[]>

export default class EventBus {
    private readonly listeners: Listeners = {}

    constructor() {
        this.listeners = {}
    }

    on<T>(event: string, callback: T): void {
        if(!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
    }

    off<T>(event: string, callback: T): void {
        this.listeners[event] = this.listeners[event].filter(listener => listener !== callback)
    }

    emit(event: string, ...args: unknown[]): void {
        this.listeners[event].forEach(listener => { listener(...args) })
    }
}

