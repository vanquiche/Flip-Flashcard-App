import { View, Text, Button } from 'react-native'
import React from 'react'

import { StackNavigationTypes } from './types'

interface Props extends StackNavigationTypes{

}

const Sets: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Text>Sets</Text>
      <Button title='Cards' onPress={() => navigation.navigate('Cards')}/>
    </View>
  )
}

export default Sets