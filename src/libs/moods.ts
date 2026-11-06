import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSourcePropType } from 'react-native';

export type MoodId =
  | 'happy' | 'sad' | 'angry' | 'anxious' | 'tired'
  | 'calm' | 'loved' | 'lonely' | 'overwhelmed' | 'excited';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

const moodImages: Record<MoodId, ImageSourcePropType> = {
  happy: require('@/assets/images/icons/Happy.png'),
  sad: require('@/assets/images/icons/Sad.png'),
  angry: require('@/assets/images/icons/Angry.png'),
  anxious: require('@/assets/images/icons/Anxious.png'),
  tired: require('@/assets/images/icons/Tired.png'),
  calm: require('@/assets/images/icons/Calm.png'),
  loved: require('@/assets/images/icons/Loved.png'),
  lonely: require('@/assets/images/icons/Lonely.png'),
  overwhelmed: require('@/assets/images/icons/Overwhelmed.png'),
  excited: require('@/assets/images/icons/Excited.png'),
};

export const MOODS: { id: MoodId; label: string; image: ImageSourcePropType; tip: string }[] = [
  { id: 'happy', label: 'Happy', image: moodImages.happy, tip: 'Let\'s hold on to this one.' },
  { id: 'sad', label: 'Sad', image: moodImages.sad, tip: 'Be gentle with yourself today.' },
  { id: 'angry', label: 'Angry', image: moodImages.angry, tip: 'Your feelings are valid.' },
  { id: 'anxious', label: 'Anxious', image: moodImages.anxious, tip: 'It\'s okay to take this slowly.' },
  { id: 'tired', label: 'Tired', image: moodImages.tired, tip: 'Rest counts as care, too.' },
  { id: 'calm', label: 'Calm', image: moodImages.calm, tip: 'Nice. Soak it in.' },
  { id: 'loved', label: 'Loved', image: moodImages.loved, tip: 'You deserve every bit of it.' },
  { id: 'lonely', label: 'Lonely', image: moodImages.lonely, tip: 'You\'re not alone in this.' },
  { id: 'overwhelmed', label: 'Overwhelmed', image: moodImages.overwhelmed, tip: 'One small thing at a time.' },
  { id: 'excited', label: 'Excited', image: moodImages.excited, tip: 'Let that spark shine.' },
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
