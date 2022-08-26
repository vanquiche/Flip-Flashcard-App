import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  color: string;
  onChange: (color: string) => void;
  isSelected: boolean;
}

const Swatch = ({ color, onChange, isSelected }: Props) => {
  const handlePress = () => {
    onChange(color);
  };

  return (
    <Pressable
      style={[styles.swatch, { backgroundColor: color }]}
      onPress={handlePress}
      accessible
      accessibilityRole='menuitem'
    >
      {isSelected && (
        <FontAwesome5
          name='check-circle'
          size={45}
          color='black'
          style={styles.checkmark}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  swatch: {
    height: 45,
    width: 45,
    borderRadius: 10,
    margin: 5,
  },
   checkmark: {
    position: 'absolute',
    zIndex: 100,
  },
});
export default React.memo(Swatch);
