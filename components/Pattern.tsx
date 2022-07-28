import { StyleSheet, Pressable, Image } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  name: string;
  select: any;
  patternList?: Record<string, any>;
  isNull?: boolean;
  isSelected: boolean;
}
const Pattern = ({ select, name, patternList, isNull, isSelected }: Props) => {
  const handlePress = () => {
    select(name);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
    >
      {isSelected && (
        <FontAwesome5
          name='check-circle'
          size={45}
          color='black'
          style={styles.checkmark}
        />
      )}
      {!isNull && patternList && (
        <Image
          resizeMode='cover'
          source={patternList[name]}
          style={styles.image}
        />
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 45,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'tomato',
    margin: 5,
  },
  image: {
    height: 45,
    width: 45,
    tintColor: 'white',
  },
  checkmark: {
    position: 'absolute',
    zIndex: 100,
  },
});
export default React.memo(Pattern);
