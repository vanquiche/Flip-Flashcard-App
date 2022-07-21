import { View, Text, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import React from 'react';
import Animated, { SlideInRight } from 'react-native-reanimated';
import fontColorContrast from 'font-color-contrast'

interface Props {
  color: string;
  title: string;
  count: number;
  onPress: () => void;
}
const QuizStartPage = ({ color, title, count, onPress }: Props) => {
  const _fontColor = fontColorContrast(color, 0.7)
  return (
    <Animated.View
      style={[styles.cardStart, { backgroundColor: color }]}
      entering={SlideInRight.delay(300)}
      // exiting={SlideOutLeft}
    >
      <Title style={{...styles.title, color: _fontColor}}>{title.toUpperCase()}</Title>
      <Title style={{...styles.cardCount, color: _fontColor}}>{count}</Title>
      <IconButton
        icon='play-circle-outline'
        color={_fontColor}
        size={42}
        style={{ margin: 0 }}
        onPress={onPress}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardStart: {
    width: '85%',
    aspectRatio: 1 / 0.7,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 24,
    margin: 0,
  },
  cardCount: {
    color: 'white',
    fontSize: 24,
    position: 'absolute',
    right: 12,
    top: 10,
  },
});

export default QuizStartPage;
