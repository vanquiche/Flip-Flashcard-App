import { View, Pressable, StyleSheet, Image } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AlertDialog from './AlertDialog';

interface Props {
  pattern: any[];
  onPress: (c: Object, p: number) => void;
}

const ShopSwatchPattern = ({ pattern, onPress }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);
  const [showAlert, setShowAlert] = useState(false);
  const price = 50;

  const alreadyPurchased = user.collection.patterns
    ? Object.keys(user.collection.patterns).includes(pattern[0])
    : false;

  const canAfford = user.heartcoin >= price;

  const handlePress = () => {
    const doc = {
      [pattern[0]]: pattern[1],
    };
    setShowAlert(false);
    onPress(doc, price);
  };

  return (
    <>
      <AlertDialog
        message={
          canAfford
            ? `Purchase this pattern for ${price} coins?`
            : 'you do not have enough coins'
        }
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={handlePress}
        disable={!canAfford}
      />
      <Pressable
        style={[styles.container]}
        onPress={() => setShowAlert(true)}
        disabled={alreadyPurchased}
      >
        <Image source={pattern[1]} style={styles.image} />
        {alreadyPurchased ? (
          <IconButton
            icon='check-circle'
            style={styles.icon}
            color='white'
            size={75}
          />
        ) : (
          <Text style={styles.price}>{price}</Text>
        )}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'tomato',
    overflow: 'hidden',
  },
  price: {
    color: 'white',
    fontSize: 18,
  },
  name: {
    color: 'white',
    fontSize: 18,
  },
  icon: {
    position: 'absolute',
  },
  image: {
    height: 100,
    width: 100,
    position: 'absolute',
    tintColor: 'white',
    opacity: 0.45,
  },
});
export default React.memo(ShopSwatchPattern);
