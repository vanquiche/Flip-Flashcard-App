import { View, Text } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { DateTime } from 'luxon';
import { Stats as StatsType } from '../types';

const Stats = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const dt = DateTime;

  const getDataPoints = useCallback((stats: StatsType[]) => {
    //  get dates
    let labels: string[] = [];
    let answers: number[] = [];
    let questions: number[] = [];
    for (let i = 0; i < stats.length; i++) {
      const date = dt
        .fromISO(stats[i].date)
        .toLocaleString({ year: 'numeric', month: 'short', day: 'numeric' });
      const a = stats[i].score;
      const q = stats[i].questions;
      if (!labels.includes(date)) {
        labels.push(date);
      }

      const index = labels.findIndex((l) => l === date);

      const prevAnswers = answers[index] ? answers[index] : 0;
      const prevQuestions = questions[index] ? questions[index] : 0;

      answers[index] = prevAnswers + a;
      questions[index] = prevQuestions + q;
    }
    return [labels, answers, questions];
  }, [])

  const [labels, answers, questions] = getDataPoints(user.stats);

  // console.log('dates:', labels)
  // console.log('answers:', answers)
  // console.log('questions:', questions)
  // console.log(user.stats);

  return (
    <View>
      <Text>Stats</Text>
      {/* {user.stats.map(s => {
        const formatDate = dt.fromISO(s.date).toFormat('f')
        return (
          <Text>{formatDate}</Text>
        )
      })} */}
    </View>
  );
};

export default Stats;
