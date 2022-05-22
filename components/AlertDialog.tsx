import { View, StyleSheet } from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Title,
  IconButton,
  useTheme,
} from 'react-native-paper';
import React from 'react';

// const AnimatedDialog = Animated.createAnimatedComponent(Dialog)

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

  return (
    <Portal>
        <Dialog
          style={[styles.dialog, { backgroundColor: colors.primary }]}
          visible={visible}
          onDismiss={onDismiss}
          dismissable={false}
        >
          <Title style={[styles.title, { color: colors.secondary }]}>
            {message}
          </Title>
          <View style={styles.buttonContainer}>
            <IconButton
              style={styles.button}
              icon='close-circle-outline'
              size={50}
              color='white'
              onPress={onDismiss}
            />

            <IconButton
              style={styles.button}
              icon='check-circle-outline'
              size={50}
              color='white'
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
