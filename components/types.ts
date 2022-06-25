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

export type CardType = 'category' | 'set' | 'flashcard'

export interface Collection {
  _id: string;
  type: CardType
  name?: string;
  color?: string;
  design?: string;
  favorite?: boolean;
  createdAt: string | Date;
  categoryRef?: string;
  setRef?: string;
  prompt?: string;
  solution?: string;
  points?: number;
}

export interface Category {
  _id: string;
  type: 'category';
  name: string;
  color: string;
  createdAt: Date | string;
  points: number;
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

export interface Theme {
  name: string;
  fontColor: string;
  cardColor: string;
  tabColor: string;
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


export interface Login {
  _id: string;
  type: 'login';
  date: string;
}

export interface CompletedRef {
  _id: string;
  set: string;
  type: 'completed';
}

export type Status = 'complete' | 'loading' | 'idle';

export interface Action {
  cardType?: CardType;
  id?: string;
  card?: Collection;
  query?: any;
}
export const defaultTheme: Theme = {
  name: 'default',
  fontColor: 'black',
  cardColor: 'tomato',
  tabColor: 'pink',
  headerColor: 'pink',
};

export interface User {
  _id: string;
  type: 'user';
  xp: number;
  username: string;
  heartcoin: number;
  achievements: Achievement[];
  completedQuiz: string[];
  login: string[];
  streak: number;
  theme: Theme
}

type Datatype = 'user';

export const initUser: User = {
  _id: '',
  type: 'user' as Datatype,
  username: '',
  xp: 0,
  heartcoin: 0,
  achievements: [],
  completedQuiz: [],
  login: [],
  streak: 0,
  theme: defaultTheme
};

