import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Title, useTheme } from 'react-native-paper';
import React from 'react';

interface Props {
  message: string;
  visible: boolean;
  textColor?: string;
  bgColor?: string;
  dismiss: () => void;
}
const AlertNotification = ({
  message,
  visible,
  textColor,
  bgColor,
  dismiss,
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={dismiss}
        contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}
        overlayAccessibilityLabel={message}
      >
        <Title
          style={{ color: textColor }}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel={message}
        >
          {message.toUpperCase()}
        </Title>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 30,
    borderRadius: 15,
    minHeight: 150,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default AlertNotification;
