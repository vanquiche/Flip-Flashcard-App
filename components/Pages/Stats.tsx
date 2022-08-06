import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { DateTime } from 'luxon';
import { Stats as StatsType } from '../types';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { Button, Title } from 'react-native-paper';
import swatchContext from '../../contexts/swatchContext';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

type SelectDataType = 'avg' | 'sets';
type DataPoint = { date: string; datapoints: number };

const Stats = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [dataType, setDataType] = useState<SelectDataType>('avg');
  const { user } = useSelector((state: RootState) => state.store);
  const { theme } = useContext(swatchContext);

  const _cardColor = theme.cardColor;
  const _fontColor = theme.fontColor;

  const dt = DateTime;

  const generateData = (
    stats: StatsType[],
    week: number,
    datatype: SelectDataType
  ) => {
    const current = dt.fromObject({
      weekYear: dt.now().year,
      weekNumber: dt.now().weekNumber,
    });

    const dateRef = week === 0 ? current : current.minus({ weeks: week });

    let dataset: DataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const day = dateRef.startOf('week').plus({ days: i });
      const date = day.toLocaleString({ month: 'numeric', day: 'numeric' });

      // check if any data matches dateRef in stats
      const inStats = stats.some(
        (s) => dt.fromISO(s.date).weekday === day.weekday
      );

      if (inStats) {
        // if in stats then extract items that match dateRef
        const selection = stats.filter(
          (s) =>
            dt.fromISO(s.date).weekday === day.weekday &&
            dt.fromISO(s.date).weekNumber === day.weekNumber &&
            dt.fromISO(s.date).year === day.year
        );
        // get sum of all score percentage
        const percentage = selection.reduce((prev, curr) => {
          return curr.score / curr.questions + prev;
        }, 0);
        // get average of percentages
        const avgScore =
          percentage === 0
            ? 0
            : Math.floor((percentage / selection.length) * 100);

        // add entry to week with date and score
        dataset.push({
          date: date,
          datapoints: datatype === 'avg' ? avgScore : selection.length,
        });
        // otherwise add default entry
      } else {
        dataset.push({
          date: date,
          datapoints: 0,
        });
      }
    }
    return dataset;
  };

  const data = useMemo(
    () => generateData(user.stats, currentWeek, dataType),
    [user.stats, currentWeek, dataType]
  );

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <Button
          mode='contained'
          color={_cardColor}
          labelStyle={{ color: _fontColor }}
          onPress={() => setDataType('avg')}
          disabled={dataType === 'avg'}
          style={styles.button}
        >
          avg.
        </Button>
        <Title style={{ ...styles.chartTitle, color: _cardColor }}>
          {dataType === 'avg' ? 'AVERAGE SCORE' : 'COMPLETED SET'}
        </Title>
        <Button
          mode='contained'
          color={_cardColor}
          labelStyle={{ color: _fontColor }}
          onPress={() => setDataType('sets')}
          disabled={dataType === 'sets'}
          style={styles.button}
        >
          sets
        </Button>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={SCREEN_WIDTH}
          height={340}
          animate={{ duration: 500 }}
          theme={VictoryTheme.material}
          domain={{ x: [1, 7], y: dataType === 'avg' ? [0, 100] : undefined }}
          domainPadding={{ x: 20 }}
        >
          <VictoryBar
            data={data}
            cornerRadius={{ top: 6 }}
            x='date'
            y='datapoints'
            style={{ data: { fill: _cardColor, width: 25 } }}
          />
        </VictoryChart>
      </View>

      <View style={styles.btnContainer}>
        <Button
          mode='contained'
          labelStyle={{ color: _fontColor }}
          color={_cardColor}
          style={styles.button}
          onPress={() => setCurrentWeek((prev) => prev + 1)}
          disabled={currentWeek >= 12}
        >
          Prev
        </Button>
        <Button
          mode='contained'
          labelStyle={{ color: _fontColor }}
          color={_cardColor}
          style={styles.button}
          onPress={() => setCurrentWeek((prev) => prev - 1)}
          disabled={currentWeek === 0}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    elevation: 0,
  },
  chartTitle: {
    textAlign: 'center',
  },
});

export default Stats;
