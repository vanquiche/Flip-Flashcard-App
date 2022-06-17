import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useContext, useCallback, useState } from 'react';
import { IconButton, TextInput } from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  withTiming,
  useAnimatedRef,
} from 'react-native-reanimated';
import useSelectColor from '../hooks/useSelectColor';

const AnimatedSwatch = Animated.createAnimatedComponent(Pressable);

interface Props {
  color: string;
  onChange: (color: string) => void;
  selected?: string;
}

const Swatch: React.FC<Props> = ({ color, onChange, selected }) => {

  const swatchOpacity = useSharedValue(0);
  const rStyles = useAnimatedStyle(() => {
    return {
      opacity: swatchOpacity.value,
    };
  });

  const handlePress = () => {
    onChange(color);
    // swatchOpacity.value = 1
  };


  return (
    <AnimatedSwatch
      style={[styles.swatch, { backgroundColor: color }]}
      onPress={handlePress}
      onLongPress={(e) => e.preventDefault()}
      entering={FadeIn.delay(Math.random() * 300)}
    >
      <Animated.View style={[rStyles]}>
        <IconButton icon='check' color='white' style={styles.checkmark} />
      </Animated.View>
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
  checkmark: {
    marginLeft: 5,
    marginTop: 3,
  },
});
export default React.memo(Swatch);
