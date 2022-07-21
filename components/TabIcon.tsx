import { IconButton } from 'react-native-paper';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  icon: string;
  color?: string;
  focused?: boolean;
}

const TabIcon = ({ icon, color, focused }: Props) => {
  // const flip = useSharedValue(focused ? -8 : 0);

  // const flipAnimate = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: withSpring(flip.value) }],
  //   };
  // }, [focused]);

  return (

      <IconButton
        icon={icon}
        size={27}
        color={color}
        style={{ marginTop: 5 }}
      />

  );
};

export default TabIcon;
