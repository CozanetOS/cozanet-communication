# @cozanet/communication

CozanetOS inter-engine communication bus. Designed to coordinate asynchronous communication, priority routing, request-reply flows, and intent patterns across independent execution environments and modular engines using string identifiers.

## Architecture

The system is constructed with modular communication components using industry standard libraries under-the-hood:

1. **EventBus (`eventemitter3`):** Central lightweight synchronous event engine. Single point of dispatch and subscription.
2. **CommunicationBus:** Adds validation (`zod`), routing metadata, request-response handling with Correlation IDs, and logging (`pino`).
3. **MessageRouter:** Structured delivery of messages targeting explicit Engine IDs (`engine:<id>`).
4. **PriorityQueue (`p-queue`):** Task priority-based execution queue for handling processing workloads deterministically.
5. **IntentBus:** Lightweight declarative interface for executing state changes and cross-engine operations.

---

## Usage

### 1. Types & Message Schema
```typescript
import { Message, MessageSchema } from '@cozanet/communication';
```

### 2. Message Routing by Engine ID
```typescript
import { messageRouter } from '@cozanet/communication';

// Register communication handlers for dedicated engines
messageRouter.register('file-system-engine', (msg) => {
  console.log('File system received message:', msg.payload);
});

messageRouter.register('network-engine', (msg) => {
  console.log('Network engine received message:', msg.payload);
});
```

### 3. Request-Reply Pattern
```typescript
import { communicationBus } from '@cozanet/communication';

// Engine A sends a request and awaits a reply
async function fetchConfig() {
  try {
    const reply = await communicationBus.request({
      type: 'GET_CONFIG',
      source: 'ui-engine',
      target: 'config-engine',
      payload: { key: 'theme' }
    }, 5000); // 5s timeout
    console.log('Response received:', reply.payload);
  } catch (error) {
    console.error('Request timed out or failed:', error);
  }
}

// Engine B (Receiver) processes and responds
eventBus.on('msg:GET_CONFIG', (msg) => {
  communicationBus.respond(msg, { theme: 'dark' }, 'config-engine');
});
```

### 4. Intent Bus
Intents allow decoupled engines to broadcast general-purpose platform and state desires.
```typescript
import { intentBus } from '@cozanet/communication';

// Register for standard lock action
intentBus.onIntent('LOCK_SCREEN', (intent) => {
  console.log('Executing screen lock, intent ID:', intent.id);
});

// Broadcast state change request
intentBus.emitIntent('LOCK_SCREEN', { reason: 'user_idle' });
```

### 5. Task Priority Queues
```typescript
import { PriorityQueue } from '@cozanet/communication';

const downloadQueue = new PriorityQueue(2); // concurrency of 2

// High priority tasks are run first
downloadQueue.enqueue(async () => {
  await download('important_patch.bin');
}, 10); // Priority 10

downloadQueue.enqueue(async () => {
  await download('background_analytics.json');
}, 1); // Priority 1
```

---

## Installation & Build

```bash
npm install @cozanet/communication
npm run build
```
