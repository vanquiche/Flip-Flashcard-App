import { View, StyleSheet, Animated } from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Title,
  IconButton,
  useTheme,
} from 'react-native-paper';
import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  onConfirm: () => void;
}

const AlertDialog: React.FC<Props> = ({
  message,
  visible,
  onDismiss,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const {user} = useSelector((state: RootState) => state.store)
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

  useEffect(() => {
    if (visible) {
      expand();
    } else close();
  }, [visible]);

  return (
    <Portal>
      <Dialog
        style={[
          styles.dialog,
          { backgroundColor: user.theme.cardColor },
          { transform: [{ scale: scaleAnimation }] },
        ]}
        visible={visible}
        dismissable={false}
      >
        <Title style={[styles.title, { color: user.theme.fontColor }]}>
          {message.toUpperCase()}
        </Title>
        <View style={styles.buttonContainer}>
          <IconButton
            style={styles.button}
            icon='close-circle-outline'
            size={50}
            color={user.theme.fontColor}
            onPress={onDismiss}
          />

          <IconButton
            style={styles.button}
            icon='check-circle-outline'
            size={50}
            color={user.theme.fontColor}
            onPress={onConfirm}
          />
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'BalooBhaiExtraBold',
    fontSize: 22,
    marginTop: 35,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    // marginTop: 15,
  },
  button: {
    width: '48%',
    elevation: 0,
  },
});

export default AlertDialog;
