import { View, StyleSheet, Animated } from 'react-native';
import { Dialog, Portal, Title, IconButton } from 'react-native-paper';
import React, { useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import swatchContext from '../contexts/swatchContext';

interface Props {
  visible: boolean;
  message: string;
  disable?: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

const AlertDialog = ({
  message,
  visible,
  disable,
  onDismiss,
  onConfirm,
}: Props) => {
  const { theme } = useContext(swatchContext);
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
          { backgroundColor: theme.cardColor },
          { transform: [{ scale: scaleAnimation }] },
        ]}
        visible={visible}
        dismissable={false}
      >
        <Title
          style={[styles.title, { color: theme.fontColor }]}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel={message}
        >
          {message.toUpperCase()}
        </Title>
        <View style={styles.buttonContainer}>
          <IconButton
            style={styles.button}
            icon='close-circle-outline'
            size={50}
            color={theme.fontColor}
            onPress={onDismiss}
            accessible={true}
            accessibilityRole='imagebutton'
            accessibilityLabel='cancel action and close dialog window'
            accessibilityState={{disabled: false}}
          />

          <IconButton
            style={styles.button}
            icon='check-circle-outline'
            size={50}
            color={theme.fontColor}
            onPress={onConfirm}
            disabled={disable}
            accessible={true}
            accessibilityRole='imagebutton'
            accessibilityLabel='confirm action and close dialog window'
            accessibilityState={{disabled: disable}}
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
