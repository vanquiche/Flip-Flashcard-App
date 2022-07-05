import { View, Pressable, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AlertDialog from './AlertDialog';
interface SwatchProps {
  color: string;
  onPress: (c: string, p: number) => void;
}

const ShopSwatchColor = ({
  color,
  onPress
}: SwatchProps) => {
  const {
    user
  } = useSelector((state: RootState) => state.store);
  const [showAlert, setShowAlert] = useState(false);
  const price = 50;
  const alreadyPurchased = user.collection.colors?.includes(color); // const alreadyPurchased = false

  const canAfford = user.heartcoin >= price;

  const handlePress = () => {
    setShowAlert(false);
    onPress(color, price);
  };

  return <>
      <AlertDialog message={canAfford ? `Purchase this color for ${price} coins?` : 'you do not have enough coins'} visible={showAlert} onDismiss={() => setShowAlert(false)} onConfirm={handlePress} disable={!canAfford} />
      <Pressable style={[styles.container, {
      backgroundColor: color
    }]} onPress={() => setShowAlert(true)} disabled={alreadyPurchased}>
        {alreadyPurchased ? <IconButton icon='check-circle' style={styles.icon} color='white' size={75} /> : <Text style={styles.price}>{price}</Text>}
      </Pressable>
    </>;
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'tomato'
  },
  price: {
    color: 'white',
    fontSize: 18
  },
  name: {
    color: 'white',
    fontSize: 18
  },
  icon: {
    position: 'absolute'
  }
});
export default React.memo(ShopSwatchColor);