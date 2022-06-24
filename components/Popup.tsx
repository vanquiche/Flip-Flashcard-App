import { View, Text, StyleSheet } from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import React from 'react';

interface Props {
  visible: boolean;
  layout: { x: number; y: number };
  dismiss: () => void;
  onDeletePress: () => void;
  onEditPress: () => void;
}

const Popup: React.FC<Props> = ({
  visible,
  layout,
  dismiss,
  onDeletePress,
  onEditPress,
}) => {
  const { colors } = useTheme();

  const handleEdit = () => {
    onEditPress();
    dismiss();
  };
  const handleDelete = () => {
    onDeletePress();
    dismiss();
  };
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={dismiss}
        style={[
          styles.dialog,
          { position: 'absolute', top: layout.y - 110, left: layout.x },
        ]}
      >
        <View style={styles.buttonContainer}>
          <Button
            mode='contained'
            color={colors.secondary}
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleDelete}
          >
            DELETE
          </Button>
          <Button
            mode='contained'
            color={colors.secondary}
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleEdit}
          >
            EDIT
          </Button>
        </View>
        <IconButton
          icon='menu-down'
          color='white'
          size={50}
          style={[styles.caret]}
        />
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 110,
    justifyContent: 'space-around',
  },
  button: {
    width: 100,
    elevation: 0,
  },
  dialog: {
    padding: 15,
    position: 'relative',
  },
  caret: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    bottom: -40,
    left: 25,
  },
});

export default Popup;
