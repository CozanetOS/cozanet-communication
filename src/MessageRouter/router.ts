import { Message } from '../types';

export class MessageRouter {
  private handlers: Map<string, (msg: Message) => Promise<any>> = new Map();

  public register(engineId: string, handler: (msg: Message) => Promise<any>): void {
    this.handlers.set(engineId, handler);
  }

  public async route(msg: Message): Promise<any> {
    const handler = this.handlers.get(msg.to);
    if (!handler) {
      throw new Error(`No message router handler registered for destination engine: ${msg.to}`);
    }
    return handler(msg);
  }
}
