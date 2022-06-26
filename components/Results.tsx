import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Text, Title, useTheme, Button } from 'react-native-paper';

import Animated, { SlideInRight } from 'react-native-reanimated';
import XPbar from './XPbar';
import { Category, Set } from './types';

interface Props {
  set: Set;
  total: number;
  score: number;
  dismiss?: () => void;
}

const Results: React.FC<Props> = ({ total, set, score, dismiss }) => {
  const { colors } = useTheme();
  const percentage = Math.floor((score / total) * 100);

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
        <Title style={{ color: colors.secondary }}>{percentage}%</Title>
      </View>

      <XPbar total={100} set={set} score={score}/>
      {/* will add logic to restart quiz later */}

      {/* <Button
        mode='contained'
        color={colors.secondary}
        style={styles.button}
        labelStyle={{ color: 'white', fontSize: 16 }}
      >
        Review Again
      </Button> */}

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
});

export default Results;
