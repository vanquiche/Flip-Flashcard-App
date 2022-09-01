import { View, Dimensions, Pressable, InteractionManager } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import s from '../styles/styles';
import THEMES from '../../assets/theme/userTheme';
import ThemeDisplay from '../ThemeDisplay';
import { IconButton } from 'react-native-paper';
import { Theme } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userThunkActions';
import CarouselDots from '../CarouselDots';
import Animated, {
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const Themes = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();
  let isMounted = true;

  const ALL_THEMES = THEMES.concat(user.collection.themes);

  // set content offset based on selection
  const userThemeIndex = ALL_THEMES.findIndex(
    (t) => t.name === user.theme.name
  );
  const [count, setCount] = useState(userThemeIndex || 0);

  const changeTheme = useCallback((t: Theme) => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(updateUser({ theme: t }));
    });
  }, []);

  const scrollIntervals = useMemo(() => {
    let list: { offset: number; page: number }[] = [];
    ALL_THEMES.forEach((_, i) => {
      list.push({ offset: SCREEN_WIDTH * i, page: i });
    });
    return list;
  }, [ALL_THEMES]);

  const handleScroll = useAnimatedScrollHandler({
    onMomentumBegin: (e, ctx: any) => {
      ctx.start = e.contentOffset.x;
    },
    onMomentumEnd(e, ctx) {
      const curPos = e.contentOffset.x;
      if (ctx.start !== curPos) {
        // console.log(curPos);
        const item = scrollIntervals.filter((s) => s.offset === curPos);
        const page = item[0] ? item[0].page : count;
        if (page !== undefined && isMounted) {
          runOnJS(setCount)(page);
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[s.screenWrapper]}>
      <View style={{ position: 'absolute', width: '100%', top: 25 }}>
        <CarouselDots length={ALL_THEMES.length} page={count} />
      </View>
      <Animated.ScrollView
        horizontal
        scrollEnabled
        decelerationRate={0}
        snapToAlignment='center'
        snapToInterval={SCREEN_WIDTH}
        contentOffset={{ x: SCREEN_WIDTH * userThemeIndex, y: 0 }}
        contentContainerStyle={{ alignItems: 'center' }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {ALL_THEMES.map((t, i) => (
            <Pressable
              key={i}
              style={{ marginHorizontal: SCREEN_WIDTH * 0.2 }}
              onPress={() => changeTheme(t)}
              disabled={i === userThemeIndex}
              accessible={true}
              accessibilityLabel={'theme: ' + t.name}
              accessibilityHint={
                i === userThemeIndex
                  ? t.name + 'theme currently selected'
                  : 'set theme to ' + t.name
              }
            >
              {userThemeIndex === i && (
                <IconButton
                  icon='check-circle-outline'
                  size={80}
                  color='black'
                  style={{
                    position: 'absolute',
                    zIndex: 30,
                    top: SCREEN_HEIGHT * 0.2,
                    left: SCREEN_WIDTH * 0.13,
                  }}
                />
              )}
              <ThemeDisplay key={i} theme={t} />
            </Pressable>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Themes;
