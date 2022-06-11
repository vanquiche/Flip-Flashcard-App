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
  // onPress: () => void;
}

const Swatch: React.FC<Props> = ({ color, onChange, selected }) => {
  const [checked, setChecked] = useState<boolean>(false);

  // const colorSelection = useCallback(() => {
  //   setColor(color);
  //   // console.log(color)
  // }, [setColor]);

  const handleChange = () => {
    onChange(color);
    // setChecked(true);
  };

  useEffect(() => {
    if (selected) {
      setChecked(true);
    }
    return () => {
      setChecked(false);
    };
  }, []);

  return (
    <AnimatedSwatch
      style={[styles.swatch, { backgroundColor: color }]}
      onPress={handleChange}
      // onBlur={() => setChecked(false)}
      onLongPress={(e) => e.preventDefault()}
      entering={FadeIn.delay(Math.random() * 300)}
    >
      {checked && (
        <IconButton
          icon='check'
          style={{ marginLeft: 5, marginTop: 3 }}
          color='white'
          onBlur={() => console.log('hello')}
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
