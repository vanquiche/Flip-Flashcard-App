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
  createdAt: Date | number;
  points: number;
  level: number;
}

export interface Set {
  _id: string;
  type: 'set';
  name: string;
  color: string;
  favorite: boolean;
  createdAt: Date | number;
  categoryRef: string;
}

export interface Flashcard {
  _id: string;
  type: 'flashcard';
  prompt: string;
  solution: string;
  createdAt: Date | number;
  setRef: string;
  categoryRef: string;
}

interface CategoryTracker {
  name: string;
  points: number;
  level: number;
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
  experiencePoints: number;
  username: string;
  level: number;
  heartcoin: number;
  achievements: Achievement[];
  collections: {
    cardDesigns: CardDesign[];
    cardColors: CardColor[];
    themes: Theme[];
  };
  login: {
    week: Date[];
    streak: number;
    notify: boolean;
  }

}
