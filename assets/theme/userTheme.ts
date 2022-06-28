import {Theme} from '../../components/types'
import { defaultTheme } from '../../components/types';
const themes: Theme[] = [
  defaultTheme,
  {
    name: 'Sprout',
    cardColor: 'lightgreen',
    fontColor: 'white',
    tabColor: 'green',
    headerColor: 'green',
    bgColor: 'whitesmoke',
    iconColor: 'white'
  },
  {
    name: 'Sea Side',
    cardColor: 'lightblue',
    fontColor: 'white',
    tabColor: 'blue',
    headerColor: 'blue',
    bgColor: 'white',
    iconColor: 'white'
  },
];

export default themes;
