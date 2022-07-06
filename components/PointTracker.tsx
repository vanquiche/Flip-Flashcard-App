import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Title } from 'react-native-paper';

interface Props {
  total: number;
  points: number;
  title?: string;
  progressColor?: string;
}

const PointTracker = ({ total, points, title, progressColor }: Props) => {
  const level = Math.floor(points / total);

  // calculate percentage of width for progress bar
  const progress =
    points < total
      ? (points / total) * 100
      : // remove first digit from points to
        // get percentage, when greater than total
        points.toString().split('').splice(1).join('');

  return (
    <View style={styles.container}>
      <View>
        {title && (
          <Title
            style={{ color: progressColor, width: 65, flex: 1 }}
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Title>
        )}
      </View>

      {/* current level */}
      <Title style={{ color: progressColor, marginRight: 0 }}>{level}</Title>

      {/* progress bar container */}
      <View
        style={[
          styles.progressBar,
          { borderColor: progressColor },
          title ? { width: '60%' } : { width: '85%' },
        ]}
      >
        {/* progress bar */}
        <View
          style={[
            styles.progress,
            { backgroundColor: progressColor, width: `${progress}%` },
          ]}
        />
      </View>

      {/* next level */}
      <Title style={{ color: progressColor, marginLeft: 0 }}>{level + 1}</Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
    width: '95%',
  },
  progressBar: {
    height: 14,
    borderWidth: 2,
    overflow: 'hidden',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  progress: {
    height: 14,
    backgroundColor: 'brown',
  },
  star: {
    position: 'absolute',
    transform: [{ translateX: -35 }, { translateY: -45 }],
    padding: 0,
    margin: 0,
    zIndex: 10,
  },
});

export default React.memo(PointTracker, (prev, next) => {
  if (prev.points === next.points && prev.progressColor === next.progressColor)
    return true;
  return false;
});
