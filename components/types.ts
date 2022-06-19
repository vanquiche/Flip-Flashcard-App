import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

export interface StackNavigationTypes {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<
    {
      params: {
        categoryRef: string;
        color?: string;
        setRef: string;
        design?: string;
        // categoryTitle: string;
        // setTitle: string;
      };
    },
    'params'
  >;
}

export interface Category {
  _id: string;
  type: 'category';
  name: string;
  color: string;
  createdAt: Date | string;
  points: number;
  level: number;
}

export interface Set {
  _id: string;
  type: 'set';
  name: string;
  color: string;
  design: string;
  favorite: boolean;
  createdAt: Date | string;
  categoryRef: string;
}

export interface Flashcard {
  _id: string;
  type: 'flashcard';
  prompt: string;
  solution: string;
  createdAt: Date | string;
  setRef: string;
  categoryRef: string;
}

interface Theme {
  tabColor: string;
  cardColor: string;
  headerColor: string;
}

interface CardDesign {
  name: string;
  design: string;
}

interface CardColor {
  name: string;
  color: string;
}

interface Achievement {
  name: string;
  description: string;
  points: number;
}

export interface User {
  _id?: string;
  type: 'user';
  icon?: string;
  experiencePoints: number;
  username: string;
  level: number;
  heartcoin: number;
  achievements: Achievement[];
  login: {
    week: string[];
    streak: number;
  };
}

type Datatype = 'user';

export const initUser = {
  _id: '',
  type: 'user' as Datatype,
  experiencePoints: 0,
  username: '',
  level: 0,
  heartcoin: 0,
  achievements: [],
  login: {
    week: [],
    streak: 0,
  },
};
