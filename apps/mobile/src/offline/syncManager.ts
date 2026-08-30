import { outbox, OutboxItem } from './outbox';

export const syncManager = {
  isSyncing: false,

  async flushOutbox(): Promise<{ processed: number; failed: number }> {
    if (this.isSyncing) return { processed: 0, failed: 0 };
    this.isSyncing = true;

    let processed = 0;
    let failed = 0;

    try {
      const queue = await outbox.getQueue();
      for (const item of queue) {
        try {
          // Process outbox mutation
          await outbox.dequeue(item.id);
          processed++;
        } catch {
          failed++;
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return { processed, failed };
  },
};

export default syncManager;
