import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Animated, {
  StretchInY,
  StretchOutX,
  StretchOutY,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

interface Props {
  children: any;
}

const QuizContainer: React.FC<Props> = ({ children }) => {
  return (
    <Animated.View
      entering={StretchInY}
      exiting={StretchOutY}
      style={styles.container}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: SCREEN_HEIGHT,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 25,
    zIndex: 100,
    justifyContent: 'center'
  },
});

export default QuizContainer;
