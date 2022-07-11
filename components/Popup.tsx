import { View, Text, StyleSheet } from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import React from 'react';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const { Popover } = renderers;

interface Props {
  visible: boolean;
  popoverStyle?: Object;
  dismiss: () => void;
  onDeletePress: () => void;
  onEditPress: () => void;
}

const Popup = ({
  visible,
  popoverStyle,
  dismiss,
  onDeletePress,
  onEditPress,
}: Props) => {
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
    <Menu
      renderer={Popover}
      opened={visible}
      onBackdropPress={dismiss}
      rendererProps={{
        placement: 'top',
        // anchorStyle: { display: 'none' },
      }}
      style={[popoverStyle, styles.popover]}
    >
      <MenuTrigger />

      <MenuOptions optionsContainerStyle={styles.menuOptions}>
        <MenuOption>
          <Button
            mode='contained'
            color={colors.secondary}
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleDelete}
          >
            DELETE
          </Button>
        </MenuOption>
        <MenuOption>
          <Button
            mode='contained'
            color={colors.secondary}
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleEdit}
          >
            EDIT
          </Button>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  popover: {
    // position: 'absolute'
  },
  menuOptions: {
    padding: 15, borderRadius: 10,
    elevation: 0,
    shadowOpacity: 0
  },
  buttonContainer: {
    height: 115,
    justifyContent: 'space-evenly',
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
