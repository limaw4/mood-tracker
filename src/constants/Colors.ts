export const DEFAULT = {
  brand: '#B34F78',
  background: '#FFF6F2',
  backgroundCard: '#FFFFFF',
  textPrimary: '#463442',
  textSecondary: '#8A7A85',
  accent: '#E8A87C',
  outline: '#F1E3DE',
  blush: '#FBE4E8',
  lavender: '#EDE6F7',
  lavenderText: '#7B4FA3',
  peach: '#FCE7D8',
  peachText: '#B5683A',
} as const;

export type AppColor = typeof DEFAULT[keyof typeof DEFAULT];