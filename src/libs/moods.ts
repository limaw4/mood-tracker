import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodId =
  | 'happy' | 'sad' | 'angry' | 'anxious' | 'tired'
  | 'calm' | 'loved' | 'lonely' | 'overwhelmed' | 'excited';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export const MOODS: { id: MoodId; label: string; emoji: string; tip: string }[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', tip: 'Let’s hold on to this one.' },
  { id: 'sad', label: 'Sad', emoji: '😢', tip: 'Be gentle with yourself today.' },
  { id: 'angry', label: 'Angry', emoji: '😠', tip: 'Your feelings are valid.' },
  { id: 'anxious', label: 'Anxious', emoji: '😟', tip: 'It’s okay to take this slowly.' },
  { id: 'tired', label: 'Tired', emoji: '😴', tip: 'Rest counts as care, too.' },
  { id: 'calm', label: 'Calm', emoji: '😌', tip: 'Nice. Soak it in.' },
  { id: 'loved', label: 'Loved', emoji: '🥰', tip: 'You deserve every bit of it.' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺', tip: 'You’re not alone in this.' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵‍💫', tip: 'One small thing at a time.' },
  { id: 'excited', label: 'Excited', emoji: '🤩', tip: 'Let that spark shine.' },
];

export type MoodEntry = {
  id: string;
  mood: MoodId;
  intensity: number; // 1-10
  timeOfDay: TimeOfDay;
  note: string; // always private
  triggers: string[]; // always private
  shareWithPartner: boolean; // shares ONLY mood + intensity
  createdAt: string; // ISO
};

const KEY = 'mood-entries-v1';

export async function loadMoodEntries(): Promise<MoodEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MoodEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdAt'>) {
  const all = await loadMoodEntries();
  const full: MoodEntry = { ...entry, id: String(Date.now()), createdAt: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify([...all, full]));
  return full;
}