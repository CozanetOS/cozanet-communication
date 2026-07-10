import { Message } from '../types';

interface QueueItem {
  msg: Message;
  priority: number;
}

export class MessageQueue {
  private queue: QueueItem[] = [];

  public enqueue(msg: Message, priority: number = 0): void {
    this.queue.push({ msg, priority });
    // Sort in descending order of priority (higher priority number first)
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  public dequeue(): Message | null {
    const item = this.queue.shift();
    return item ? item.msg : null;
  }

  public size(): number {
    return this.queue.length;
  }

  public async process(handler: (msg: Message) => Promise<void>): Promise<void> {
    while (this.size() > 0) {
      const msg = this.dequeue();
      if (msg) {
        try {
          await handler(msg);
        } catch (err) {
          console.error(`Failed to process queue message ${msg.id}:`, err);
        }
      }
    }
  }
}
