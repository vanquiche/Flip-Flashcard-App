import {
  Pressable,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useContext } from 'react';
import { IconButton } from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import PaletteContext from '../contexts/PaletteProvider';

const AnimatedSwatch = Animated.createAnimatedComponent(Pressable);

interface Props {
  color: string;
}

const Swatch: React.FC<Props> = ({ color }) => {
  const { selection, setColor } = useContext(PaletteContext);

  const swatchSize = useSharedValue(1);
  const swatchAnimateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(swatchSize.value) }],
    };
  });

  useEffect(() => {
    selection === color ? (swatchSize.value = 1.2) : (swatchSize.value = 1);
  }, [selection]);

  return (
    <AnimatedSwatch
      style={[styles.swatch, { backgroundColor: color }, swatchAnimateStyle]}
      onPress={() => setColor(color)}
      onLongPress={(e) => e.preventDefault()}
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
};

const styles = StyleSheet.create({
  swatch: {
    height: 45,
    width: 45,
    borderRadius: 6,
    margin: 5,
  },
});
export default React.memo(Swatch);
