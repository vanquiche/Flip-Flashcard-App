import React from 'react';
import { StackNavigationTypes } from '../types';
import AppIntroSlider from 'react-native-app-intro-slider';
import IntroSlide from '../IntroSlide';

interface Props extends StackNavigationTypes {}

const Intro = ({ navigation }: Props) => {
  const completeIntro = () => {
    navigation.replace('SignUp');
  };

  const slides = [
    {
      key: 0,
      title: 'Welcome to Flip',
      text: "The only flashcard app you'll need!",
      image: null,
      backgroundColor: 'lightblue',
    },
    {
      key: 1,
      title: 'There is no place like home!',
      text: 'All your important tools in one place.',
      image: require('../../assets/images/walkthrough-slide_001.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 2,
      title: '80% of success is showing up!',
      text: 'Earn bonus Heartcoins for logging in consecutively!',
      image: require('../../assets/images/walkthrough-slide_002.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 3,
      title: "Flashcards are a girl's best friend!",
      text: 'Quickly access your favorite Sets.',
      image: require('../../assets/images/walkthrough-slide_003.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 4,
      title: 'Data + Charts = \u2764',
      text: 'Track your progress over time.',
      image: require('../../assets/images/walkthrough-slide_004.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 5,
      title: 'Categories \u279c Sets \u2026',
      text: 'Organize your cards by Categories.',
      image: require('../../assets/images/walkthrough-slide_005.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 6,
      title: '\u2026 Sets \u279c Flashcards',
      text: 'Create and organize Sets within Categories.',
      image: require('../../assets/images/walkthrough-slide_006.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 7,
      title: 'Catch you on the flip-side!',
      text: 'Take quizes to test your memory and earn XP.',
      image: require('../../assets/images/walkthrough-slide_007.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 8,
      title: "Shop 'til you drop!",
      text: 'Purchase new colors, patterns, and themes with your Heartcoins.',
      image: require('../../assets/images/walkthrough-slide_008.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 9,
      title: 'A little progress each day adds up to big results!',
      text: 'The more you practice, the more you level up! Earn Heartcoins with every level!',
      image: require('../../assets/images/walkthrough-slide_009.png'),
      backgroundColor: 'lightblue',
    },
    {
      key: 10,
      title: 'New look, who dis?',
      text: 'Keep things interesting by changing up your look with themes.',
      image: require('../../assets/images/walkthrough-slide_010.png'),
      backgroundColor: 'lightblue',
    },
  ];

  return (
    <AppIntroSlider
      renderItem={({ item }) => <IntroSlide slide={item} />}
      data={slides}
      onDone={completeIntro}
    />
  );
};

export default Intro;
