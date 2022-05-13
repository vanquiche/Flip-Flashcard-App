import { View, Text } from 'react-native'
import React from 'react'

import StackNavigator from '../components/StackNavigator'

import Shop from '../components/Shop'

const screens = [
  {name: 'Shop', component: Shop}
]

const ShopScreen = () => {
  return (
    <StackNavigator screens={screens} />
  )
}

export default ShopScreen