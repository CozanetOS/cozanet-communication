# @cozanet/communication

Robust inter-engine communication backbone for CozanetOS. This package provides the type-safe foundations, Event Bus, Communication Bus, Message Router, Message Queue, and Intent Bus that allow decoupled engines to safely and asynchronously coordinate, route messages, and execute request-response patterns.

## Features

- **Types**: Strongly-typed `Message` and `Subscription` models.
- **EventBus**: High-throughput in-memory pub/sub with async publication capability.
- **CommunicationBus**: Extends public bus behavior, enabling point-to-point targeting, broadcasting, and request/reply correlation (with timeouts).
- **MessageRouter**: Targeted routing patterns for direct engine RPC.
- **MessageQueue**: Priority-based FIFO queuing mechanism with automated batch processing.
- **IntentBus**: Simplified, high-level user intent routing framework.
