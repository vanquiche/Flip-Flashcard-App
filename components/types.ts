import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

export interface StackNavigationTypes {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<
    {
      params: {
        categoryTitle: string;
        categoryRef: string;
        color?: string;
        setRef: string;
        setTitle: string;
      };
    },
    'params'
  >;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  createdAt: Date | number;
  type: 'category';
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

interface undefined {}

export interface User extends undefined {
  _id?: string;
  type: 'user';
  experiencePoints: number;
  username: string;
  level: number;
  heartcoin: number;
  categoryTrack: CategoryTracker[];
  achievements: Achievement[];
  collections: {
    cardDesigns: CardDesign[];
    cardColors: CardColor[];
    themes: Theme[];
  };
  login: {
    lastLogin: Date | number
    streak: number;
  }

}
