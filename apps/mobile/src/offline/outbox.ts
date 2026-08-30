import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OutboxItem {
  id: string;
  type: 'planner_task_toggle' | 'planner_task_create' | 'coding_progress_patch';
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
}

const OUTBOX_KEY = 'ss_offline_outbox_queue';

export const outbox = {
  async getQueue(): Promise<OutboxItem[]> {
    try {
      const raw = await AsyncStorage.getItem(OUTBOX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async enqueue(type: OutboxItem['type'], payload: Record<string, any>): Promise<OutboxItem> {
    const item: OutboxItem = {
      id: `outbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const current = await this.getQueue();
    current.push(item);
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(current));
    return item;
  },

  async dequeue(id: string): Promise<void> {
    const current = await this.getQueue();
    const filtered = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(filtered));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(OUTBOX_KEY);
  },
};

export default outbox;
