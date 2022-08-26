import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useCallback } from 'react';
import s from '../styles/styles';
import THEMES from '../../assets/theme/userTheme';
import ThemeDisplay from '../ThemeDisplay';
import { IconButton } from 'react-native-paper';
import { Theme } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userThunkActions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const Themes = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  const ALL_THEMES = THEMES.concat(user.collection.themes);

  // set content offset based on selection
  const userThemeIndex = ALL_THEMES.findIndex(
    (t) => t.name === user.theme.name
  );

  const changeTheme = useCallback((t: Theme) => {
    dispatch(updateUser({ theme: t }));
  }, []);

  return (
    <View style={[s.screenWrapper]}>
      <ScrollView
        horizontal
        scrollEnabled
        decelerationRate={0}
        snapToAlignment='center'
        snapToInterval={SCREEN_WIDTH}
        contentOffset={{ x: SCREEN_WIDTH * userThemeIndex, y: 0 }}
        contentContainerStyle={{ alignItems: 'center' }}
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
      </ScrollView>
    </View>
  );
};

export default Themes;
