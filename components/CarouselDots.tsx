import { View } from 'react-native';
import React from 'react';
import { Octicons } from '@expo/vector-icons';

interface Props {
  page: number;
  length: number;
}

const CarouselDots = ({ page, length }: Props) => {
  const dotWidth = 15;

  return (
    <View
      style={{
        maxWidth: 350,
        overflow: 'hidden',
        alignSelf: 'center',
      }}
    >
      <View
        style={{
          width: dotWidth * length,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {[...Array(length)].map((_, i) => (
          <Octicons
            name={page === i ? 'dot-fill' : 'dot'}
            size={20}
            color='black'
            key={i}
          />
        ))}
      </View>
    </View>
  );
};

export default CarouselDots;
