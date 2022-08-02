import {  StyleProp, TextStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import React from 'react';

interface Props {
  defaultValue?: string;
  style?: StyleProp<TextStyle>;
  label?: string;
  onChange: (text: string) => void;
}

const CustomTextInput = ({ defaultValue, onChange, style, label }: Props) => {
  const customStyles = style;

  return (
    <TextInput
      mode='outlined'
      outlineColor='white'
      activeOutlineColor='black'
      label={label}
      maxLength={32}
      autoCorrect={false}
      defaultValue={defaultValue}
      onChange={({ nativeEvent: { text } }) => onChange(text)}
      style={customStyles}
    />
  );
};

export default CustomTextInput;
