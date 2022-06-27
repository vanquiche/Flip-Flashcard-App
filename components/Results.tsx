import { View, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { Text, Title, useTheme, Button } from 'react-native-paper';

import Animated, { SlideInRight } from 'react-native-reanimated';
import { RootState } from '../redux/store';

import { useSelector } from 'react-redux';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { CountUp } from 'use-count-up';
import { Category, Set } from './types';

interface Props {
  set: Set;
  total: number;
  score: number;
  pointTotal: number;
  dismiss?: () => void;
}

const Results: React.FC<Props> = ({
  total,
  set,
  score,
  pointTotal,
  dismiss,
}) => {
  const { user, cards } = useSelector((state: RootState) => state.store);
  const { colors } = useTheme();
  const quizGrade = Math.floor((score / total) * 100);

  const category = useMemo(
    () => cards.category.find((c) => c._id === set.categoryRef),
    []
  );
  const setCompleted = useMemo(() => user.completedQuiz.includes(set._id), []);
  const points = category ? category.points : 0;

  const getXPpercent = useMemo(() => {
    const awardedPoints = (points / pointTotal) * 100;
    if (points > pointTotal) {
      const subtraction = points.toString().split('').splice(1).join('');
      return parseInt(subtraction);
    } else return awardedPoints;
  }, []);

  const progressStart = getXPpercent - score;
  const progressEnd = getXPpercent + score;

  const progressBarStart = useSharedValue(progressStart);
  const progressBarAnim = useAnimatedStyle(() => {
    return {
      width: withTiming(
        `${progressBarStart.value}%`,
        { duration: 1100 },
        () => (progressBarStart.value = progressEnd)
      ),
    };
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.primary }]}
      entering={SlideInRight.delay(500)}
    >
      <Title style={{ color: colors.secondary, textAlign: 'center' }}>
        RESULTS
      </Title>

      <View style={styles.metricContainer}>
        <Title style={{ color: colors.secondary }}>SCORE</Title>
        <Title style={{ color: colors.secondary }}>
          {score}/{total}
        </Title>
      </View>

      <View style={styles.metricContainer}>
        <Title style={{ color: colors.secondary }}>GRADE</Title>
        <Title style={{ color: colors.secondary }}>{quizGrade}%</Title>
      </View>

      <View style={styles.progressBarContainer}>
        <Title style={{ color: colors.secondary }}>
          {category?.name.toUpperCase()} LEVEL:
        </Title>
        <Title style={{ color: colors.secondary }}>
          {Math.floor(points / pointTotal)}
        </Title>
      </View>

      <View style={styles.progressBarContainer}>
        <Title style={{ color: colors.secondary }}>
          {category?.name.toUpperCase()} XP:
        </Title>
        {!setCompleted ? (
          <Title style={{ color: colors.secondary }}>
            <CountUp
              start={progressStart}
              end={progressEnd}
              duration={1.75}
              isCounting
            />
            / 100
          </Title>
        ) : (
          <Title style={{ color: colors.secondary }}>
            {getXPpercent} / 100
          </Title>
        )}
      </View>

      {/* XP BAR */}

      <View style={[styles.progressBar, { borderColor: colors.secondary }]}>
        {!setCompleted ? (
          // {/* // animated progress bar */}
          <Animated.View
            style={[
              styles.pointBar,
              {
                // starting point
                width: `${getXPpercent - score}%`,
                backgroundColor: colors.secondary,
              },
              progressBarAnim,
            ]}
          />
        ) : (
          // {/* // static progress bar */}
          <View
            style={[
              styles.pointBar,
              {
                backgroundColor: colors.secondary,
                width: `${getXPpercent}%`,
              },
            ]}
          />
        )}
      </View>

      <Button
        mode='contained'
        color={colors.secondary}
        style={styles.button}
        labelStyle={{ color: 'white', fontSize: 16 }}
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
