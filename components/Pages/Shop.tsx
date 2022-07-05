import { View, Text, ScrollView } from 'react-native';
import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userThunkActions';

import ShopCatalogue from '../ShopCatalogue';
import ShopSwatchColor from '../ShopSwatchColor';

import { STORE_SWATCH_LIST } from '../../assets/swatchList';
import DEFAULT_PATTERNS, {
  STORE_PATTERNS,
} from '../../assets/patterns/defaultPatterns';

import ShopSwatchPattern from '../ShopSwatchPattern';

const DATA = [
  {
    name: 'color1',
    color: 'red',
    price: 50,
  },
  {
    name: 'color2',
    color: 'blue',
    price: 50,
  },
  {
    name: 'color3',
    color: 'green',
    price: 50,
  },
];

const Shop = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  // console.log(user)

  const purchaseColor = useCallback(
    (c: string, p: number) => {
      // console.log(c);
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

  const resetPurchase = () => {
    dispatch(
      updateUser({ collection: { colors: [], patterns: {}, themes: [] } })
    );
  };

  const addCoins = () => {
    dispatch(updateUser({ heartcoin: user.heartcoin + 50 }));
  };

  // console.log(STORE_PATTERNS);
  // console.log(user.collection.patterns)

  return (
    <>
      <ScrollView>
        <Text>COINS: {user.heartcoin}</Text>
        {/* SWATCH COLORS */}
        <ShopCatalogue title='CARD COLORS' titleColor={user.theme.cardColor}>
          {STORE_SWATCH_LIST.map((d, i) => (
            <ShopSwatchColor key={i} onPress={purchaseColor} color={d} />
          ))}
        </ShopCatalogue>

        {/* SWATCH PATTERNS */}
        <ShopCatalogue title='CARD PATTERNS' titleColor={user.theme.cardColor}>
          {Object.entries(STORE_PATTERNS).map((p, i) => {
            return (
              <ShopSwatchPattern
                key={i}
                onPress={purchasePattern}
                pattern={p}
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
