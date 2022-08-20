import { View, Text, ScrollView } from 'react-native';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userThunkActions';

import ShopCatalogue from '../ShopCatalogue';
import ShopSwatchColor from '../ShopSwatchColor';

import { STORE_SWATCH_LIST } from '../../assets/swatchList';
import { STORE_PATTERNS } from '../../assets/patterns/patterns';
import { STORE_THEMES } from '../../assets/theme/userTheme';

import ShopSwatchPattern from '../ShopSwatchPattern';
import ShopTheme from '../ShopTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { CountUp } from 'use-count-up';

import { Theme } from '../types';
import swatchContext from '../../contexts/swatchContext';
import fontColorContrast from 'font-color-contrast';

const Shop = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const { theme } = useContext(swatchContext);

  // start and end value for countUp animation
  const [countUpValue, setCountUpValue] = useState({
    start: user.heartcoin,
    end: user.heartcoin,
  });
  const [delayButton, setDelayButton] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const titleColor = fontColorContrast(theme.bgColor, 0.6);

  const purchaseColor = useCallback(
    (c: string, p: number) => {
      const updateColors = user.collection.colors.concat(c);
      const updateCoins = user.heartcoin - p;

      setCountUpValue((prev) => ({
        start: prev.end,
        end: prev.end - p,
      }));

      dispatch(
        updateUser({
          heartcoin: updateCoins,
          collection: {
            ...user.collection,
            colors: updateColors,
          },
        })
      );
    },
    [user.collection.colors, user.heartcoin]
  );

  const purchasePattern = useCallback(
    (d: Object, p: number) => {
      const updatePatterns = user.collection.patterns
        ? Object.assign({ ...user.collection.patterns }, d)
        : d;

      const updateCoins = user.heartcoin - p;

      setCountUpValue((prev) => ({
        start: prev.end,
        end: prev.end - p,
      }));

      dispatch(
        updateUser({
          heartcoin: updateCoins,
          collection: {
            ...user.collection,
            patterns: updatePatterns,
          },
        })
      );
    },
    [user.collection.patterns, user.heartcoin]
  );

  const purchaseTheme = useCallback(
    (t: Theme, p: number) => {
      const updateCoins = user.heartcoin - p;
      const updateThemes = user.collection.themes
        ? user.collection.themes.concat(t)
        : t;

      setCountUpValue((prev) => ({
        start: prev.end,
        end: prev.end - p,
      }));

      dispatch(
        updateUser({
          heartcoin: updateCoins,
          collection: {
            ...user.collection,
            themes: updateThemes,
          },
        })
      );
    },
    [user.collection.themes, user.heartcoin]
  );

  // prevents user from pressing 'get coins'
  // too frequently in a short time
  const debounceBtn = () => {
    setDelayButton(true);
    setTimeout(() => {
      setDelayButton(false);
    }, 900);
  };

  // disable 'reset purchases' btn if
  // collection is already empty
  const emptyCollection = useMemo(() => {
    const isEmpty = Object.values(user.collection).some((item) => {
      if (Array.isArray(item)) {
        return item.length > 0;
      } else {
        return Object.values(item).length > 0;
      }
    });
    return isEmpty;
  }, [user.collection]);

  // strictly for testing purposes
  const resetPurchase = () => {
    dispatch(
      updateUser({ collection: { colors: [], patterns: {}, themes: [] } })
    );
  };

  // strictly for testing purposes
  const addCoins = () => {
    debounceBtn();
    setCountUpValue((prev) => ({
      start: prev.end,
      end: prev.end + 25,
    }));
    dispatch(updateUser({ heartcoin: user.heartcoin + 25 }));
  };

  return (
    <>
      <View style={{ padding: 5, paddingHorizontal: 20 }}>
        <Title
          style={{ color: titleColor, textAlign: 'right', marginRight: 20 }}
          accessible={true}
          accessibilityLabel={`${countUpValue.end} coins`}
          accessibilityRole='text'
        >
          <CountUp
            duration={1.2}
            start={countUpValue.start}
            end={countUpValue.end}
            key={countUpValue.end}
            isCounting={countUpValue.start !== countUpValue.end}
          />
        </Title>

        <FontAwesome5
          name='coins'
          size={20}
          color={titleColor}
          style={{ position: 'absolute', right: 15, top: 12 }}
        />
      </View>
      <ScrollView>
        {/* SWATCH COLORS */}
        <ShopCatalogue title='CARD COLORS' titleColor={titleColor}>
          {STORE_SWATCH_LIST.map((d, i) => (
            <ShopSwatchColor
              key={i}
              color={d}
              price={50}
              onPress={purchaseColor}
            />
          ))}
        </ShopCatalogue>

        {/* SWATCH PATTERNS */}
        <ShopCatalogue title='CARD PATTERNS' titleColor={titleColor}>
          {Object.entries(STORE_PATTERNS).map((p, i) => {
            return (
              <ShopSwatchPattern
                key={i}
                price={50}
                pattern={p}
                onPress={purchasePattern}
              />
            );
          })}
        </ShopCatalogue>

        <ShopCatalogue title='THEMES' titleColor={titleColor}>
          {STORE_THEMES.map((t, i) => {
            return (
              <ShopTheme
                key={i}
                theme={t}
                price={150}
                onPress={purchaseTheme}
              />
            );
          })}
        </ShopCatalogue>
        {/* strictly for testing purposes */}
        <Button
          color='black'
          onPress={resetPurchase}
          disabled={!emptyCollection}
          accessible={true}
          accessibilityLabel='reset'
          accessibilityHint='reset all purchases'
          accessibilityRole='button'
          accessibilityState={{ disabled: false }}
        >
          reset purchases
        </Button>
        <Button
          color='black'
          onPress={addCoins}
          disabled={delayButton}
          accessible={true}
          accessibilityLabel='get coints'
          accessibilityHint='acquire more coins'
          accessibilityRole='button'
          accessibilityState={{ disabled: false }}
        >
          get coins
        </Button>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'grey',
            paddingHorizontal: 20,
          }}
        >
          This is just for testing purposes, but go crazy in the meantime
        </Text>
      </ScrollView>
    </>
  );
};

export default Shop;
