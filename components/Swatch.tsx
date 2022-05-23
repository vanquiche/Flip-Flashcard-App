import { Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { IconButton } from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  withTiming,
} from 'react-native-reanimated';

const AnimatedSwatch = Animated.createAnimatedComponent(Pressable);

interface Props {
  color: string;
  selection: string;
  setColor: (color: string) => void;
}

const Swatch: React.FC<Props> = React.memo(
  ({ color, selection, setColor }) => {
    // const { selection, setColor } = useContext(PaletteContext);

    // console.log('swatch rendered');
    const isSelected = selection === color;

    const swatchSize = useSharedValue(1);
    const swatchOpacity = useSharedValue(0);
    const swatchAnimateStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(swatchSize.value) }],
      };
    });

    useEffect(() => {
      isSelected ? (swatchSize.value = 1.2) : (swatchSize.value = 1);
    }, []);

    return (
      <AnimatedSwatch
        style={[styles.swatch, { backgroundColor: color }, swatchAnimateStyle]}
        onPress={() => setColor(color)}
        onLongPress={(e) => e.preventDefault()}
        // entering={FadeIn.delay(Math.random() * 100)}
      >
        {selection === color && (
          <IconButton
            icon='check'
            style={{ marginLeft: 5, marginTop: 3 }}
            color='white'
          />
        )}
      </AnimatedSwatch>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.color === nextProps.color)
    return true;
    return false;
  }
);

const styles = StyleSheet.create({
  swatch: {
    height: 45,
    width: 45,
    borderRadius: 6,
    margin: 5,
  },
});
export default Swatch;
