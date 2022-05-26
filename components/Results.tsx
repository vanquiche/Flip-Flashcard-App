import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Text, Title, useTheme, Button } from 'react-native-paper';

import Animated, { SlideInRight } from 'react-native-reanimated';

interface Props {
  total: number;
  score: number;
}

const Results: React.FC<Props> = ({ total, score }) => {
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Title style={{ color: colors.secondary }}>SCORE</Title>
        <Title style={{ color: colors.secondary }}>
          {score}/{total}
        </Title>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Title style={{ color: colors.secondary }}>GRADE</Title>
        <Title style={{ color: colors.secondary }}>{percentage}%</Title>
      </View>
      <Button
        mode='contained'
        color={colors.secondary}
        style={styles.button}
        labelStyle={{ color: 'white', fontSize: 16 }}
      >
        Review Again
      </Button>
      <Button
        mode='contained'
        color={colors.secondary}
        style={styles.button}
        labelStyle={{ color: 'white', fontSize: 16 }}
      >
        return home
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
    borderRadius: 12,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
    elevation: 0,
  },
});

export default Results;
