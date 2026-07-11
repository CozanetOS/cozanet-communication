import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  source: z.string(),
  target: z.string().optional(),
  payload: z.record(z.any()),
  timestamp: z.number(),
  correlationId: z.string().uuid().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export type SubscriptionHandler = (message: Message) => void | Promise<void>;

export interface ISubscription {
  event: string;
  handler: SubscriptionHandler;
  unsubscribe: () => void;
}

export const IntentSchema = z.object({
  id: z.string().uuid(),
  intent: z.string(),
  context: z.record(z.any()),
  timestamp: z.number(),
});

export type Intent = z.infer<typeof IntentSchema>;
