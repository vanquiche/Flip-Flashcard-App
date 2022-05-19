import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

export interface StackNavigationTypes {
  navigation: StackNavigationProp<ParamListBase>;
  route: RouteProp<{ params: { title: string; id: string, color?: string } }, 'params'>;
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

export interface PaletteProviderType {
  selection: string | undefined;
  setColor: React.Dispatch<string>;
}
