export type Listeners = Record<string, ((...args: unknown[]) => void)[]>;

export default class EventBus {
  private readonly listeners: Listeners = {};

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
    this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners[event].forEach(listener => { listener(...args); });
  }
}

