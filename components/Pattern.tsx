import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import React from 'react';

interface Props {
  uri: any;
  name: string;
  select: any;
}
const Pattern: React.FC<Props> = ({ uri, select, name }) => {

  const handlePress = () => {
    select(name);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      onLongPress={(e) => e.preventDefault()}
    >
      <ImageBackground
        resizeMode='center'
        source={uri}
        imageStyle={styles.image}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 45,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'black',
    margin: 5,
  },
  image: {
    height: 45,
    width: 45,
    tintColor: 'white'
  },
});
export default React.memo(Pattern);
