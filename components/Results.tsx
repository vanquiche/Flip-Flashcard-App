import { View, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo } from 'react';
import { Text, Title, Button } from 'react-native-paper';

import Animated, { SlideInRight } from 'react-native-reanimated';
import { RootState } from '../redux/store';

import { useSelector } from 'react-redux';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { CountUp } from 'use-count-up';
import { Set } from './types';
import swatchContext from '../contexts/swatchContext';

interface Props {
  set: Set;
  total: number;
  score: number;
  pointTotal: number;
  dismiss?: () => void;
}

const Results = ({ total, set, score, pointTotal, dismiss }: Props) => {
  const { user, cards } = useSelector((state: RootState) => state.store);
  const { theme } = useContext(swatchContext);

  // color variables
  const _fontColor = theme.fontColor;
  const _xpBarColor = theme.fontColor;
  const _cardColor = theme.cardColor;
  const _accentColor = theme.accentColor;

  const quizGrade = Math.floor((score / total) * 100);

  const category = useMemo(() => cards.category.find((c) => c._id === set.categoryRef), []);

  const setAlreadyCompleted = useMemo(() => user.completedQuiz.includes(set._id), [])

  const categoryPoints = category ? category.points : 0;

  const getXPpercent = useMemo(() => {
    const awardedPoints = (categoryPoints / pointTotal) * 100;
    if (categoryPoints > pointTotal) {
      const subtraction = categoryPoints.toString().split('').splice(1).join('');
      return Math.floor(parseInt(subtraction));
    } else return Math.floor(awardedPoints);
  }, [categoryPoints, pointTotal]);

  // start animation value
  const xpStart = Math.floor(getXPpercent - score);
  // end animation value
  const xpEnd = Math.floor(getXPpercent + score);

  const progressBarStart = useSharedValue(xpStart);
  const progressBarAnim = useAnimatedStyle(() => {
    return {
      width: withTiming(
        `${progressBarStart.value}%`,
        { duration: 700 },
        () => (progressBarStart.value = xpEnd)
      ),
    };
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: _cardColor }]}
      entering={SlideInRight.delay(500)}
    >
      <Title style={[{ textAlign: 'center', color: _fontColor }]}>
        RESULTS
      </Title>

      <View
        style={styles.metricContainer}
        accessible
        accessibilityLabel={`score: ${score} out of ${total}`}
      >
        <Title style={{ color: _fontColor }}>SCORE</Title>
        <Title
          style={{ color: _fontColor }}
          accessible
          accessibilityRole='text'
          accessibilityLabel={`${score} out of ${total}`}
        >
          {score}/{total}
        </Title>
      </View>

      <View
        style={styles.metricContainer}
        accessible
        accessibilityRole='text'
        accessibilityLabel={`grade: ${quizGrade} percent`}
      >
        <Title style={{ color: _fontColor }}>GRADE</Title>
        <Title style={{ color: _fontColor }}>{quizGrade}%</Title>
      </View>

      <View
        style={styles.progressBarContainer}
        accessible
        accessibilityRole='text'
        accessibilityLabel={`current level: ${Math.floor(categoryPoints / pointTotal)}`}
      >
        <Title style={{ color: _fontColor }}>
          {category?.name.toUpperCase()} LEVEL:
        </Title>
        <Title style={{ color: _fontColor }}>
          {Math.floor(categoryPoints / pointTotal)}
        </Title>
      </View>

      <View
        style={styles.progressBarContainer}
        accessible
        accessibilityRole='text'
        accessibilityLabel={`${pointTotal - xpEnd} xp to level up`}
      >
        <Title style={{ color: _fontColor }}>
          {category?.name.toUpperCase()} XP:
        </Title>
        <Title style={{ color: _fontColor }}>
          {setAlreadyCompleted ? (
            getXPpercent
          ) : (
            <CountUp start={xpStart} end={xpEnd} duration={2.4} isCounting />
          )}{' '}
          / {pointTotal}
        </Title>
      </View>

      {/* XP BAR */}

      <View style={[styles.progressBar, { borderColor: theme.fontColor }]}>
        {!setAlreadyCompleted ? (
          <Animated.View
            style={[
              styles.pointBar,
              {
                width: `${getXPpercent - score}%`,
                backgroundColor: _xpBarColor,
              },
              progressBarAnim,
            ]}
            accessibilityRole='progressbar'
            accessibilityValue={{ now: getXPpercent, min: 0, max: pointTotal }}
          />
        ) : (
          <View
            style={[
              styles.pointBar,
              {
                width: `${getXPpercent}%`,
                backgroundColor: _xpBarColor,
              },
            ]}
            accessibilityRole='progressbar'
            accessibilityValue={{ now: getXPpercent, min: 0, max: pointTotal }}
          />
        )}
      </View>
      <Text
        style={{ textAlign: 'center', color: _fontColor }}
        accessibilityRole='text'
      >
        {setAlreadyCompleted ? 'daily points maxed for this set' : ''}
      </Text>

      <Button
        mode='contained'
        color={_accentColor}
        style={styles.button}
        labelStyle={[{ fontSize: 16, color: _fontColor }]}
        onPress={dismiss}
        accessibilityRole='button'
        accessibilityHint='go back to flashcard screen'
      >
        return
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    // height: 400,
    backgroundColor: 'lightblue',
    padding: 30,
    paddingVertical: 25,
    borderRadius: 12,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
    elevation: 0,
    marginTop: 15,
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressBar: {
    width: '100%',
    height: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'brown',
    borderRadius: 10,
    marginVertical: 10,
  },
  pointBar: {
    height: 12,
    backgroundColor: 'lightblue',
    position: 'absolute',
    zIndex: 10,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default Results;
