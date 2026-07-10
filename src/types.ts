export interface Message {
  id: string;
  from: string;
  to: string | 'broadcast';
  type: string;
  payload: any;
  timestamp: number;
  replyTo?: string;
}

export interface Subscription {
  engineId: string;
  eventType: string;
  handler: (msg: Message) => void;
}
