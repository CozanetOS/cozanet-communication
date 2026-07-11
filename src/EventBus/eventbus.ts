import EventEmitter from 'eventemitter3';
import pino from 'pino';

const logger = pino({ name: 'EventBus' });

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(event: string | symbol, fn: (...args: any[]) => void, context?: any): this {
    this.emitter.on(event, fn, context);
    return this;
  }

  public off(event: string | symbol, fn?: (...args: any[]) => void, context?: any, once?: boolean): this {
    this.emitter.off(event, fn, context, once);
    return this;
  }

  public emit(event: string | symbol, ...args: any[]): boolean {
    logger.debug({ event }, 'Emitting event');
    return this.emitter.emit(event, ...args);
  }

  public onAny(fn: (event: string | symbol, ...args: any[]) => void): this {
    // EventEmitter3 does not have onAny built-in. We hook into emit to support it.
    const originalEmit = this.emitter.emit.bind(this.emitter);
    this.emitter.emit = (event: string | symbol, ...args: any[]) => {
      try {
        fn(event, ...args);
      } catch (err) {
        logger.error({ err }, 'Error in onAny listener');
      }
      return originalEmit(event, ...args);
    };
    return this;
  }
}

export const eventBus = EventBus.getInstance();
