import { ImageSourcePropType } from 'react-native';

export const periodImages: Record<'morning' | 'afternoon' | 'evening', ImageSourcePropType> = {
  morning: require('@/assets/images/icons/Morning.png'),
  afternoon: require('@/assets/images/icons/Afternoon.png'),
  evening: require('@/assets/images/icons/Evening.png'),
};
