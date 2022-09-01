import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Text, Title } from 'react-native-paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AlertDialog from './AlertDialog';
import fontColorContrast from 'font-color-contrast';
import { Ionicons } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { GetColorName } from 'hex-color-to-color-name';

const coinIcon = require('../assets/images/HeartCoinImage.png');
interface Props {
  color: string;
  price: number;
  onPress: (c: string, p: number) => void;
}

const ShopSwatchColor = ({ color, price, onPress }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);
  const [showAlert, setShowAlert] = useState(false);

  const _fontColor = fontColorContrast(color, 0.6)

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
              accessibilityLabel={`color ${GetColorName(
                color
              )} already purchased`}
            />
          </Animated.View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '55%',
              alignItems: 'center',
            }}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`purchase ${GetColorName(
              color
            )} for ${price} coins`}
          >
            <Text
              style={{ ...styles.price, color: _fontColor }}
            >
              {price}
            </Text>
            <Image
              source={coinIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: _fontColor,
              }}
            />
          </View>
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
