import AsyncStorage from '@react-native-async-storage/async-storage';

export type ReachOutKind = 'hug' | 'thinking' | 'note' | 'miss';

export const REACH_OUTS: { id: ReachOutKind; emoji: string; label: string }[] = [
  { id: 'hug', emoji: '🤗', label: 'Virtual hug' },
  { id: 'thinking', emoji: '💭', label: 'Thinking of you' },
  { id: 'note', emoji: '💌', label: 'Love note' },
  { id: 'miss', emoji: '🥺', label: 'I miss you' },
];

export const DATE_IDEAS = [
  'Cook a new recipe together, no phones.',
  'Blanket fort, snacks, and a movie neither of you has seen.',
  'Take a long walk and pick a new route.',
  'Breakfast for dinner, with candles.',
  'Make a playlist for each other. Swap and listen together.',
  'Visit a bookshop. Pick a book for each other.',
  'Stargazing with hot chocolate.',
  'Plan an imaginary trip: where, what to eat, what to pack.',
  'A mini picnic in the nearest park.',
  'Slow dance in the living room to one song.',
  'Try a dessert place neither of you has been to.',
  'Write each other a postcard and swap them over dinner.',
];

export type Sent = { id: string; kind: ReachOutKind; createdAt: string };
export type Gratitude = { id: string; text: string; by: string; createdAt: string };

const SENT_KEY = 'reach-outs-v1';
const GRAT_KEY = 'gratitude-jar-v1';

async function read<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export const loadSent = () => read<Sent>(SENT_KEY);
export const loadGratitude = () => read<Gratitude>(GRAT_KEY);

export async function sendReachOut(kind: ReachOutKind) {
  const all = await loadSent();
  const item: Sent = { id: String(Date.now()), kind, createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(SENT_KEY, JSON.stringify([...all, item]));
  return item;
}

export async function addGratitude(text: string, by: string) {
  const all = await loadGratitude();
  const item: Gratitude = { id: String(Date.now()), text, by, createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(GRAT_KEY, JSON.stringify([...all, item]));
  return item;
}