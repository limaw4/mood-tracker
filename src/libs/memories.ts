import { ImageSourcePropType } from 'react-native';

export type Memory = {
  id: string;
  type: 'photo' | 'letter';
  date: string; // ISO date, e.g. 2026-10-11
  title: string;
  body: string;
  emoji: string; // placeholder shown until a real image is attached
  image?: ImageSourcePropType; // e.g. require('@/assets/images/sunday.jpg') or { uri }
  place?: string;
  addedBy?: string;
  from?: string; // letters only
  favorite?: boolean;
};

export const MEMORIES: Memory[] = [
  {
    id: 'm1',
    type: 'photo',
    date: '2026-10-11',
    title: 'Our very slow Sunday',
    body: 'No plans, slightly cold coffee, and you. Would do it all again. — Maya',
    emoji: '🥐',
    place: 'Riverside Park',
    addedBy: 'Maya',
  },
  {
    id: 'm2',
    type: 'letter',
    date: '2026-10-03',
    title: 'For your hard days',
    body: '“You make the world feel softer...”',
    emoji: '💌',
    from: 'Jamie',
  },
  {
    id: 'm3',
    type: 'photo',
    date: '2026-09-26',
    title: 'The scenic route',
    body: 'Our first weekend away ♡',
    emoji: '🌄',
    addedBy: 'Jamie',
  },
  {
    id: 'm4',
    type: 'letter',
    date: '2026-09-12',
    title: 'When you can’t sleep',
    body: '“Close your eyes. I’m right here.”',
    emoji: '💌',
    from: 'Jamie',
  },
];