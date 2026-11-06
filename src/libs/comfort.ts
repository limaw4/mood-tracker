import { COUPLE } from './couple';
import { MoodId } from './moods';

export type Activity = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  kind: 'breathe' | 'prompt';
  text?: string;
};

const A: Record<string, Activity> = {
  breathe: { id: 'breathe', emoji: '🌬️', title: 'Breathe with me', sub: 'A calm minute, in and out', kind: 'breathe' },
  ground: {
    id: 'ground', emoji: '🌿', title: 'Ground yourself', sub: '5-4-3-2-1 senses', kind: 'prompt',
    text: 'Look around you. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Go slowly. You’re safe here.',
  },
  quiet: {
    id: 'quiet', emoji: '🕯️', title: 'Quiet time', sub: 'Ten minutes, just for you', kind: 'prompt',
    text: `Put your phone face down, sit somewhere comfy, and let your shoulders drop. ${COUPLE.partner} will be here when you’re ready.`,
  },
  rest: {
    id: 'rest', emoji: '🛏️', title: 'Rest reminder', sub: 'Rest counts as care', kind: 'prompt',
    text: 'Lie down, dim the lights, and close your eyes for a few minutes. You don’t have to earn it.',
  },
  music: {
    id: 'music', emoji: '🎧', title: 'Something soft', sub: 'Let one song play', kind: 'prompt',
    text: 'Put on something slow and gentle. Let one whole song play without doing anything else.',
  },
  letters: {
    id: 'letters', emoji: '💌', title: 'Open a letter', sub: `From ${COUPLE.partner}`, kind: 'prompt',
    text: `${COUPLE.partner} left you letters in Memories. Open one whenever you’re ready.`,
  },
  hug: {
    id: 'hug', emoji: '🤗', title: 'Ask for a hug', sub: 'No words needed', kind: 'prompt',
    text: `Sometimes you don’t need words. Tap “Virtual hug” above and ${COUPLE.partner} will know.`,
  },
  company: {
    id: 'company', emoji: '🫶', title: 'Sit together', sub: 'You’re not alone', kind: 'prompt',
    text: `${COUPLE.partner} is thinking of you. Send a quick “Thinking of you” above, then just sit together for a bit.`,
  },
  tasks: {
    id: 'tasks', emoji: '🧺', title: 'One tiny thing', sub: 'Just one, that’s enough', kind: 'prompt',
    text: 'Drink some water, then pick one 5-minute task. That’s enough for now. The rest can wait.',
  },
  gratitude: {
    id: 'gratitude', emoji: '🌸', title: 'Three good things', sub: 'Small things count', kind: 'prompt',
    text: 'Think of three small things that went okay today. Add one to your Gratitude jar below.',
  },
  affirm: {
    id: 'affirm', emoji: '✨', title: 'An affirmation', sub: 'Say it slowly', kind: 'prompt',
    text: '“I am doing my best, and my best is enough.” Say it slowly, twice.',
  },
  celebrate: {
    id: 'celebrate', emoji: '🎉', title: 'Celebrate it', sub: 'Share the good news', kind: 'prompt',
    text: `Tell ${COUPLE.partner} what’s making you happy! Send a note above, then plan something fun below.`,
  },
  date: {
    id: 'date', emoji: '🍰', title: 'Plan a date', sub: 'Try the idea generator', kind: 'prompt',
    text: 'Scroll down to “Do something together” and tap Surprise us for a date idea.',
  },
};

export const COMFORT: Record<MoodId, Activity[]> = {
  sad: [A.letters, A.hug, A.affirm],
  anxious: [A.breathe, A.ground],
  angry: [A.quiet, A.breathe],
  tired: [A.rest, A.music],
  lonely: [A.company, A.letters],
  happy: [A.celebrate, A.date],
  overwhelmed: [A.tasks, A.breathe],
  calm: [A.gratitude, A.affirm],
  loved: [A.gratitude, A.celebrate],
  excited: [A.celebrate, A.date],
};

export const DEFAULT_ACTIVITIES: Activity[] = [A.breathe, A.gratitude];