import pino from 'pino';
import { Message } from '../types';
import { eventBus } from '../EventBus/eventbus';

const logger = pino({ name: 'MessageRouter' });

export type RouteHandler = (msg: Message) => void | Promise<void>;

export class MessageRouter {
  private static instance: MessageRouter;
  private handlers = new Map<string, RouteHandler[]>();
  private registeredEngines = new Set<string>();

  private constructor() {}

  public static getInstance(): MessageRouter {
    if (!MessageRouter.instance) {
      MessageRouter.instance = new MessageRouter();
    }
    return MessageRouter.instance;
  }

  /**
   * Register router/handler for specific engine ID
   */
  public register(engineId: string, handler: RouteHandler): void {
    if (!this.handlers.has(engineId)) {
      this.handlers.set(engineId, []);
      // Register subscription on global eventbus for engine target
      eventBus.on(`engine:${engineId}`, (msg: Message) => {
        this.route(engineId, msg);
      });
      this.registeredEngines.add(engineId);
      logger.info({ engineId }, 'Registered router for engine');
    }
    this.handlers.get(engineId)!.push(handler);
  }

  /**
   * Route a message internally to registered engine handlers
   */
  public async route(engineId: string, msg: Message): Promise<void> {
    const handlers = this.handlers.get(engineId) || [];
    if (handlers.length === 0) {
      logger.warn({ engineId, msgId: msg.id }, 'No registered handlers for engine route');
      return;
    }

    logger.debug({ engineId, msgId: msg.id }, 'Routing message to engine handlers');
    for (const handler of handlers) {
      try {
        await handler(msg);
      } catch (err) {
        logger.error({ err, engineId, msgId: msg.id }, 'Error running engine route handler');
      }
    }
  }

  public getRegisteredEngines(): string[] {
    return Array.from(this.registeredEngines);
  }
}

export const messageRouter = MessageRouter.getInstance();
