import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Title, useTheme } from 'react-native-paper';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Set } from './types';

interface Props {
  set: Set;
  total: number;
}

const XPbar: React.FC<Props> = ({ total, set }) => {
  const { user, cards } = useSelector((state: RootState) => state.store);
  const { colors } = useTheme();

  const category = cards.category.find((c) => c._id === set.categoryRef);
  const setCompleted = user.completedQuiz.includes(set._id);
  const points = category ? category.points : 0;

  // current user xp
  // total xp before next level
  const awardedPoints = (points / total) * 100;

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
        <Title style={{ color: colors.secondary }}>
          {points} / {total}
        </Title>
      </View>
      <View style={[styles.progressBar, { borderColor: colors.secondary }]}>
        <Animated.View
          style={[
            styles.pointBar,
            {
              width: `${
                awardedPoints > total ? awardedPoints * 10 : awardedPoints
              }%`,
              backgroundColor: colors.secondary,
            },
          ]}
          entering={
            !setCompleted ? SlideInLeft.delay(600).duration(1000) : undefined
          }
        />
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
    marginVertical: 5
  },
});

export default XPbar;
