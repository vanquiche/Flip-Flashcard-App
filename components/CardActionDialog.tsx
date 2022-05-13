import { View, Text, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';
import React, {useEffect} from 'react';

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

  useEffect(() => {
    
  }, [])
  return (
    <Portal>

      <Dialog visible={visible} onDismiss={dismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        {children}
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            mode='contained'
            onPress={onCancel}
            >
            {buttonTitle[0]}
          </Button>
          <Button style={styles.button} mode='contained' onPress={onSubmit} disabled={disableSubmit}>
            {buttonTitle[1]}
          </Button>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  dialog: {
    padding: 20,
    // marginBottom: 150
  },
  title: {
    textAlign: 'center'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  button: {
    width: '48%',
    elevation: 0
  },
})

export default CardActionDialog;
