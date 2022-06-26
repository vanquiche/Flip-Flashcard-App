import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Title, useTheme } from 'react-native-paper';
import Animated, {
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Set } from './types';

interface Props {
  set: Set;
  total: number;
  score: number;
}

const XPbar: React.FC<Props> = ({ total, set, score }) => {
  const { user, cards } = useSelector((state: RootState) => state.store);
  const { colors } = useTheme();

  const category = cards.category.find((c) => c._id === set.categoryRef);
  const setCompleted = user.completedQuiz.includes(set._id);
  const points = category ? category.points : 0;

  // current user xp
  // total xp before next level

  const currentCategoryXP = useMemo(() => {
    const awardedPoints = (points / total) * 100;
    if (points > total) {
      const subtraction = (points)
        .toString()
        .split('')
        .splice(1)
        .join('');
      return parseInt(subtraction);
    } else return awardedPoints;
  }, []);

  const progressBarStart = useSharedValue(currentCategoryXP);

  const progressBarAnim = useAnimatedStyle(() => {
    return {
      width: withTiming(
        `${progressBarStart.value}%`,
        { duration: 1300 },
        () => (progressBarStart.value = currentCategoryXP + score)
      ),
    };
  });

  return (
    <>
      <View style={styles.container}>
        <Title style={{ color: colors.secondary }}>
          {category?.name.toUpperCase()} LEVEL:
        </Title>
        <Title style={{ color: colors.secondary }}>
          {Math.floor(points / total)}
        </Title>
      </View>
      <View style={styles.container}>
        <Title style={{ color: colors.secondary }}>
          {category?.name.toUpperCase()} XP:
        </Title>
        <Title style={{ color: colors.secondary }}>{points}</Title>
      </View>
      {/* XP BAR */}
      <View style={[styles.progressBar, { borderColor: colors.secondary }]}>
        {!setCompleted ? (
          // animated progress bar
          <Animated.View
            style={[
              styles.pointBar,
              {
                // starting point
                width: `${currentCategoryXP - score}%`,
                backgroundColor: colors.secondary,
              },
              progressBarAnim,
            ]}

          />
        ) : (
          // static progress bar
          <View
            style={[
              styles.pointBar,
              { backgroundColor: colors.secondary, width: `${currentCategoryXP}%` },
            ]}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    height: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'brown',
    borderRadius: 10,
    marginVertical: 10,
  },
  pointBar: {
    height: 15,
    backgroundColor: 'lightblue',
    position: 'absolute',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default XPbar;
