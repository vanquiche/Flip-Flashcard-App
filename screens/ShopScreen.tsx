import React from 'react'

import StackNavigator from '../components/StackNavigator'

import Shop from '../components/Pages/Shop'

const screens = [
  {name: 'Shop', component: Shop}
  // will include online-shop later
]

const ShopScreen = () => {
  return (
    <StackNavigator screens={screens} />
  )
}

export default ShopScreen