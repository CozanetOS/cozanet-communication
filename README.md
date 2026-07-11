# cozanet-communication

[![CozanetOS Communication](https://img.shields.io/badge/CozanetOS-Communication-blue.svg)]()
[![AI-Native OS](https://img.shields.io/badge/Architecture-AI--Native%20OS-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)]()

`cozanet-communication` serves as the high-speed, distributed communication backbone—the **central nervous system**—of **CozanetOS**. Every event, model dispatch, intent routing message, and inter-agent synchronization payload passes through this unified communication bus. Combining ultra-low latency event loops, structured message routing tables, built-in rate-limiting, and cryptographic signing, this module links independent agent cores and services into a unified, lightning-fast operating ecosystem.

---

## 🚀 Key Capabilities

*   **CommunicationBus:** The foundational bus layer bridging local process execution threads, containerized microservices, and remote API gateways.
*   **EventBus:** High-performance Publish/Subscribe system broker for system-wide lifecycle states and agent state changes.
*   **LearningBus:** Specialized channel broadcasting learning updates, user habits, and fine-tuning prompts to all learning sub-systems.
*   **IntentBus:** Routes semantic user intentions directly to the CEO and Planner agents.
*   **MessageRouter:** Delivers complex dynamic routing rules allowing point-to-point addressing using target Engine IDs or Agent Roles.
*   **Queue Management:** Features robust message queue mechanics: memory buffering, message priority rankings, backpressure control, and Dead-Letter Queue (DLQ) support.
*   **System Broadcasts:** Instant system-wide announcements to all listening modules and background routines.
*   **Zero-Copy Message Passing:** Optimized byte-level transfers and memory sharing architectures designed for maximum local execution speeds.
*   **Async/Sync Modes:** Native Unterstützung for both non-blocking async loops (event-driven) and blocked synchronous request-reply cycles.
*   **Message Cryptographic Signing:** Signs and validates system-wide envelopes using public/private key-pairs to enforce structural trust.
*   **Replay & Audit Logs:** Persistent message archiving providing safe transaction auditing and diagnostic replays.

---

## 📝 Standardized Message Envelope Format

All messages transmitted across CozanetOS adhere to the strict `CozanetEnvelope` JSON schema:

```json
{
  "id": "msg_9011_f98c8c",
  "source": "engine:cozanet-core:ceo",
  "destination": "agent:cozanet-agents:security-ops-1",
  "type": "INTENT_DELEGATION",
  "payload": {
    "action": "scan_repository",
    "target": "/app/src/payment_gateway"
  },
  "timestamp": 1775836800,
  "signature": "3045022100e47fcaecf48b...",
  "priority": 10
}
```

---

## 🏛️ Architecture & Bus Layout

```
                  +--------------------------------------+
                  |           CozanetOS Bus              |
                  |     (cozanet-communication)          |
                  +--+---------+---------+---------+-----+
                     |         |         |         |
      +--------------+         |         |         +--------------+
      v                        v         v                        v
+------------+   +------------+   +------------+   +------------+
|  EventBus  |   |  IntentBus |   | LearningBus|   |   Queue    |
| (Pub/Sub)  |   | (CEO Route)|   | (Feedback) |   | (Buffers)  |
+------------+   +------------+   +------------+   +------------+
```

---

## 🔌 API & Interface Overview

### 1. Programmatic Event Publication (Python)

```python
from cozanet_communication import EventBus, CozanetEnvelope

# Establish connection to global system EventBus
bus = EventBus.connect()

# Create signed message payload
envelope = CozanetEnvelope(
    source="engine:cozanet-core:lifecycle",
    destination="agent:cozanet-agents:*",
    type="SYSTEM_SHUTDOWN_WARNING",
    payload={"grace_period_seconds": 30}
)

# Publish system-wide message
bus.publish(topic="system.lifecycle", message=envelope)
print("Shutdown warning published across event network.")
```

### 2. Queue Subscription and Message Handling
```python
from cozanet_communication import QueueManager

def handle_incoming_jobs(message):
    print(f"Received Job: {message.payload}")
    # Execute actual agent task routing...

qm = QueueManager.connect()
qm.subscribe(queue_name="agent_jobs", callback=handle_incoming_jobs)
```

---

## 🔗 Integration with Other CozanetOS Modules

`cozanet-communication` is the backbone connecting absolutely every module in CozanetOS:
*   **`cozanet-core` & `cozanet-agents`:** Rely entirely on the Event and Intent buses to schedule actions and exchange results.
*   **`cozanet-memory` & `cozanet-database`:** Listen to transaction streams to back up records and synchronize vector embeddings in near real-time.

---

## ⚡ Quick-Start Notes

### Launch Message Bus Broker
Ensure the system queue daemon is running:
```bash
cozanet-communication start-broker --port 8089
```

### Monitor Bus Traffic in Real-Time
```bash
cozanet-communication monitor --topic "system.*"
```
