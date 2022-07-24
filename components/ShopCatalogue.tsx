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
import { AntDesign } from '@expo/vector-icons';

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

  return (
    <View>
      <Title style={{ ...styles.title, color: titleColor }}>{title}</Title>

      <Animated.View style={[styles.rightArrow, arrowRightFade]}>
        <AntDesign name='caretright' size={24} color='black' />
      </Animated.View>

      <Animated.View style={[styles.leftArrow, arrowLeftFade, arrowLeftVisible]}>
        <AntDesign name='caretleft' size={24} color='black' />
      </Animated.View>
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
    right: 5,
    top: '46%',
    zIndex: 100,
    // width: 16,
    // height: 16,
  },
  leftArrow: {
    position: 'absolute',
    left: 5,
    top: '46%',
    zIndex: 100,
    // width: 16,
    // height: 16,
  },
});
export default ShopCatalogue;
