import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import { Title } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

interface Props {
  children: JSX.Element[] | JSX.Element;
  title: string;
  titleColor?: string;
}

const ShopCatalogue = ({ children, title, titleColor }: Props) => {
  const scrollPosition = useSharedValue(0);
  const arrowRightOpacity = useSharedValue(1);
  const arrowLeftOpacity = useSharedValue(1);
  const arrowRightFade = useAnimatedStyle(() => {
    return {
      opacity: withTiming(arrowRightOpacity.value, { duration: 75 }),
    };
  });
  // if user scrolls past beginning of catalogue then render left arrow
  const arrowLeftFade = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        scrollPosition.value > 0 ? arrowLeftOpacity.value : 0,
        { duration: 75 }
      ),
    };
  });
  // do not render left arrow if at beginning of catalogue
  const arrowLeftVisible = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollPosition.value > 0 ? 1 : 0, { duration: 0 }),
    };
  });

  const arrowRightVisible = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollPosition.value > 0 ? 1 : 0, { duration: 0 }),
    };
  });

  const arrowRightImg = require('../assets/images/right-arrow.png');
  const arrowLeftImg = require('../assets/images/left-arrow.png');

  return (
    <View>
      <Title style={{ ...styles.title, color: titleColor }}>{title}</Title>
      <AnimatedImage
        source={arrowRightImg}
        style={[styles.rightArrow, arrowRightFade]}
      />
      <AnimatedImage
        source={arrowLeftImg}
        style={[styles.leftArrow, arrowLeftFade, arrowLeftVisible]}
      />
      <ScrollView
        horizontal
        scrollEnabled
        scrollEventThrottle={275}
        contentContainerStyle={styles.container}
        onScrollBeginDrag={() => {
          // fade out arrows when scrolling
          arrowRightOpacity.value = 0;
          arrowLeftOpacity.value = 0;
        }}
        onMomentumScrollEnd={(e) => {
          // on end fade in arrows
          const { layoutMeasurement, contentOffset, contentSize } =
            e.nativeEvent;
          const reachedEnd =
            layoutMeasurement.width + contentOffset.x >= contentSize.width;
          if (reachedEnd) {
            arrowRightOpacity.value = 0;
          } else {
            arrowRightOpacity.value = 1;
          }
          arrowLeftOpacity.value = 1;
          scrollPosition.value = e.nativeEvent.contentOffset.x;
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    width: SCREEN_WIDTH,
  },
  rightArrow: {
    position: 'absolute',
    right: 10,
    top: '49%',
    zIndex: 100,
    width: 16,
    height: 16,
  },
  leftArrow: {
    position: 'absolute',
    left: 10,
    top: '49%',
    zIndex: 100,
    width: 16,
    height: 16,
  },
});
export default ShopCatalogue;
