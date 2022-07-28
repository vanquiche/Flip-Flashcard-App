import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Theme } from './types';
import ThemeDisplay from './ThemeDisplay';
import AlertDialog from './AlertDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { IconButton, Title } from 'react-native-paper';
import fontColorContrast from 'font-color-contrast';

interface Props {
  theme: Theme;
  price: number;
  onPress: (t: Theme, p: number) => void;
}

const ShopTheme = ({ theme, price, onPress }: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useSelector((state: RootState) => state.store);

  const canAfford = user.heartcoin >= price;
  const alreadyPurchased = user.collection.themes.some(
    (t) => t.name === theme.name
  );

  const handlePress = () => {
    setShowAlert(false);
    onPress(theme, price);
  };

  return (
    <>
      <AlertDialog
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={handlePress}
        message={
          canAfford
            ? `purchase this theme for ${price} heartcoins`
            : 'you do not have enough coins'
        }
        disable={!canAfford}
      />
      <Pressable onPress={() => setShowAlert(true)} disabled={alreadyPurchased}>
        {alreadyPurchased ? (
          <IconButton
            icon='check-circle'
            size={75}
            color='black'
            style={styles.icon}
          />
        ) : (
          <Title
            style={{
              ...styles.price,
              color: fontColorContrast(theme.cardColor, 0.7),
            }}
          >
            {price}
          </Title>
        )}

        <ThemeDisplay theme={theme} style={{ marginHorizontal: 10 }} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  price: {
    color: 'white',
    fontSize: 26,
    position: 'absolute',
    zIndex: 20,
    left: '42%',
    top: '44%',
  },
  icon: {
    position: 'absolute',
    zIndex: 20,
    left: '24%',
    top: '32%',
  },
});

export default React.memo(ShopTheme);
