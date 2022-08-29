import { View, Image, useWindowDimensions } from 'react-native';
import React from 'react';
import { Title, Text } from 'react-native-paper';


interface Slide {
  key: number;
  title: string;
  text: string;
  image: any;
  backgroundColor: string;
}

interface Props {
  slide: Slide;
}

const IntroSlide = ({ slide }: Props) => {
  const dimension = useWindowDimensions();
  const imageSize = dimension.width * 0.95;
  const firstSlide = slide.key === 0;
  const logo = require('../assets/adaptive-icon.png');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: slide.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}
    >
      {firstSlide && (
        <Image
          style={{ width: 65, height: 65, marginBottom: 20 }}
          source={logo}
        />
      )}
      <Title style={{ textAlign: 'center', width: '85%' }}>{slide.title}</Title>
      {slide.image && (
        <Image
          style={{ width: imageSize, height: imageSize, marginVertical: 20 }}
          source={slide.image}
        />
      )}
      <Text style={{ textAlign: 'center', fontSize: 16, width: '85%' }}>
        {slide.text}
      </Text>
    </View>
  );
};

export default IntroSlide;
