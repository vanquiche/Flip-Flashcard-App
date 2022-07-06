import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Animated, { StretchInY, StretchOutY } from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

interface Props {
  children: any;
  color?: string;
}

const QuizContainer = ({ children, color }: Props) => {
  return (
    <Animated.View
      entering={StretchInY}
      exiting={StretchOutY}
      style={[styles.container, { backgroundColor: color }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    width: '100%',
    height: SCREEN_HEIGHT,
    paddingVertical: 10,
    paddingHorizontal: 25,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default QuizContainer;
