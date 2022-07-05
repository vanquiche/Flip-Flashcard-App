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
import { Portal, Dialog, IconButton } from 'react-native-paper';
import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';

import uuid from 'react-native-uuid';

import { useSharedValue } from 'react-native-reanimated';
import Pattern from './Pattern';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

interface Props {
  pattern: string;
  color: string;
  patternList: Record<string, any>;
  setPattern: (d: string) => void;
}

const PatternSelector: React.FC<Props> = ({
  setPattern,
  pattern,
  color,
  patternList,
}) => {
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
        // width of dialog plus padding
        const dialogWidth = 237;
        // height of dialog plus padding
        const dialogHieght = 225;
        swatchLayoutY.current = fy + py - dialogHieght;
        swatchLayoutX.current = fx + py - dialogWidth;
        // if swatch is on left side of screen then position left and vica versa
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

  // shift swatch selector when keyboard shows/hide
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
      <Portal theme={{ colors: { backdrop: 'transparent' } }}>
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
                  const PATTERNS = Object.keys(patternList);

                  return PATTERNS.map((p) => (
                    <Pattern
                      key={uuid.v4().toString()}
                      name={p}
                      select={setPattern}
                      patternList={patternList}
                    />
                  ));
                }, [])}
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
        {patternList[pattern] && (
          <ImageBackground
            source={patternList[pattern]}
            imageStyle={styles.image}
            resizeMode='cover'
          />
        )}
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
    borderWidth: 2,
    borderColor: 'white',
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
    width: 38,
    height: 38,
    tintColor: 'white',
    opacity: 0.75,
  },
});

export default PatternSelector;
