import { View, Text } from 'react-native'
import React from 'react'

import { StackNavigationTypes } from './types'

interface Props extends StackNavigationTypes{

}

const Cards: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Text>Cards</Text>
    </View>
  )
}

export default Cards