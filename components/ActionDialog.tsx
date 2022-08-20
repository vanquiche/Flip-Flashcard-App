import { View, StyleSheet, Keyboard, Animated } from 'react-native';
import { Portal, Dialog, IconButton } from 'react-native-paper';
import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import swatchContext from '../contexts/swatchContext';
interface Props {
  children: React.ReactNode;
  visible: boolean;
  title: string;
  disableSubmit?: boolean;
  dismiss: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const ActionDialog = ({
  title,
  children,
  visible,
  disableSubmit,
  dismiss,
  onCancel,
  onSubmit,
}: Props) => {
  const { theme } = useContext(swatchContext);
  const slideAnimation = useRef<any>(new Animated.Value(0)).current;

  // slide and reset dialog when keyboard opens and closes
  useEffect(() => {
    const slideDialogUp = () => {
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
      'keyboardWillShow',
      slideDialogUp
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardWillHide',
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
        style={[
          styles.dialog,
          {
            transform: [{ translateY: slideAnimation }],
            backgroundColor: theme.cardColor,
          },
        ]}
        dismissable={false}
      >
        <Dialog.Title
          style={[
            styles.title,
            {
              color: theme.fontColor,
            },
          ]}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel={title}
        >
          {title}
        </Dialog.Title>
        {children}
        <View style={styles.buttonContainer}>
          <IconButton
            style={styles.button}
            icon='close-circle-outline'
            size={50}
            color={theme.fontColor}
            onPress={onCancel}
            accessible={true}
            accessibilityRole='imagebutton'
            accessibilityLabel='cancel'
            accessibilityHint='cancel action and close dialog window'
            accessibilityState={{ disabled: false }}
          />

          <IconButton
            style={styles.button}
            icon='check-circle-outline'
            size={50}
            color={theme.fontColor}
            onPress={onSubmit}
            disabled={disableSubmit}
            accessible={true}
            accessibilityRole='imagebutton'
            accessibilityLabel='confirm'
            accessibilityHint='confirm action and close dialog window'
            accessibilityState={{ disabled: disableSubmit }}
          />
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'BalooBhaiExtraBold',
    fontSize: 24,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    // marginTop: 10,
  },
  button: {
    width: '48%',
    elevation: 0,
    margin: 0,
  },
});
export default ActionDialog;
