import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Title } from 'react-native-paper';

interface Props {
  total: number;
  points: number;
  title?: string;
  progressColor?: string;
}

const PointTracker: React.FC<Props> = ({
  total,
  points,
  title,
  progressColor,
}) => {
  const level = Math.floor(points / total);
  const progress =
    points < total
      ? (points / total) * 100
      : points.toString().split('').splice(1).join('');

  return (
    <View style={styles.container}>
      {title && (
        <View>
          <Title
            style={{ color: progressColor, width: 65, flex: 1 }}
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Title>
        </View>
      )}

      <Title style={{ color: progressColor, marginRight: 0 }}>{level}</Title>
      {/* </View> */}

      <View
        style={[
          styles.progressBar,
          { borderColor: progressColor },
          title ? { width: '70%' } : { width: '85%' },
        ]}
      >
        <View
          style={[
            styles.progress,
            { backgroundColor: progressColor, width: `${progress}%` },
          ]}
        />
      </View>

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
