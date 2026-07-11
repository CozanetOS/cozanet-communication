import PQueue from 'p-queue';
import pino from 'pino';

const logger = pino({ name: 'PriorityQueue' });

export class PriorityQueue {
  private queue: PQueue;

  constructor(concurrency = 1) {
    this.queue = new PQueue({ concurrency });
    
    this.queue.on('active', () => {
      logger.debug({ size: this.queue.size, pending: this.queue.pending }, 'Queue task active');
    });

    this.queue.on('idle', () => {
      logger.debug('Queue is now idle');
    });
  }

  /**
   * Enqueue an async task with optional priority (higher value processed first)
   */
  public async enqueue<T>(task: () => Promise<T> | T, priority = 0): Promise<T> {
    return this.queue.add(task, { priority });
  }

  public pause(): void {
    logger.info('Queue execution paused');
    this.queue.pause();
  }

  public resume(): void {
    logger.info('Queue execution resumed');
    this.queue.start();
  }

  public isPaused(): boolean {
    return this.queue.isPaused;
  }

  public size(): number {
    return this.queue.size;
  }

  public pending(): number {
    return this.queue.pending;
  }

  public clear(): void {
    logger.warn('Clearing priority queue tasks');
    this.queue.clear();
  }
}
