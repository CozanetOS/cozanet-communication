import { Message, Subscription } from '../types';

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<(msg: Message) => void>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(engineId: string, eventType: string, handler: (msg: Message) => void): void {
    const key = `${engineId}:${eventType}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(handler);
  }

  public unsubscribe(engineId: string, eventType: string): void {
    const key = `${engineId}:${eventType}`;
    this.listeners.delete(key);
  }

  public publish(event: Message): void {
    const wildKey = `*:${event.type}`;
    const specificKey = `${event.to}:${event.type}`;
    const broadcastKey = `broadcast:${event.type}`;

    const targets = [wildKey, specificKey, broadcastKey];

    for (const key of targets) {
      const handlers = this.listeners.get(key);
      if (handlers) {
        for (const handler of handlers) {
          try {
            handler(event);
          } catch (err) {
            console.error(`Error invoking event listener for key ${key}:`, err);
          }
        }
      }
    }
  }

  public async publishAsync(event: Message): Promise<void> {
    const wildKey = `*:${event.type}`;
    const specificKey = `${event.to}:${event.type}`;
    const broadcastKey = `broadcast:${event.type}`;

    const targets = [wildKey, specificKey, broadcastKey];
    const promises: Promise<void>[] = [];

    for (const key of targets) {
      const handlers = this.listeners.get(key);
      if (handlers) {
        for (const handler of handlers) {
          promises.push(
            (async () => {
              try {
                await handler(event);
              } catch (err) {
                console.error(`Error invoking async event listener for key ${key}:`, err);
              }
            })()
          );
        }
      }
    }

    await Promise.all(promises);
  }

  /**
   * Helper to clear all listeners (useful for testing/resetting state).
   */
  public clear(): void {
    this.listeners.clear();
  }
}
