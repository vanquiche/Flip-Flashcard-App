import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const Swatch = ({ color, onChange }: Props) => {
  const handlePress = () => {
    onChange(color);
  };

  return (
    <Pressable
      style={[styles.swatch, { backgroundColor: color }]}
      onPress={handlePress}
      onLongPress={(e) => e.preventDefault()}
    />
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
    marginLeft: 5,
    marginTop: 3,
  },
});
export default React.memo(Swatch);
