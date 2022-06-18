import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  Animated,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Portal, Dialog, DefaultTheme, IconButton } from 'react-native-paper';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';

import uuid from 'react-native-uuid';

import { useSharedValue } from 'react-native-reanimated';

import Pattern from './Pattern';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const PATTERNS = [
  {
    name: 'pattern',
    uri: require('../assets/patterns/pattern.png'),
  },
  {
    name: 'heart',
    uri: require('../assets/patterns/heart.png'),
  },
  {
    name: 'square-pattern',
    uri: require('../assets/patterns/square-pattern.png'),
  },
];

interface Props {
  pattern: string;
  color: string;
  setPattern: (d: string) => void;
}

const PatternSelector: React.FC<Props> = ({ setPattern, pattern, color }) => {
  const [showPalette, setShowPalette] = useState(false);

  const swatchRef = useRef<View>(null);
  const swatchLayoutY = useRef<number>(0);
  const swatchLayoutX = useRef<number>(0);

  const swatchAnimation = useRef<any>(new Animated.Value(0)).current;
  const swatchPosition = useSharedValue<any>(null);
  const caretPosition = useSharedValue<any>(null);

  const openSwatchDialog = () => {
    setShowPalette(true);
  };

  const measureSwatch = () => {
    if (swatchRef.current) {
      swatchRef.current.measure((width, height, px, py, fx, fy) => {
        const dialogWidth = 237;
        const dialogHieght = 225;
        swatchLayoutY.current = fy + py - dialogHieght;
        swatchLayoutX.current = fx + py - dialogWidth;
        if (SCREEN_WIDTH / 2 < fx) {
          swatchPosition.value = { right: 0 };
          caretPosition.value = { right: -5 };
        } else {
          swatchPosition.value = { left: 0 };
          caretPosition.value = { left: -5 };
        }
      });
    }
  };

  const getSelectedPattern = useMemo(() => {
    const p = PATTERNS.find((item) => item.name === pattern);
    if (p) return p.uri;
    else return null;
  }, [pattern]);

  useEffect(() => {
    const keyboardDownSubscription = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.spring(swatchAnimation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardUpSubscription = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        Animated.spring(swatchAnimation, {
          toValue: -100,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardUpSubscription.remove();
      keyboardDownSubscription.remove();
    };
  }, []);

  return (
    <>
      <Portal theme={{colors: {backdrop: 'transparent'}}}>
        <Dialog
          visible={showPalette}
          onDismiss={() => setShowPalette(false)}
          style={[
            styles.dialog,
            { top: swatchLayoutY.current },
            { transform: [{ translateY: swatchAnimation }] },
            { ...swatchPosition.value },
          ]}
        >
          <View style={styles.container}>
            <ScrollView
              persistentScrollbar={true}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.list} onStartShouldSetResponder={() => true}>
                {useMemo(() => {
                  return PATTERNS.map((p) => (
                    <Pattern
                      key={uuid.v4().toString()}
                      uri={p.uri}
                      name={p.name}
                      select={setPattern}
                    />
                  ));
                }, [PATTERNS])}
              </View>
            </ScrollView>
          </View>
          <IconButton
            icon='menu-down'
            size={50}
            color='white'
            style={[
              { position: 'absolute', bottom: -47 },
              { ...caretPosition.value },
            ]}
          />
        </Dialog>
      </Portal>
      <Pressable
        ref={swatchRef}
        style={[styles.swatch, { backgroundColor: color }]}
        onPress={openSwatchDialog}
        onLayout={measureSwatch}
      >
        <ImageBackground
          source={getSelectedPattern}
          imageStyle={[styles.image]}
          resizeMode='cover'
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  swatch: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 10,
    margin: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  dialog: {
    height: 150,
    width: 235,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 1,
    position: 'absolute',
  },
  container: {
    flex: 1,
    paddingVertical: 5,
    position: 'relative',
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
    tintColor: 'white',
    opacity: .75
  },
});

export default PatternSelector;
