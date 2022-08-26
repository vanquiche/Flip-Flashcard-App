import { View, Pressable, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AlertDialog from './AlertDialog';
import fontColorContrast from 'font-color-contrast';
import { Ionicons } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { GetColorName } from 'hex-color-to-color-name';

interface Props {
  color: string;
  price: number;
  onPress: (c: string, p: number) => void;
}

const ShopSwatchColor = ({ color, price, onPress }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);
  const [showAlert, setShowAlert] = useState(false);

  const alreadyPurchased = user.collection.colors?.includes(color); // const alreadyPurchased = false

  const canAfford = user.heartcoin >= price;

  const handlePress = () => {
    setShowAlert(false);
    onPress(color, price);
  };

  return (
    <>
      <AlertDialog
        message={
          canAfford
            ? `Purchase this color for ${price} coins?`
            : 'you do not have enough coins'
        }
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={handlePress}
        disable={!canAfford}
      />
      <Pressable
        style={[
          styles.container,
          {
            backgroundColor: color,
          },
        ]}
        onPress={() => setShowAlert(true)}
        disabled={alreadyPurchased}
      >
        {alreadyPurchased ? (
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            style={styles.icon}
          >
            <Ionicons
              name='checkmark-circle'
              size={72}
              color='white'
              accessible
              accessibilityRole='image'
              accessibilityLabel={`color ${GetColorName(color)} already purchased`}
            />
          </Animated.View>
        ) : (
          <Title
            style={{ ...styles.price, color: fontColorContrast(color, 0.6) }}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`purchase ${GetColorName(color)} for ${price} coins`}
          >
            {price}
          </Title>
        )}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'tomato',
  },
  price: {
    color: 'white',
    fontSize: 26,
    paddingTop: 10,
  },
  name: {
    color: 'white',
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
  },
});
export default React.memo(ShopSwatchColor);
