import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { IconButton } from 'react-native-paper';

interface Props {
  favorite: boolean;
  setFavorite: () => void;
}

const FavoriteAction = ({ favorite, setFavorite }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Text style={{fontSize: 20}}>FAVORITE</Text>
      <IconButton
        icon={favorite ? 'star-circle' : 'star-circle-outline'}
        onPress={setFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
export default FavoriteAction;
