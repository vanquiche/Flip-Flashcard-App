import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

export interface StackNavigationTypes {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<{ params: { categoryTitle: string; categoryRef: string, color?: string, setRef: string, setTitle: string } }, 'params'>;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Set {
  categoryRef: string;
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Flashcard {
  setRef: string;
  categoryRef: string;
  id: string;
  prompt: string;
  solution: string;
  createdAt: Date;
}
export interface PaletteProviderType {
  selection: string | undefined;
  setColor: React.Dispatch<string>;
}
