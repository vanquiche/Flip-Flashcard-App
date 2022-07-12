import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Title } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

interface Props {
  children: JSX.Element[] | JSX.Element;
  title: string;
  titleColor?: string;
}

const ShopCatalogue = ({ children, title, titleColor }: Props) => {
  return (
    <>
      <Title style={[styles.title, { color: titleColor }]}>{title}</Title>
      <ScrollView
        horizontal
        scrollEnabled
        persistentScrollbar={false}
        contentContainerStyle={styles.container}
      >
        {children}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginBottom: 30
  },
  title: {
    // position: 'absolute',
    // top: 0,
    textAlign: 'center',
    width: SCREEN_WIDTH,
  },
});
export default ShopCatalogue;
