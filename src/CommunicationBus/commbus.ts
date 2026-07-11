import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { eventBus } from '../EventBus/eventbus';
import { Message, MessageSchema } from '../types';

const logger = pino({ name: 'CommunicationBus' });

export class CommunicationBus {
  private static instance: CommunicationBus;

  private constructor() {
    // Listen to all incoming communication bus messages for diagnostics
    eventBus.onAny((event, ...args) => {
      if (typeof event === 'string' && event.startsWith('msg:')) {
        logger.trace({ event, payload: args[0] }, 'CommunicationBus Activity');
      }
    });
  }

  public static getInstance(): CommunicationBus {
    if (!CommunicationBus.instance) {
      CommunicationBus.instance = new CommunicationBus();
    }
    return CommunicationBus.instance;
  }

  /**
   * Validate message payload before processing
   */
  private validateMessage(message: Partial<Message>): Message {
    const fullMessage = {
      id: message.id || uuidv4(),
      timestamp: message.timestamp || Date.now(),
      payload: message.payload || {},
      ...message,
    };
    return MessageSchema.parse(fullMessage);
  }

  /**
   * Send a message to a specific channel/target
   */
  public send(msg: Partial<Message> & { type: string; source: string }): void {
    const validated = this.validateMessage(msg);
    logger.info({ msgId: validated.id, type: validated.type, target: validated.target }, 'Sending message');
    eventBus.emit(`msg:${validated.type}`, validated);
    if (validated.target) {
      eventBus.emit(`engine:${validated.target}`, validated);
    }
  }

  /**
   * Broadcast a message to all listeners
   */
  public broadcast(msg: Partial<Message> & { type: string; source: string }): void {
    const validated = this.validateMessage(msg);
    logger.info({ msgId: validated.id, type: validated.type }, 'Broadcasting message');
    eventBus.emit('msg:broadcast', validated);
    eventBus.emit(`msg:${validated.type}`, validated);
  }

  /**
   * Send request-reply message with matching correlationId
   */
  public request(
    msg: Partial<Message> & { type: string; source: string },
    timeout = 5000
  ): Promise<Message> {
    const validated = this.validateMessage(msg);
    if (!validated.correlationId) {
      validated.correlationId = uuidv4();
    }

    return new Promise<Message>((resolve, reject) => {
      const replyEvent = `reply:${validated.correlationId}`;
      
      const timer = setTimeout(() => {
        eventBus.off(replyEvent, handler);
        reject(new Error(`Request timed out after ${timeout}ms (Type: ${validated.type}, Correlation ID: ${validated.correlationId})`));
      }, timeout);

      const handler = (responseMsg: Message) => {
        clearTimeout(timer);
        eventBus.off(replyEvent, handler);
        resolve(responseMsg);
      };

      eventBus.on(replyEvent, handler);
      
      // Emit the request
      this.send(validated);
    });
  }

  /**
   * Handle requests by responding
   */
  public respond(originalMsg: Message, replyPayload: Record<string, any>, source: string): void {
    if (!originalMsg.correlationId) {
      throw new Error('Cannot respond to a message without a correlationId');
    }
    const replyMsg: Partial<Message> & { type: string; source: string } = {
      type: `${originalMsg.type}:reply`,
      source,
      target: originalMsg.source,
      correlationId: originalMsg.correlationId,
      payload: replyPayload,
    };
    const validated = this.validateMessage(replyMsg);
    eventBus.emit(`reply:${originalMsg.correlationId}`, validated);
  }
}

export const communicationBus = CommunicationBus.getInstance();
