import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Text, Title } from 'react-native-paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AlertDialog from './AlertDialog';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  pattern: any[];
  price: number;
  onPress: (c: Object, p: number) => void;
}

const ShopSwatchPattern = ({ pattern, price, onPress }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);
  const [showAlert, setShowAlert] = useState(false);

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
          <Ionicons
            name='checkmark-circle'
            size={72}
            color='white'
            style={styles.icon}
            accessible
            accessibilityRole='image'
            accessibilityLabel={`pattern ${pattern[0]} already purchased`}
          />
        ) : (
          <Title
            style={styles.price}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`purchase ${pattern[0]} pattern for ${price} coins`}
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
    overflow: 'hidden',
  },
  price: {
    color: 'black',
    fontSize: 26,
    // borderWidth: 2,
    paddingTop: 10,
  },
  name: {
    color: 'white',
    fontSize: 20,
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
