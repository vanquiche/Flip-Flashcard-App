import { View, Text, StyleSheet } from 'react-native';
import { Title, IconButton, useTheme } from 'react-native-paper';
import React from 'react';
import Animated, {
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

interface Props {
  color?: string;
  title?: string;
  count?: number;
  onPress: () => void;
}
const QuizStartPage: React.FC<Props> = ({ color, title, count, onPress }) => {
  const { colors } = useTheme();
  return (
    <>
      <Animated.View
        style={[styles.cardStart, { backgroundColor: color }]}
        entering={SlideInRight.delay(300)}
        // exiting={SlideOutLeft}
      >
        <Title style={{ color: 'white', fontSize: 24, margin: 0 }}>
          {title?.toUpperCase()}
        </Title>
        <Title
          style={{
            color: 'white',
            fontSize: 24,
            position: 'absolute',
            right: 12,
            top: 10,
          }}
        >
          {count}
        </Title>
        <IconButton
          icon='play-circle-outline'
          // color={colors.secondary}
          color='white'
          size={42}
          style={{ margin: 0 }}
          onPress={onPress}
        />
      </Animated.View>
    </>
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
});

export default QuizStartPage;
