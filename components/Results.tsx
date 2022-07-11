import { View, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { Text, Title, Button } from 'react-native-paper';

import Animated, { SlideInRight, withDelay } from 'react-native-reanimated';
import { RootState } from '../redux/store';

import { useSelector } from 'react-redux';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { CountUp } from 'use-count-up';
import { Set } from './types';

interface Props {
  set: Set;
  total: number;
  score: number;
  pointTotal: number;
  dismiss?: () => void;
}

const Results = ({ total, set, score, pointTotal, dismiss }: Props) => {
  const { user, cards } = useSelector((state: RootState) => state.store);

  // color variables
  const _fontColor = user.theme.fontColor;
  const _xpBarColor = user.theme.fontColor;
  const _cardColor = user.theme.cardColor;
  const _accentColor = user.theme.accentColor;

  const quizGrade = Math.floor((score / total) * 100);

  const category = useMemo(
    () => cards.category.find((c) => c._id === set.categoryRef),
    [cards.category]
  );

  const setCompleted = useMemo(
    () => user.completedQuiz.includes(set._id),
    [user.completedQuiz]
  );

  const points = category ? category.points : 0;

  const getXPpercent = useMemo(() => {
    const awardedPoints = (points / pointTotal) * 100;
    if (points > pointTotal) {
      const subtraction = points.toString().split('').splice(1).join('');
      return parseInt(subtraction);
    } else return awardedPoints;
  }, [points, pointTotal]);

  // start animation value
  const xpStart = getXPpercent - score;
  // end animation value
  const xpEnd = getXPpercent + score;

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
      style={[styles.container, { backgroundColor: user.theme.cardColor }]}
      entering={SlideInRight.delay(500)}
    >
      <Title style={[{ textAlign: 'center', color: _fontColor }]}>
        RESULTS
      </Title>

      <View style={styles.metricContainer}>
        <Title style={{ color: _fontColor }}>SCORE</Title>
        <Title style={{ color: _fontColor }}>
          {score}/{total}
        </Title>
      </View>

      <View style={styles.metricContainer}>
        <Title style={{ color: _fontColor }}>GRADE</Title>
        <Title style={{ color: _fontColor }}>{quizGrade}%</Title>
      </View>

      <View style={styles.progressBarContainer}>
        <Title style={{ color: _fontColor }}>
          {category?.name.toUpperCase()} LEVEL:
        </Title>
        <Title style={{ color: _fontColor }}>
          {Math.floor(points / pointTotal)}
        </Title>
      </View>

      <View style={styles.progressBarContainer}>
        <Title style={{ color: _fontColor }}>
          {category?.name.toUpperCase()} XP:
        </Title>
        {!setCompleted && (
          <Title style={{ color: _fontColor }}>
            <CountUp start={xpStart} end={xpEnd} duration={1.6} isCounting />/
            100
          </Title>
        )}
        {setCompleted && (
          <Title style={{ color: _fontColor }}>{getXPpercent} / 100</Title>
        )}
      </View>

      {/* XP BAR */}

      <View style={[styles.progressBar, { borderColor: user.theme.fontColor }]}>
        {!setCompleted && (
          <Animated.View
            style={[
              styles.pointBar,
              {
                width: `${getXPpercent - score}%`,
                backgroundColor: _xpBarColor,
              },
              progressBarAnim,
            ]}
          />
        )}

        {setCompleted && (
          <View
            style={[
              styles.pointBar,
              {
                width: `${getXPpercent}%`,
                backgroundColor: _xpBarColor,
              },
            ]}
          />
        )}
      </View>

      <Button
        mode='contained'
        color={_accentColor}
        style={styles.button}
        labelStyle={[{ fontSize: 16, color: _fontColor }]}
        onPress={dismiss}
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
