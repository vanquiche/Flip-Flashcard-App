import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  Animated,
  ScrollView,
  ImageBackground,
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
import Pattern from './Pattern';
import { useAssets } from 'expo-asset';

const PATTERNS =  [
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
  ]

interface Props {
  // pattern: string;
  setPattern: (d: string) => void;
}

const PatternSelector: React.FC<Props> = ({ setPattern }) => {
  const [showPalette, setShowPalette] = useState(false);

  const [assets, error] = useAssets([
    require('../assets/patterns/pattern.png'),
    require('../assets/patterns/heart.png'),
    require('../assets/patterns/square-pattern.png')
  ])

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
                {/* map over list of card patterns */}
                {assets?.map((p, index) => (
                  <Pattern
                    key={uuid.v4().toString()}
                    uri={p}
                    // name={p.name}
                    select={setPattern}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </Dialog>
      </Portal>
      <Pressable style={[styles.swatch]} onPress={openSwatchDialog} />
    </>
  );
};

const styles = StyleSheet.create({
  swatch: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 10,
    margin: 0,
    backgroundColor: 'white',
  },
  dialog: {
    height: 250,
    // minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    // minHeight: 75,
    paddingVertical: 5,
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 45,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'black',
    margin: 5,
  },
  image: {
    height: 45,
    width: 45,
    tintColor: 'white',
  },
});

export default PatternSelector;
