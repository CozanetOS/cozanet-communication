import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { eventBus } from '../EventBus/eventbus';
import { Intent, IntentSchema } from '../types';

const logger = pino({ name: 'IntentBus' });

export class IntentBus {
  private static instance: IntentBus;

  private constructor() {}

  public static getInstance(): IntentBus {
    if (!IntentBus.instance) {
      IntentBus.instance = new IntentBus();
    }
    return IntentBus.instance;
  }

  /**
   * Emit an Intent onto the bus with validation context
   */
  public emitIntent(intent: string, context: Record<string, any> = {}): Intent {
    const rawIntent = {
      id: uuidv4(),
      intent,
      context,
      timestamp: Date.now(),
    };
    const validated = IntentSchema.parse(rawIntent);
    logger.info({ intentId: validated.id, intent: validated.intent }, 'Emitting intent');
    eventBus.emit(`intent:${validated.intent}`, validated);
    eventBus.emit('intent:*', validated);
    return validated;
  }

  /**
   * Subscribe to specific or wildcard intents
   */
  public onIntent(intent: string, handler: (intent: Intent) => void | Promise<void>): () => void {
    const eventName = intent === '*' ? 'intent:*' : `intent:${intent}`;
    eventBus.on(eventName, handler);
    return () => {
      eventBus.off(eventName, handler);
    };
  }
}

export const intentBus = IntentBus.getInstance();
