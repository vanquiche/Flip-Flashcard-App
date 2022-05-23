import { View, StyleSheet, Keyboard, Animated, ScrollView } from 'react-native';
import { Portal, Dialog, Button, IconButton, useTheme } from 'react-native-paper';
import React, { useEffect, useRef } from 'react';
interface Props {
  children: React.ReactNode;
  visible: boolean;
  title: string;
  disableSubmit?: boolean;
  dismiss: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const ActionDialog: React.FC<Props> = ({
  title,
  children,
  visible,
  disableSubmit,
  dismiss,
  onCancel,
  onSubmit
}) => {
  const {
    colors
  } = useTheme();
  const slideAnimation = useRef<any>(new Animated.Value(0)).current;
  useEffect(() => {
    const slideDialogUp = () => {
      Animated.spring(slideAnimation, {
        toValue: -100,
        useNativeDriver: true
      }).start();
    };

    const slideDialogDown = () => {
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    };

    const showSubscription = Keyboard.addListener('keyboardWillShow', slideDialogUp);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', slideDialogDown);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return <Portal>
      <Dialog visible={visible} onDismiss={dismiss} style={[styles.dialog, {
      transform: [{
        translateY: slideAnimation
      }],
      backgroundColor: colors.primary
    }]} dismissable={false}>
        {
        /* scrollview to prevent taps outside of keyboard to register when open */
      }
        <ScrollView>
          <Dialog.Title style={[styles.title, {
          color: colors.secondary
        }]}>{title}</Dialog.Title>
          {children}
          <View style={styles.buttonContainer}>
            <IconButton style={styles.button} icon='close-circle-outline' size={50} color='white' onPress={onCancel} />

            <IconButton style={styles.button} icon='check-circle-outline' size={50} color='white' onPress={onSubmit} disabled={disableSubmit} />
          </View>
        </ScrollView>
      </Dialog>
    </Portal>;
};

const styles = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  title: {
    textAlign: 'center',
    fontFamily: 'BalooBhaiExtraBold',
    fontSize: 24
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginTop: 15
  },
  button: {
    width: '48%',
    elevation: 0
  }
});
export default ActionDialog;