import { Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Modal, Portal } from 'react-native-paper'

interface Props {
  visible: boolean
}
const Loader = ({visible}: Props) => {
  return (
    <Portal>
      <Modal visible={visible} dismissable={false} style={styles.modal}>
        <ActivityIndicator size='large' color='black' />
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default Loader