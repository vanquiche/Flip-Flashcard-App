import React from 'react';
import StackNavigator from '../components/StackNavigator';
import SignUp from '../components/Pages/SignUp';
import Intro from '../components/Pages/Intro';

const screens = [
  { name: 'Intro', component: Intro },
  { name: 'SignUp', component: SignUp },
];

const SignUpScreen = () => {
  return <StackNavigator screens={screens} hideHeader={true} />;
};

export default SignUpScreen;
