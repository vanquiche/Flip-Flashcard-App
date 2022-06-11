import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useContext, useCallback, useState } from 'react';
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
  onChange: (color: string) => void;
  selected: boolean;
}

const Swatch: React.FC<Props> = ({ color, onChange, selected }) => {

  return (
    <AnimatedSwatch
      style={[styles.swatch, { backgroundColor: color }]}
      onPress={() => onChange(color)}
      onLongPress={(e) => e.preventDefault()}
      // entering={FadeIn.delay(Math.random() * 300)}
    >
      {selected && (
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
    borderRadius: 10,
    margin: 5,
  },
});
export default React.memo(Swatch, (prev, next) => prev.selected === next.selected);
