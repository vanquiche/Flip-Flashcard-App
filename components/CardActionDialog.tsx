import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Animated,
} from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';
import React, { useEffect, useRef } from 'react';


interface Props {
  children: React.ReactNode;
  visible: boolean;
  title: string;
  buttonTitle: string[];
  disableSubmit?: boolean;
  dismiss: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const CardActionDialog: React.FC<Props> = ({
  title,
  children,
  visible,
  buttonTitle,
  disableSubmit,
  dismiss,
  onCancel,
  onSubmit,
}) => {
  const slideAnimation = useRef<any>(new Animated.Value(0)).current;

  useEffect(() => {
    const slideDialogUp = () => {
      console.log('keyboard open');
      Animated.spring(slideAnimation, {
        toValue: -100,
        useNativeDriver: true,
      }).start();
    };

    const slideDialogDown = () => {
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      slideDialogUp
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      slideDialogDown
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={dismiss}
        style={[styles.dialog, { transform: [{ translateY: slideAnimation }] }]}
      >
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        {children}
        <View style={styles.buttonContainer}>
          <Button style={styles.button} mode='contained' onPress={onCancel}>
            {buttonTitle[0]}
          </Button>
          <Button
            style={styles.button}
            mode='contained'
            onPress={onSubmit}
            disabled={disableSubmit}
          >
            {buttonTitle[1]}
          </Button>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    width: '48%',
    elevation: 0,
  },
});

export default CardActionDialog;
