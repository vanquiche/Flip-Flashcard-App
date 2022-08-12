import {
  View,
  Text,
  useWindowDimensions,
  LayoutChangeEvent,
  StyleSheet
} from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  scrollTo,
  SharedValue
} from 'react-native-reanimated';

interface Props {
  scrollViewHeight: number;
  children: React.ReactNode;
  onLayout?: (e: LayoutChangeEvent) => void;
  scrollY: SharedValue<number>;
}

const DragSortList = ({
  children,
  scrollViewHeight,
  scrollY,
  onLayout,
}: Props) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const dimensions = useWindowDimensions();

  const handleScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        height: scrollViewHeight,
        width: dimensions.width
      }}
      style={styles.scroll}
      onLayout={(e) => onLayout && onLayout(e)}
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    // borderWidth: 2,
    position: 'relative'
  },
});
export default DragSortList;
