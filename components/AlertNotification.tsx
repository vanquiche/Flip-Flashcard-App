import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Text, Title, useTheme } from 'react-native-paper';
import React from 'react';

interface Props {
  message: string;
  visible: boolean;
  dismiss: () => void;
}
const AlertNotification: React.FC<Props> = ({ message, visible, dismiss }) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={dismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.primary },
        ]}
      >
        <Title style={{ color: colors.secondary }}>{message}</Title>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
});

export default AlertNotification;
