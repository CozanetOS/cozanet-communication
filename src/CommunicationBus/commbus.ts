import { Message } from '../types';
import { EventBus } from '../EventBus/eventbus';

export class CommunicationBus {
  private eventBus: EventBus;
  private myEngineId: string;

  constructor(engineId: string) {
    this.myEngineId = engineId;
    this.eventBus = EventBus.getInstance();
  }

  public send(msg: Message): void {
    this.eventBus.publish(msg);
  }

  public broadcast(msg: Omit<Message, 'to'>): void {
    const broadcastMessage: Message = {
      ...msg,
      to: 'broadcast'
    };
    this.eventBus.publish(broadcastMessage);
  }

  public request(msg: Message, timeoutMs: number = 5000): Promise<Message> {
    return new Promise((resolve, reject) => {
      const responseType = `${msg.type}:reply`;
      
      const timer = setTimeout(() => {
        this.eventBus.unsubscribe(this.myEngineId, responseType);
        reject(new Error(`Request timeout for message ${msg.id} after ${timeoutMs}ms`));
      }, timeoutMs);

      this.eventBus.subscribe(this.myEngineId, responseType, (replyMsg: Message) => {
        if (replyMsg.replyTo === msg.id) {
          clearTimeout(timer);
          this.eventBus.unsubscribe(this.myEngineId, responseType);
          resolve(replyMsg);
        }
      });

      this.send(msg);
    });
  }
}
