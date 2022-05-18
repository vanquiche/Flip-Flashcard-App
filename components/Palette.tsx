import { View, ScrollView, Text, StyleSheet } from 'react-native';
import React from 'react';
import uuid from 'react-native-uuid';

import PaletteContext from '../contexts/PaletteProvider';

import Swatch from './Swatch';

interface Props {
  palette: string[];
  selection?: string;
  setColor: (color: string) => void;
}

const Palette: React.FC<Props> = ({ palette, setColor, selection }) => {
  return (
    <PaletteContext.Provider value={{ selection, setColor }}>
      <View style={styles.container} >
        <ScrollView
          persistentScrollbar={true}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{flexGrow: 1}}
          // contentContainerStyle={styles.list}
        >
          <View style={styles.list} onStartShouldSetResponder={() => true}>

          {palette.map((color) => (
            <Swatch key={uuid.v4().toString()} color={color} />
            ))}
            </View>
        </ScrollView>
      </View>
    </PaletteContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '85%',
    flex: 1,
    height: 150,
    borderWidth: 5,
    borderColor: 'lightblue',
    borderRadius: 5,
    paddingVertical: 5,
  },
  list: {
    // flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default Palette;
