export class IntentBus {
  private handlers: Set<(intent: string, context: any) => void> = new Set();

  public emitIntent(intent: string, context: any): void {
    for (const handler of this.handlers) {
      try {
        handler(intent, context);
      } catch (err) {
        console.error(`Error in intent bus handler for intent ${intent}:`, err);
      }
    }
  }

  public onIntent(handler: (intent: string, context: any) => void): void {
    this.handlers.add(handler);
  }

  public offIntent(handler: (intent: string, context: any) => void): void {
    this.handlers.delete(handler);
  }
}
