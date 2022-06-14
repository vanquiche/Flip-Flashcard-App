import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  Animated,
  ScrollView,
} from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';

import uuid from 'react-native-uuid';

import Swatch from './Swatch';

const defaultColor = [
  '#C0392B',
  '#E74C3C',
  '#9B59B6',
  '#8E44AD',
  '#2980B9',
  '#3498DB',
  '#1ABC9C',
  '#16A085',
  '#27AE60',
  '#2ECC71',
  '#F1C40F',
  '#F39C12',
  '#E67E22',
  '#D35400',
  '#FFFFFF',
  '#BDC3C7',
  '#95A5A6',
  '#7F8C8D',
  '#34495E',
  '#2C3E50',
];

interface Props {
  color: string;
  setColor: (color: string) => void;
}

const SwatchSelector: React.FC<Props> = ({ color, setColor }) => {
  const [showPalette, setShowPalette] = useState(false);

  const swatchColor = {
    backgroundColor: color
  }

  const scaleAnimation = useRef<any>(new Animated.Value(0)).current;

  const expand = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const openSwatchDialog = () => {
    if (Keyboard) {
      Keyboard.dismiss();
      // console.log('keyboard is up')
    }
    setShowPalette(true);
  };

  useEffect(() => {
    if (showPalette) {
      expand();
    } else close();
  }, [showPalette]);

  return (
    <>
      <Portal>
        <Dialog
          visible={showPalette}
          onDismiss={() => setShowPalette(false)}
          style={[styles.dialog, { transform: [{ scale: scaleAnimation }] }]}
        >
          <View
            style={styles.container}
            // entering={ZoomIn}
          >
            <ScrollView
              persistentScrollbar={true}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.list} onStartShouldSetResponder={() => true}>
                {defaultColor.map((swatch) => (
                  <Swatch
                    key={uuid.v4().toString()}
                    color={swatch}
                    onChange={setColor}
                    selected={color === swatch}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </Dialog>
      </Portal>
      <Pressable
        style={[styles.swatch, swatchColor]}
        onPress={openSwatchDialog}
      />
    </>
  );
};

const styles = StyleSheet.create({
  swatch: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 10,
    margin: 0,
  },
  dialog: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SwatchSelector;
