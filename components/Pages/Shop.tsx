import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import { Button, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userThunkActions';

import ShopCatalogue from '../ShopCatalogue';
import ShopSwatchColor from '../ShopSwatchColor';

import { STORE_SWATCH_LIST } from '../../assets/swatchList';
import { STORE_PATTERNS } from '../../assets/patterns/defaultPatterns';
import { STORE_THEMES } from '../../assets/theme/userTheme';

import ShopSwatchPattern from '../ShopSwatchPattern';
import ThemeDisplay from '../ThemeDisplay';
import ShopTheme from '../ShopTheme';

import { Theme } from '../types';

const Shop = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();
  // console.log(user)

  const purchaseColor = useCallback(
    (c: string, p: number) => {
      const updateColors = user.collection.colors.concat(c);
      const updateCoins = user.heartcoin - p;

      // console.log(updated)
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

  const resetPurchase = () => {
    dispatch(
      updateUser({ collection: { colors: [], patterns: {}, themes: [] } })
    );
  };

  const addCoins = () => {
    dispatch(updateUser({ heartcoin: user.heartcoin + 50 }));
  };

  return (
    <>
      <View style={{ padding: 10, paddingHorizontal: 20 }}>
        <Title style={{ color: user.theme.cardColor, textAlign: 'right' }}>
          HEARTCOIN: {user.heartcoin}
        </Title>
      </View>
      <ScrollView>
        {/* SWATCH COLORS */}
        <ShopCatalogue
          title='CARD COLORS'
          titleColor={user.theme.cardColor}
        >
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
        <ShopCatalogue title='CARD PATTERNS' titleColor={user.theme.cardColor}>
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

        <ShopCatalogue title='THEMES' titleColor={user.theme.cardColor}>
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

        <Button color='black' onPress={resetPurchase}>
          reset purchase
        </Button>
        <Button color='black' onPress={addCoins}>
          get coins
        </Button>
      </ScrollView>
    </>
  );
};

export default Shop;
